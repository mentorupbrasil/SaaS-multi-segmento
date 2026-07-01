"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/auth-context";
import { requireCreateRole } from "@/lib/action-auth";

export interface FormResult {
  error?: string;
  ok?: boolean;
}

const createSchema = z.object({
  roomId: z.string().min(1, "Selecione o quarto"),
  taskType: z.enum(["CLEANING", "DEEP_CLEAN", "TURNDOWN", "INSPECTION", "OTHER"]),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).optional(),
  assignedStaffId: z.string().optional(),
  notes: z.string().optional(),
  dueAt: z.string().optional(),
});

export async function createHousekeepingTask(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireCreateRole(ctx);
  const parsed = createSchema.safeParse({
    roomId: formData.get("roomId"),
    taskType: formData.get("taskType"),
    priority: formData.get("priority") || "NORMAL",
    assignedStaffId: formData.get("assignedStaffId") || undefined,
    notes: formData.get("notes") || undefined,
    dueAt: formData.get("dueAt") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const room = await prisma.room.findFirst({
    where: { id: parsed.data.roomId, organizationId: ctx.orgId },
  });
  if (!room) return { error: "Quarto não encontrado" };

  await prisma.housekeepingTask.create({
    data: {
      organizationId: ctx.orgId,
      roomId: parsed.data.roomId,
      taskType: parsed.data.taskType,
      priority: parsed.data.priority ?? "NORMAL",
      assignedStaffId: parsed.data.assignedStaffId || null,
      notes: parsed.data.notes || null,
      dueAt: parsed.data.dueAt ? new Date(parsed.data.dueAt) : null,
    },
  });

  revalidatePath("/governanca");
  return { ok: true };
}

export async function updateTaskStatus(
  id: string,
  status: "PENDING" | "IN_PROGRESS" | "DONE" | "CANCELED",
): Promise<FormResult> {
  const ctx = await getAuthContext();

  const task = await prisma.housekeepingTask.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!task) return { error: "Tarefa não encontrada" };

  await prisma.housekeepingTask.updateMany({
    where: { id, organizationId: ctx.orgId },
    data: {
      status,
      completedAt: status === "DONE" ? new Date() : null,
    },
  });

  if (status === "DONE") {
    await prisma.room.updateMany({
      where: { id: task.roomId, organizationId: ctx.orgId, status: "MAINTENANCE" },
      data: { status: "AVAILABLE" },
    });
  }

  revalidatePath("/governanca");
  revalidatePath("/quartos");
  return { ok: true };
}

export async function listHousekeepingTasks(filters?: {
  status?: "PENDING" | "IN_PROGRESS" | "DONE" | "CANCELED";
  roomId?: string;
}) {
  const ctx = await getAuthContext();

  return prisma.housekeepingTask.findMany({
    where: {
      organizationId: ctx.orgId,
      ...(filters?.status ? { status: filters.status } : {}),
      ...(filters?.roomId ? { roomId: filters.roomId } : {}),
    },
    include: {
      room: { select: { id: true, number: true, type: true, status: true } },
      assignedStaff: { include: { user: { select: { name: true } } } },
    },
    orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
  });
}
