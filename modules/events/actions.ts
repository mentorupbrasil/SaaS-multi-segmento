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
  name: z.string().min(1),
  customerId: z.string().optional(),
  eventType: z.string().optional(),
  eventDate: z.string().optional(),
  location: z.string().optional(),
  total: z.coerce.number().optional(),
  notes: z.string().optional(),
});

export async function createBusinessEvent(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireCreateRole(ctx);
  const parsed = schema.safeParse({
    name: formData.get("name"),
    customerId: formData.get("customerId") || undefined,
    eventType: formData.get("eventType") ?? undefined,
    eventDate: formData.get("eventDate") ?? undefined,
    location: formData.get("location") ?? undefined,
    total: formData.get("total") ?? 0,
    notes: formData.get("notes") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  await prisma.businessEvent.create({
    data: {
      organizationId: ctx.orgId,
      name: parsed.data.name,
      customerId: parsed.data.customerId || null,
      eventType: parsed.data.eventType || null,
      eventDate: parsed.data.eventDate ? new Date(parsed.data.eventDate) : null,
      location: parsed.data.location || null,
      total: parsed.data.total ?? 0,
      notes: parsed.data.notes || null,
    },
  });

  revalidatePath("/eventos");
  return { ok: true };
}

export async function updateEventStatus(
  id: string,
  status: "PLANNING" | "CONFIRMED" | "IN_PROGRESS" | "DONE" | "CANCELED",
): Promise<void> {
  const ctx = await getAuthContext();
  await prisma.businessEvent.updateMany({
    where: { id, organizationId: ctx.orgId },
    data: { status },
  });
  revalidatePath("/eventos");
  revalidatePath(`/eventos/${id}`);
}

export async function updateBusinessEvent(
  id: string,
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);

  const parsed = schema.safeParse({
    name: formData.get("name"),
    customerId: formData.get("customerId") || undefined,
    eventType: formData.get("eventType") ?? undefined,
    eventDate: formData.get("eventDate") ?? undefined,
    location: formData.get("location") ?? undefined,
    total: formData.get("total") ?? 0,
    notes: formData.get("notes") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const existing = await prisma.businessEvent.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!existing) return { error: "Evento não encontrado" };

  await prisma.businessEvent.updateMany({
    where: { id, organizationId: ctx.orgId },
    data: {
      name: parsed.data.name,
      customerId: parsed.data.customerId || null,
      eventType: parsed.data.eventType || null,
      eventDate: parsed.data.eventDate ? new Date(parsed.data.eventDate) : null,
      location: parsed.data.location || null,
      total: parsed.data.total ?? 0,
      notes: parsed.data.notes || null,
    },
  });

  await logAudit(ctx, "event.update", { id });
  revalidatePath("/eventos");
  revalidatePath(`/eventos/${id}`);
  return { ok: true };
}

const taskSchema = z.object({
  title: z.string().min(1),
  dueAt: z.string().optional(),
});

export async function createEventTask(
  eventId: string,
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireCreateRole(ctx);
  const parsed = taskSchema.safeParse({
    title: formData.get("title"),
    dueAt: formData.get("dueAt") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const event = await prisma.businessEvent.findFirst({
    where: { id: eventId, organizationId: ctx.orgId },
  });
  if (!event) return { error: "Evento não encontrado" };

  const count = await prisma.eventTask.count({ where: { businessEventId: eventId } });

  await prisma.eventTask.create({
    data: {
      businessEventId: eventId,
      title: parsed.data.title,
      dueAt: parsed.data.dueAt ? new Date(parsed.data.dueAt) : null,
      sortOrder: count,
    },
  });

  revalidatePath(`/eventos/${eventId}`);
  return { ok: true };
}

export async function toggleEventTaskDone(taskId: string, done: boolean): Promise<void> {
  const ctx = await getAuthContext();
  const task = await prisma.eventTask.findFirst({
    where: { id: taskId },
    include: { businessEvent: { select: { id: true, organizationId: true } } },
  });
  if (!task || task.businessEvent.organizationId !== ctx.orgId) return;

  await prisma.eventTask.update({
    where: { id: taskId },
    data: { done },
  });
  revalidatePath(`/eventos/${task.businessEvent.id}`);
}

export async function deleteBusinessEvent(id: string): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);

  const existing = await prisma.businessEvent.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!existing) return { error: "Evento não encontrado" };

  await prisma.businessEvent.deleteMany({
    where: { id, organizationId: ctx.orgId },
  });

  await logAudit(ctx, "event.delete", { id, name: existing.name });
  revalidatePath("/eventos");
  return { ok: true };
}

