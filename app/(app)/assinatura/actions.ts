"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getAuthContext, requireRole } from "@/lib/auth-context";
import { getPlan } from "@/lib/plans";

/**
 * Assinatura SIMULADA. Marca a organizacao como ATIVA no plano escolhido.
 * TODO (proxima fase): substituir por checkout + webhook do Mercado Pago.
 */
export async function subscribeFake(planId: string): Promise<void> {
  const ctx = await getAuthContext();
  requireRole(ctx, ["OWNER", "ADMIN"]);

  const plan = getPlan(planId);
  if (!plan) throw new Error("Plano invalido");

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
