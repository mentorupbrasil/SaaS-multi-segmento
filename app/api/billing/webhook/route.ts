import { NextRequest, NextResponse } from "next/server";
import type { SubscriptionStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { checkApiRateLimit, apiRateLimitResponse } from "@/lib/api-rate-limit";

type MpWebhookBody = {
  type?: string;
  action?: string;
  data?: { id?: string };
};

function verifyWebhookSignature(req: NextRequest, rawBody: string): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) return true;

  const signature = req.headers.get("x-signature") ?? req.headers.get("x-hub-signature");
  if (!signature) return false;

  // Mercado Pago envia x-signature com ts e v1; validação simplificada por secret no query.
  const urlSecret = req.nextUrl.searchParams.get("secret");
  return urlSecret === secret || signature.includes(secret);
}

/**
 * Webhook do Mercado Pago.
 * Configure MERCADOPAGO_WEBHOOK_SECRET e external_reference orgId:planId na preferência.
 */
export async function POST(req: NextRequest) {
  const rl = checkApiRateLimit("billing-webhook", 120, 60_000);
  if (!rl.ok) return apiRateLimitResponse(rl.retryAfterMs);

  const raw = await req.text();
  if (!verifyWebhookSignature(req, raw)) {
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 });
  }

  let body: MpWebhookBody;
  try {
    body = JSON.parse(raw) as MpWebhookBody;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const eventType = body.type ?? body.action ?? "unknown";
  console.info("[billing/webhook] evento:", eventType, body.data?.id);

  const externalRef = req.nextUrl.searchParams.get("external_reference");
  if (externalRef?.includes(":")) {
    const [orgId, planId] = externalRef.split(":");
    if (orgId && planId) {
      const status: SubscriptionStatus | null =
        eventType.includes("authorized") || eventType === "payment.created"
          ? "ACTIVE"
          : eventType.includes("cancel") || eventType.includes("rejected")
            ? "CANCELED"
            : eventType.includes("past_due") || eventType.includes("pending")
              ? "PAST_DUE"
              : null;

      if (status) {
        await prisma.organization.update({
          where: { id: orgId },
          data: { plan: planId, subscriptionStatus: status },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
