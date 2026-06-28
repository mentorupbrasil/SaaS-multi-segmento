"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/auth-context";
import { requireMutationRole } from "@/lib/action-auth";
import { logAudit } from "@/lib/audit-log";
import { syncAppointmentCommissions } from "@/lib/commission-auto";

export interface FormResult {
  error?: string;
  ok?: boolean;
}

const schema = z.object({
  staffId: z.string().min(1, "Selecione o profissional"),
  customerId: z.string().optional(),
  description: z.string().min(1, "Informe a descrição"),
  amount: z.coerce.number().min(0.01, "Valor inválido"),
});

export async function createCommissionEntry(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  const parsed = schema.safeParse({
    staffId: formData.get("staffId"),
    customerId: formData.get("customerId") || undefined,
    description: formData.get("description"),
    amount: formData.get("amount"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  await prisma.commissionEntry.create({
    data: {
      organizationId: ctx.orgId,
      staffId: parsed.data.staffId,
      customerId: parsed.data.customerId || null,
      description: parsed.data.description,
      amount: parsed.data.amount,
    },
  });

  revalidatePath("/comissoes");
  return { ok: true };
}

export async function markCommissionPaid(id: string): Promise<void> {
  const ctx = await getAuthContext();
  await prisma.commissionEntry.updateMany({
    where: { id, organizationId: ctx.orgId },
    data: { paidAt: new Date() },
  });
  revalidatePath("/comissoes");
}

export async function deleteCommissionEntry(id: string): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);

  const existing = await prisma.commissionEntry.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!existing) return { error: "Comissão não encontrada" };

  await prisma.commissionEntry.deleteMany({
    where: { id, organizationId: ctx.orgId },
  });

  await logAudit(ctx, "commission.delete", { id });
  revalidatePath("/comissoes");
  return { ok: true };
}

export async function syncCommissionsFromAppointments(): Promise<{ created: number }> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);
  const created = await syncAppointmentCommissions(ctx.orgId);
  revalidatePath("/comissoes");
  return { created };
}
