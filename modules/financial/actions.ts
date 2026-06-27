"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/auth-context";

export interface FormResult {
  error?: string;
  ok?: boolean;
}

const schema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  description: z.string().min(1, "Informe a descricao"),
  amount: z.coerce.number().min(0.01, "Valor invalido"),
  dueDate: z.string().optional(),
  paid: z.string().optional(),
});

export async function createFinancialEntry(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  const parsed = schema.safeParse({
    type: formData.get("type"),
    description: formData.get("description"),
    amount: formData.get("amount"),
    dueDate: formData.get("dueDate") ?? undefined,
    paid: formData.get("paid") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados invalidos" };
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

export async function markEntryPaid(id: string): Promise<void> {
  const ctx = await getAuthContext();
  await prisma.financialEntry.updateMany({
    where: { id, organizationId: ctx.orgId },
    data: { status: "PAID", paidAt: new Date() },
  });
  revalidatePath("/financeiro");
}
