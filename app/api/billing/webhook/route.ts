import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkApiRateLimit, apiRateLimitResponse } from "@/lib/api-rate-limit";
import {
  fetchMercadoPagoPayment,
  parseExternalReference,
  subscriptionStatusFromPayment,
} from "@/lib/billing-mp";

type MpWebhookBody = {
  type?: string;
  action?: string;
  data?: { id?: string };
};

function verifyWebhookSignature(req: NextRequest): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) return true;
  const urlSecret = req.nextUrl.searchParams.get("secret");
  return urlSecret === secret;
}

export async function POST(req: NextRequest) {
  const rl = checkApiRateLimit("billing-webhook", 120, 60_000);
  if (!rl.ok) return apiRateLimitResponse(rl.retryAfterMs);

  if (!verifyWebhookSignature(req)) {
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 });
  }

  const raw = await req.text();
  let body: MpWebhookBody;
  try {
    body = JSON.parse(raw) as MpWebhookBody;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const eventType = body.type ?? body.action ?? "unknown";
  const paymentId = body.data?.id;
  console.info("[billing/webhook] evento:", eventType, paymentId);

  let externalRef = req.nextUrl.searchParams.get("external_reference") ?? undefined;
  let mpStatus: string | undefined;

  if ((eventType === "payment" || eventType.includes("payment")) && paymentId) {
    const payment = await fetchMercadoPagoPayment(String(paymentId));
    if (payment) {
      externalRef = externalRef ?? payment.external_reference;
      mpStatus = payment.status;
    }
  }

  const parsed = parseExternalReference(externalRef);
  if (parsed) {
    const status =
      subscriptionStatusFromPayment(mpStatus) ??
      (eventType.includes("authorized") ? "ACTIVE" : null) ??
      (eventType.includes("cancel") || eventType.includes("rejected") ? "CANCELED" : null) ??
      (eventType.includes("past_due") || eventType.includes("pending") ? "PAST_DUE" : null);

    if (status) {
      await prisma.organization.update({
        where: { id: parsed.orgId },
        data: { plan: parsed.planId, subscriptionStatus: status },
      });
    }
  }

  return NextResponse.json({ received: true });
}
