import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const SUPPORTED_PROVIDERS = ["mercadopago", "whatsapp"] as const;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
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

  console.log(`[webhook:${normalized}]`, payload);

  if (normalized === "mercadopago") {
    // Stub: reconciliar pagamento PIX/cartão com FinancialEntry nas próximas fases.
    return NextResponse.json({ received: true, provider: normalized, action: "logged" });
  }

  if (normalized === "whatsapp") {
    // Stub: processar mensagens inbound / status de entrega.
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
  });
}
