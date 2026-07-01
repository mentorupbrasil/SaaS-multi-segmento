"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/auth-context";
import { requireMutationRole, requireCreateRole } from "@/lib/action-auth";
import { logAudit } from "@/lib/audit-log";

export interface FormResult {
  error?: string;
  ok?: boolean;
}

const schema = z.object({
  roomId: z.string().min(1),
  customerId: z.string().min(1),
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
  notes: z.string().optional(),
});

export async function createReservation(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireCreateRole(ctx);
  const parsed = schema.safeParse({
    roomId: formData.get("roomId"),
    customerId: formData.get("customerId"),
    checkIn: formData.get("checkIn"),
    checkOut: formData.get("checkOut"),
    notes: formData.get("notes") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const room = await prisma.room.findFirst({
    where: { id: parsed.data.roomId, organizationId: ctx.orgId },
  });
  if (!room) return { error: "Quarto não encontrado" };

  const checkIn = new Date(parsed.data.checkIn);
  const checkOut = new Date(parsed.data.checkOut);
  const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86400000));
  const total = nights * room.dailyRate;

  await prisma.$transaction([
    prisma.reservation.create({
      data: {
        organizationId: ctx.orgId,
        roomId: room.id,
        customerId: parsed.data.customerId,
        checkIn,
        checkOut,
        total,
        notes: parsed.data.notes || null,
        status: "CONFIRMED",
      },
    }),
    prisma.room.update({
      where: { id: room.id },
      data: { status: "OCCUPIED" },
    }),
  ]);

  revalidatePath("/reservas");
  revalidatePath("/quartos");
  return { ok: true };
}

export async function updateReservationStatus(
  id: string,
  status: "PENDING" | "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELED",
): Promise<void> {
  const ctx = await getAuthContext();
  const reservation = await prisma.reservation.findFirst({
    where: { id, organizationId: ctx.orgId },
    include: { room: true },
  });
  if (!reservation) return;

  await prisma.reservation.updateMany({
    where: { id, organizationId: ctx.orgId },
    data: { status },
  });

  if (status === "CHECKED_OUT" || status === "CANCELED") {
    await prisma.room.updateMany({
      where: { id: reservation.roomId, organizationId: ctx.orgId },
      data: { status: "AVAILABLE" },
    });
  }

  if (status === "CHECKED_OUT" && reservation.total > 0) {
    await prisma.financialEntry.create({
      data: {
        organizationId: ctx.orgId,
        customerId: reservation.customerId,
        type: "INCOME",
        description: `Reserva quarto ${reservation.room.number}`,
        amount: reservation.total,
        status: "PAID",
        paidAt: new Date(),
      },
    });
    revalidatePath("/financeiro");
  }

  revalidatePath("/reservas");
  revalidatePath("/quartos");
}

export async function deleteReservation(id: string): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);

  const reservation = await prisma.reservation.findFirst({
    where: { id, organizationId: ctx.orgId },
    include: { room: true },
  });
  if (!reservation) return { error: "Reserva não encontrada" };

  await prisma.$transaction([
    prisma.reservation.deleteMany({
      where: { id, organizationId: ctx.orgId },
    }),
    ...(reservation.status !== "CHECKED_OUT" && reservation.status !== "CANCELED"
      ? [
          prisma.room.updateMany({
            where: { id: reservation.roomId, organizationId: ctx.orgId },
            data: { status: "AVAILABLE" },
          }),
        ]
      : []),
  ]);

  await logAudit(ctx, "reservation.delete", { id });
  revalidatePath("/reservas");
  revalidatePath("/quartos");
  return { ok: true };
}

