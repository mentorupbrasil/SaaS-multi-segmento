import { NextRequest, NextResponse } from "next/server";
import type { SubscriptionStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

type MpWebhookBody = {
  type?: string;
  action?: string;
  data?: { id?: string };
};

/**
 * Webhook do Mercado Pago (stub).
 * Configure a URL em: https://www.mercadopago.com.br/developers/panel/app
 * Eventos esperados: payment, subscription_preapproval, merchant_order.
 *
 * Em produção, valide a assinatura com MERCADOPAGO_WEBHOOK_SECRET
 * e busque o pagamento/assinatura na API antes de atualizar o banco.
 */
export async function POST(req: NextRequest) {
  let body: MpWebhookBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const eventType = body.type ?? body.action ?? "unknown";
  console.info("[billing/webhook] evento recebido:", eventType, body.data?.id);

  // Stub: em produção, consultar GET /v1/payments/{id} ou preapproval e ler external_reference.
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
          data: {
            plan: planId,
            subscriptionStatus: status,
          },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
