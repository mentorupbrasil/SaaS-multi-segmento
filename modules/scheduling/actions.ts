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
  customerId: z.string().min(1, "Escolha o cliente"),
  serviceId: z.string().optional(),
  staffId: z.string().optional(),
  startAt: z.string().min(1, "Informe a data/hora"),
  notes: z.string().optional(),
});

export async function createAppointment(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  const parsed = schema.safeParse({
    customerId: formData.get("customerId"),
    serviceId: formData.get("serviceId") ?? undefined,
    staffId: formData.get("staffId") ?? undefined,
    startAt: formData.get("startAt"),
    notes: formData.get("notes") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  // Garante que cliente/servico pertencem ao tenant.
  const customer = await prisma.customer.findFirst({
    where: { id: parsed.data.customerId, organizationId: ctx.orgId },
  });
  if (!customer) return { error: "Cliente inválido" };

  let durationMin = 30;
  let serviceId: string | null = null;
  if (parsed.data.serviceId) {
    const service = await prisma.service.findFirst({
      where: { id: parsed.data.serviceId, organizationId: ctx.orgId },
    });
    if (service) {
      serviceId = service.id;
      durationMin = service.durationMin;
    }
  }

  const startAt = new Date(parsed.data.startAt);
  const endAt = new Date(startAt.getTime() + durationMin * 60000);

  await prisma.appointment.create({
    data: {
      organizationId: ctx.orgId,
      customerId: customer.id,
      serviceId,
      staffId: parsed.data.staffId || null,
      startAt,
      endAt,
      notes: parsed.data.notes || null,
    },
  });

  revalidatePath("/agenda");
  return { ok: true };
}

export async function updateAppointmentStatus(
  id: string,
  status: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELED" | "NO_SHOW",
): Promise<void> {
  const ctx = await getAuthContext();
  await prisma.appointment.updateMany({
    where: { id, organizationId: ctx.orgId },
    data: { status },
  });
  revalidatePath("/agenda");
}

const updateSchema = z.object({
  startAt: z.string().min(1, "Informe a data/hora"),
  notes: z.string().optional(),
});

export async function updateAppointment(
  id: string,
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  const parsed = updateSchema.safeParse({
    startAt: formData.get("startAt"),
    notes: formData.get("notes") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const appointment = await prisma.appointment.findFirst({
    where: { id, organizationId: ctx.orgId },
    include: { service: true },
  });
  if (!appointment) return { error: "Agendamento não encontrado" };

  const durationMin = appointment.service?.durationMin ?? 30;
  const startAt = new Date(parsed.data.startAt);
  const endAt = new Date(startAt.getTime() + durationMin * 60000);

  await prisma.appointment.updateMany({
    where: { id, organizationId: ctx.orgId },
    data: {
      startAt,
      endAt,
      notes: parsed.data.notes ?? appointment.notes,
    },
  });

  revalidatePath("/agenda");
  return { ok: true };
}

const blockSchema = z.object({
  staffId: z.string().optional(),
  startAt: z.string().min(1, "Informe o início"),
  endAt: z.string().min(1, "Informe o fim"),
  reason: z.string().optional(),
});

export async function createBlockedSlot(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  const parsed = blockSchema.safeParse({
    staffId: formData.get("staffId") || undefined,
    startAt: formData.get("startAt"),
    endAt: formData.get("endAt"),
    reason: formData.get("reason") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const startAt = new Date(parsed.data.startAt);
  const endAt = new Date(parsed.data.endAt);
  if (endAt <= startAt) {
    return { error: "O fim deve ser após o início" };
  }

  await prisma.blockedSlot.create({
    data: {
      organizationId: ctx.orgId,
      staffId: parsed.data.staffId || null,
      startAt,
      endAt,
      reason: parsed.data.reason || null,
    },
  });

  revalidatePath("/agenda");
  return { ok: true };
}

export async function deleteBlockedSlot(id: string): Promise<void> {
  const ctx = await getAuthContext();
  await prisma.blockedSlot.deleteMany({
    where: { id, organizationId: ctx.orgId },
  });
  revalidatePath("/agenda");
}

export async function deleteAppointment(id: string): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);

  const existing = await prisma.appointment.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!existing) return { error: "Agendamento não encontrado" };

  await prisma.appointment.deleteMany({
    where: { id, organizationId: ctx.orgId },
  });

  await logAudit(ctx, "appointment.delete", { id });
  revalidatePath("/agenda");
  return { ok: true };
}
