import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkApiRateLimit, apiRateLimitResponse } from "@/lib/api-rate-limit";
import {
  parseBillingExternalReference,
  subscriptionStatusFromAsaasEvent,
  verifyAsaasWebhookToken,
  type AsaasWebhookBody,
} from "@/lib/billing-asaas";

async function resolveOrgUpdate(body: AsaasWebhookBody): Promise<{
  orgId: string;
  planId?: string;
  status: NonNullable<ReturnType<typeof subscriptionStatusFromAsaasEvent>>;
} | null> {
  const status = subscriptionStatusFromAsaasEvent(body.event, body.payment?.status);
  if (!status) return null;

  const externalRef =
    body.payment?.externalReference ??
    body.subscription?.externalReference ??
    null;

  const parsed = parseBillingExternalReference(externalRef);
  if (parsed) {
    return { orgId: parsed.orgId, planId: parsed.planId, status };
  }

  const subscriptionId = body.payment?.subscription ?? body.subscription?.id;
  if (subscriptionId) {
    const org = await prisma.organization.findFirst({
      where: { asaasSubscriptionId: subscriptionId },
      select: { id: true, plan: true },
    });
    if (org) {
      return { orgId: org.id, planId: org.plan, status };
    }
  }

  const customerId = body.payment?.customer ?? body.subscription?.customer;
  if (customerId) {
    const org = await prisma.organization.findFirst({
      where: { asaasCustomerId: customerId },
      select: { id: true, plan: true },
    });
    if (org) {
      return { orgId: org.id, planId: org.plan, status };
    }
  }

  return null;
}

export async function POST(req: NextRequest) {
  const rl = checkApiRateLimit("billing-webhook", 120, 60_000);
  if (!rl.ok) return apiRateLimitResponse(rl.retryAfterMs);

  if (!verifyAsaasWebhookToken(req.headers.get("asaas-access-token"))) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  const raw = await req.text();
  let body: AsaasWebhookBody;
  try {
    body = JSON.parse(raw) as AsaasWebhookBody;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const eventType = body.event ?? "unknown";
  console.info("[billing/webhook] Asaas evento:", eventType, body.payment?.id ?? body.subscription?.id);

  const update = await resolveOrgUpdate(body);
  if (update) {
    await prisma.organization.update({
      where: { id: update.orgId },
      data: {
        ...(update.planId ? { plan: update.planId } : {}),
        subscriptionStatus: update.status,
      },
    });
  }

  return NextResponse.json({ received: true });
}
