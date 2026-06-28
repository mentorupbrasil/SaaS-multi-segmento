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
  number: z.string().min(1),
  type: z.string().optional(),
  dailyRate: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
});

export async function createRoom(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  const parsed = schema.safeParse({
    number: formData.get("number"),
    type: formData.get("type") ?? undefined,
    dailyRate: formData.get("dailyRate") ?? 0,
    notes: formData.get("notes") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  await prisma.room.create({
    data: {
      organizationId: ctx.orgId,
      number: parsed.data.number,
      type: parsed.data.type || null,
      dailyRate: parsed.data.dailyRate ?? 0,
      notes: parsed.data.notes || null,
    },
  });

  revalidatePath("/quartos");
  return { ok: true };
}

export async function updateRoomStatus(
  id: string,
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | "BLOCKED",
): Promise<void> {
  const ctx = await getAuthContext();
  await prisma.room.updateMany({
    where: { id, organizationId: ctx.orgId },
    data: { status },
  });
  revalidatePath("/quartos");
}

export async function updateRoom(
  id: string,
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);

  const parsed = schema.safeParse({
    number: formData.get("number"),
    type: formData.get("type") ?? undefined,
    dailyRate: formData.get("dailyRate") ?? 0,
    notes: formData.get("notes") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const existing = await prisma.room.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!existing) return { error: "Quarto não encontrado" };

  await prisma.room.updateMany({
    where: { id, organizationId: ctx.orgId },
    data: {
      number: parsed.data.number,
      type: parsed.data.type || null,
      dailyRate: parsed.data.dailyRate ?? 0,
      notes: parsed.data.notes || null,
    },
  });

  await logAudit(ctx, "room.update", { id });
  revalidatePath("/quartos");
  return { ok: true };
}

export async function deleteRoom(id: string): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);

  const existing = await prisma.room.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!existing) return { error: "Quarto não encontrado" };

  await prisma.room.deleteMany({
    where: { id, organizationId: ctx.orgId },
  });

  await logAudit(ctx, "room.delete", { id, number: existing.number });
  revalidatePath("/quartos");
  return { ok: true };
}

