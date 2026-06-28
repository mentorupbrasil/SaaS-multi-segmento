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
  petId: z.string().min(1, "Selecione o pet"),
  vaccine: z.string().min(1, "Informe a vacina"),
  appliedAt: z.string().min(1, "Informe a data"),
  nextDueAt: z.string().optional(),
  notes: z.string().optional(),
});

export async function createVaccination(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  const parsed = schema.safeParse({
    petId: formData.get("petId"),
    vaccine: formData.get("vaccine"),
    appliedAt: formData.get("appliedAt"),
    nextDueAt: formData.get("nextDueAt") ?? undefined,
    notes: formData.get("notes") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const pet = await prisma.pet.findFirst({
    where: { id: parsed.data.petId, organizationId: ctx.orgId },
  });
  if (!pet) return { error: "Pet não encontrado" };

  await prisma.vaccination.create({
    data: {
      organizationId: ctx.orgId,
      petId: pet.id,
      vaccine: parsed.data.vaccine,
      appliedAt: new Date(parsed.data.appliedAt),
      nextDueAt: parsed.data.nextDueAt ? new Date(parsed.data.nextDueAt) : null,
      notes: parsed.data.notes || null,
    },
  });

  revalidatePath("/vacinas");
  revalidatePath("/pets");
  return { ok: true };
}

export async function deleteVaccination(id: string): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);

  const existing = await prisma.vaccination.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!existing) return { error: "Vacinação não encontrada" };

  await prisma.vaccination.deleteMany({
    where: { id, organizationId: ctx.orgId },
  });

  await logAudit(ctx, "vaccination.delete", { id });
  revalidatePath("/vacinas");
  revalidatePath(`/vacinas/${id}`);
  revalidatePath("/pets");
  return { ok: true };
}
