"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/auth-context";
import { requireCreateRole } from "@/lib/action-auth";
import { markOverdueEntries } from "@/lib/finance-utils";

export interface FormResult {
  error?: string;
  ok?: boolean;
}

const schema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  description: z.string().min(1, "Informe a descrição"),
  amount: z.coerce.number().min(0.01, "Valor inválido"),
  dueDate: z.string().optional(),
  paid: z.string().optional(),
});

export async function createFinancialEntry(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireCreateRole(ctx);
  const parsed = schema.safeParse({
    type: formData.get("type"),
    description: formData.get("description"),
    amount: formData.get("amount"),
    dueDate: formData.get("dueDate") ?? undefined,
    paid: formData.get("paid") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const isPaid = parsed.data.paid === "on";

  await prisma.financialEntry.create({
    data: {
      organizationId: ctx.orgId,
      type: parsed.data.type,
      description: parsed.data.description,
      amount: parsed.data.amount,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      status: isPaid ? "PAID" : "PENDING",
      paidAt: isPaid ? new Date() : null,
    },
  });

  revalidatePath("/financeiro");
  return { ok: true };
}

export async function deleteFinancialEntry(id: string): Promise<FormResult> {
  const ctx = await getAuthContext();
  const existing = await prisma.financialEntry.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!existing) return { error: "Lançamento não encontrado" };

  await prisma.financialEntry.deleteMany({
    where: { id, organizationId: ctx.orgId },
  });

  revalidatePath("/financeiro");
  revalidatePath(`/financeiro/${id}`);
  return { ok: true };
}

export async function markEntryPaid(id: string): Promise<void> {
  const ctx = await getAuthContext();
  await prisma.financialEntry.updateMany({
    where: { id, organizationId: ctx.orgId },
    data: { status: "PAID", paidAt: new Date() },
  });
  revalidatePath("/financeiro");
  revalidatePath(`/financeiro/${id}`);
}

/** Sincroniza vencidos na carga da página financeiro. */
export async function syncOverdueEntries(): Promise<void> {
  const ctx = await getAuthContext();
  await markOverdueEntries(ctx.orgId);
}

const openShiftSchema = z.object({
  openingFloat: z.coerce.number().min(0).default(0),
  notes: z.string().optional(),
});

export async function openCashShift(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  const parsed = openShiftSchema.safeParse({
    openingFloat: formData.get("openingFloat") ?? 0,
    notes: formData.get("notes") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: ctx.userId, organizationId: ctx.orgId },
  });
  if (!membership) return { error: "Membro da equipe não encontrado" };

  const open = await prisma.cashShift.findFirst({
    where: { organizationId: ctx.orgId, closedAt: null },
  });
  if (open) return { error: "Já existe um caixa aberto" };

  await prisma.cashShift.create({
    data: {
      organizationId: ctx.orgId,
      operatorId: membership.id,
      openingFloat: parsed.data.openingFloat,
      notes: parsed.data.notes || null,
    },
  });

  revalidatePath("/caixa");
  return { ok: true };
}

const closeShiftSchema = z.object({
  shiftId: z.string().min(1),
  closingCash: z.coerce.number().min(0),
  notes: z.string().optional(),
});

export async function closeCashShift(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  const parsed = closeShiftSchema.safeParse({
    shiftId: formData.get("shiftId"),
    closingCash: formData.get("closingCash"),
    notes: formData.get("notes") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const shift = await prisma.cashShift.findFirst({
    where: { id: parsed.data.shiftId, organizationId: ctx.orgId, closedAt: null },
  });
  if (!shift) return { error: "Turno não encontrado ou já fechado" };

  await prisma.cashShift.update({
    where: { id: shift.id },
    data: {
      closedAt: new Date(),
      closingCash: parsed.data.closingCash,
      notes: parsed.data.notes || shift.notes,
    },
  });

  revalidatePath("/caixa");
  return { ok: true };
}
