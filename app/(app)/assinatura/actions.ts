"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getAuthContext, requireRole } from "@/lib/auth-context";
import { getPlan } from "@/lib/plans";

export type CheckoutResult =
  | { ok: true; mode: "fake" }
  | { ok: true; mode: "mercadopago"; initPoint: string }
  | { ok: false; error: string };

/**
 * Inicia checkout de assinatura.
 * Com MERCADOPAGO_ACCESS_TOKEN: cria preferência no Mercado Pago e retorna init_point.
 * Sem token: fallback para subscribeFake (assinatura simulada).
 *
 * Webhook: POST /api/billing/webhook — processa eventos do Mercado Pago
 * (payment, subscription_preapproval) e atualiza organization.subscriptionStatus.
 */
export async function createCheckoutSession(planId: string): Promise<CheckoutResult> {
  const ctx = await getAuthContext();
  requireRole(ctx, ["OWNER", "ADMIN"]);

  const plan = getPlan(planId);
  if (!plan || plan.priceMonthly === null) {
    return { ok: false, error: "Plano inválido ou indisponível para autoatendimento." };
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim();
  if (!accessToken) {
    await subscribeFake(planId);
    return { ok: true, mode: "fake" };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const backUrl = `${appUrl}/assinatura`;

  const session = await auth();
  const payerEmail = session?.user?.email ?? undefined;

  try {
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            id: plan.id,
            title: `GestorPro — Plano ${plan.name}`,
            quantity: 1,
            unit_price: plan.priceMonthly,
            currency_id: "BRL",
          },
        ],
        ...(payerEmail ? { payer: { email: payerEmail } } : {}),
        external_reference: `${ctx.orgId}:${plan.id}`,
        back_urls: {
          success: backUrl,
          failure: backUrl,
          pending: backUrl,
        },
        auto_return: "approved",
        notification_url: `${appUrl}/api/billing/webhook`,
        metadata: { orgId: ctx.orgId, planId: plan.id },
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("[Mercado Pago] checkout error:", response.status, detail);
      return { ok: false, error: "Não foi possível iniciar o pagamento. Tente novamente." };
    }

    const data = (await response.json()) as { init_point?: string; sandbox_init_point?: string };
    const initPoint = data.init_point ?? data.sandbox_init_point;
    if (!initPoint) {
      return { ok: false, error: "Resposta inválida do Mercado Pago." };
    }

    return { ok: true, mode: "mercadopago", initPoint };
  } catch (e) {
    console.error("[Mercado Pago] checkout exception:", e);
    return { ok: false, error: "Erro ao conectar com o Mercado Pago." };
  }
}

/** Ação do formulário de assinatura: checkout MP ou fallback simulado. */
export async function subscribePlan(planId: string): Promise<void> {
  const result = await createCheckoutSession(planId);
  if (!result.ok) throw new Error(result.error);
  if (result.mode === "mercadopago") {
    redirect(result.initPoint);
  }
}

/**
 * Assinatura SIMULADA. Marca a organização como ATIVA no plano escolhido.
 * Usado quando MERCADOPAGO_ACCESS_TOKEN não está configurado.
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

export async function cancelFake(): Promise<void> {
  const ctx = await getAuthContext();
  requireRole(ctx, ["OWNER", "ADMIN"]);

  await prisma.organization.update({
    where: { id: ctx.orgId },
    data: { subscriptionStatus: "CANCELED" },
  });

  revalidatePath("/assinatura");
}
