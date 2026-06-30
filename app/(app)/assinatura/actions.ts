"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getAuthContext, requireRole } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { getPlan } from "@/lib/plans";
import {
  AsaasApiError,
  cancelAsaasSubscription,
  createAsaasCheckout,
  isAsaasConfigured,
  isValidCpfCnpj,
  normalizeCpfCnpj,
} from "@/lib/billing-asaas";

export type CheckoutResult =
  | { ok: true; mode: "fake" }
  | { ok: true; mode: "asaas"; paymentUrl: string }
  | { ok: false; error: string };

/**
 * Inicia checkout de assinatura recorrente no Asaas.
 * Sem ASAAS_API_KEY: fallback simulado (apenas desenvolvimento).
 *
 * Webhook: POST /api/billing/webhook — eventos PAYMENT_CONFIRMED, PAYMENT_OVERDUE, etc.
 */
export async function createCheckoutSession(
  planId: string,
  cpfCnpj?: string,
): Promise<CheckoutResult> {
  const ctx = await getAuthContext();
  requireRole(ctx, ["OWNER", "ADMIN"]);

  const plan = getPlan(planId);
  if (!plan || plan.priceMonthly === null) {
    return { ok: false, error: "Plano inválido ou indisponível para autoatendimento." };
  }

  if (!isAsaasConfigured()) {
    await subscribeFake(planId);
    return { ok: true, mode: "fake" };
  }

  const digits = normalizeCpfCnpj(cpfCnpj ?? "");
  if (!isValidCpfCnpj(digits)) {
    return { ok: false, error: "Informe um CPF ou CNPJ válido para emitir a cobrança." };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const org = ctx.organization;
  const session = await auth();
  const sessionEmail = session?.user?.email;
  if (!sessionEmail) {
    return { ok: false, error: "E-mail da conta não encontrado." };
  }

  if (org.asaasSubscriptionId) {
    try {
      await cancelAsaasSubscription(org.asaasSubscriptionId);
    } catch (e) {
      console.warn("[Asaas] could not cancel previous subscription:", e);
    }
  }

  try {
    const checkout = await createAsaasCheckout({
      orgId: ctx.orgId,
      customerId: org.asaasCustomerId,
      customerName: org.name,
      customerEmail: sessionEmail,
      cpfCnpj: digits,
      planId: plan.id,
      planName: plan.name,
      value: plan.priceMonthly,
      appUrl,
    });

    await prisma.organization.update({
      where: { id: ctx.orgId },
      data: {
        plan: plan.id,
        asaasCustomerId: checkout.customerId,
        asaasSubscriptionId: checkout.subscriptionId,
        subscriptionStatus: "PAST_DUE",
      },
    });

    revalidatePath("/assinatura");
    revalidatePath("/dashboard");

    return { ok: true, mode: "asaas", paymentUrl: checkout.paymentUrl };
  } catch (e) {
    if (e instanceof AsaasApiError) {
      console.error("[Asaas] checkout error:", e.status, e.body);
    } else {
      console.error("[Asaas] checkout exception:", e);
    }
    return { ok: false, error: "Não foi possível iniciar o pagamento. Tente novamente." };
  }
}

/** Ação do formulário de assinatura: checkout Asaas ou fallback simulado. */
export async function subscribePlan(formData: FormData): Promise<void> {
  const planId = String(formData.get("planId") ?? "");
  let cpfCnpj = String(formData.get("cpfCnpj") ?? "");
  if (!cpfCnpj.trim()) {
    const ctx = await getAuthContext();
    const config = ctx.organization.config as { billingCpfCnpj?: string } | null;
    cpfCnpj = config?.billingCpfCnpj ?? "";
  }
  const result = await createCheckoutSession(planId, cpfCnpj);
  if (!result.ok) throw new Error(result.error);
  if (result.mode === "asaas") {
    redirect(result.paymentUrl);
  }
}

/**
 * Assinatura SIMULADA. Marca a organização como ATIVA no plano escolhido.
 * Usado quando ASAAS_API_KEY não está configurado.
 */
export async function subscribeFake(planId: string): Promise<void> {
  const ctx = await getAuthContext();
  requireRole(ctx, ["OWNER", "ADMIN"]);

  const plan = getPlan(planId);
  if (!plan) throw new Error("Plano inválido");

  await prisma.organization.update({
    where: { id: ctx.orgId },
    data: {
      plan: plan.id,
      subscriptionStatus: "ACTIVE",
    },
  });

  revalidatePath("/assinatura");
  revalidatePath("/dashboard");
}

export async function cancelSubscription(): Promise<void> {
  const ctx = await getAuthContext();
  requireRole(ctx, ["OWNER", "ADMIN"]);

  const org = ctx.organization;

  if (org.asaasSubscriptionId && isAsaasConfigured()) {
    try {
      await cancelAsaasSubscription(org.asaasSubscriptionId);
    } catch (e) {
      console.error("[Asaas] cancel error:", e);
      throw new Error("Não foi possível cancelar a assinatura no Asaas. Tente novamente.");
    }
  }

  await prisma.organization.update({
    where: { id: ctx.orgId },
    data: {
      subscriptionStatus: "CANCELED",
      asaasSubscriptionId: null,
    },
  });

  revalidatePath("/assinatura");
  revalidatePath("/dashboard");
}
