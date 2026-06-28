"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/auth-context";
import { requireMutationRole } from "@/lib/action-auth";
import { logAudit } from "@/lib/audit-log";

export interface FormResult {
  error?: string;
  ok?: boolean;
}

const schema = z.object({
  customerId: z.string().optional(),
  amount: z.coerce.number().min(0.01),
  donationType: z.string().optional(),
  description: z.string().optional(),
  receivedAt: z.string().optional(),
});

export async function createDonation(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  const parsed = schema.safeParse({
    customerId: formData.get("customerId") || undefined,
    amount: formData.get("amount"),
    donationType: formData.get("donationType") ?? undefined,
    description: formData.get("description") ?? undefined,
    receivedAt: formData.get("receivedAt") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  await prisma.$transaction([
    prisma.donation.create({
      data: {
        organizationId: ctx.orgId,
        customerId: parsed.data.customerId || null,
        amount: parsed.data.amount,
        donationType: parsed.data.donationType || null,
        description: parsed.data.description || null,
        receivedAt: parsed.data.receivedAt ? new Date(parsed.data.receivedAt) : new Date(),
      },
    }),
    prisma.financialEntry.create({
      data: {
        organizationId: ctx.orgId,
        customerId: parsed.data.customerId || null,
        type: "INCOME",
        description: parsed.data.description || "Doação recebida",
        amount: parsed.data.amount,
        status: "PAID",
        paidAt: new Date(),
      },
    }),
  ]);

  revalidatePath("/doacoes");
  revalidatePath("/financeiro");
  return { ok: true };
}

export async function deleteDonation(id: string): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);

  const existing = await prisma.donation.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!existing) return { error: "Doação não encontrada" };

  await prisma.donation.deleteMany({
    where: { id, organizationId: ctx.orgId },
  });

  await logAudit(ctx, "donation.delete", { id });
  revalidatePath("/doacoes");
  return { ok: true };
}

