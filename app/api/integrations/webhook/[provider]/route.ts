import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const SUPPORTED_PROVIDERS = ["mercadopago", "whatsapp"] as const;

function verifyWebhookAuth(request: Request): boolean {
  const secret = process.env.INTEGRATION_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }
  const header = request.headers.get("x-webhook-secret")?.trim();
  const authHeader = request.headers.get("authorization")?.trim();
  if (header === secret) return true;
  if (authHeader === `Bearer ${secret}`) return true;
  return false;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  if (!verifyWebhookAuth(request)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { provider } = await params;
  const normalized = provider.toLowerCase();

  if (!SUPPORTED_PROVIDERS.includes(normalized as (typeof SUPPORTED_PROVIDERS)[number])) {
    return NextResponse.json({ error: "Provedor não suportado." }, { status: 404 });
  }

  let payload: unknown = null;
  try {
    payload = await request.json();
  } catch {
    payload = null;
  }

  if (process.env.NODE_ENV !== "production") {
    console.log(`[webhook:${normalized}]`, payload);
  }

  if (normalized === "mercadopago") {
    return NextResponse.json({ received: true, provider: normalized, action: "logged" });
  }

  if (normalized === "whatsapp") {
    const data = payload as { organizationId?: string } | null;
    if (data?.organizationId) {
      const integration = await prisma.integrationConfig.findUnique({
        where: {
          organizationId_provider: {
            organizationId: data.organizationId,
            provider: "whatsapp",
          },
        },
      });
      if (!integration?.enabled) {
        return NextResponse.json({ error: "WhatsApp não habilitado." }, { status: 403 });
      }
    }
    return NextResponse.json({ received: true, provider: normalized, action: "logged" });
  }

  return NextResponse.json({ received: true });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  return NextResponse.json({
    provider,
    status: "webhook_stub",
    methods: ["POST"],
    auth: "x-webhook-secret or Authorization: Bearer INTEGRATION_WEBHOOK_SECRET",
  });
}
