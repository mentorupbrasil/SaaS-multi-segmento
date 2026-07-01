"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/auth-context";
import { requireMutationRole, requireCreateRole } from "@/lib/action-auth";
import { logAudit } from "@/lib/audit-log";

export interface FormResult {
  error?: string;
  ok?: boolean;
}

const classSchema = z.object({
  name: z.string().min(1, "Informe o nome da turma"),
  grade: z.string().optional(),
  shift: z.string().optional(),
  capacity: z.coerce.number().int().min(1).optional(),
  room: z.string().optional(),
  teacherId: z.string().optional(),
});

const enrollmentSchema = z.object({
  classId: z.string().min(1, "Selecione a turma"),
  customerId: z.string().min(1, "Selecione o aluno"),
  status: z.enum(["ACTIVE", "SUSPENDED", "COMPLETED", "CANCELED"]).optional(),
  notes: z.string().optional(),
});

const attendanceSchema = z.object({
  classId: z.string().min(1, "Selecione a turma"),
  date: z.string().min(1, "Informe a data"),
});

function buildClassSearchWhere(orgId: string, q?: string): Prisma.SchoolClassWhereInput {
  const base: Prisma.SchoolClassWhereInput = { organizationId: orgId };
  const term = q?.trim();
  if (!term) return base;

  return {
    ...base,
    OR: [
      { name: { contains: term, mode: "insensitive" } },
      { grade: { contains: term, mode: "insensitive" } },
      { shift: { contains: term, mode: "insensitive" } },
      { room: { contains: term, mode: "insensitive" } },
    ],
  };
}

export async function listSchoolClasses(q?: string) {
  const ctx = await getAuthContext();
  return prisma.schoolClass.findMany({
    where: buildClassSearchWhere(ctx.orgId, q),
    include: {
      _count: { select: { enrollments: true } },
      teacher: { include: { user: { select: { name: true } } } },
    },
    orderBy: { name: "asc" },
  });
}

export async function listEnrollments(classId?: string) {
  const ctx = await getAuthContext();
  return prisma.enrollment.findMany({
    where: {
      organizationId: ctx.orgId,
      ...(classId ? { classId } : {}),
    },
    include: {
      customer: { select: { id: true, name: true, phone: true, email: true } },
      class: { select: { id: true, name: true, grade: true, shift: true } },
    },
    orderBy: [{ class: { name: "asc" } }, { customer: { name: "asc" } }],
  });
}

export async function listAttendanceRecords(classId: string, date: string) {
  const ctx = await getAuthContext();
  const dayStart = new Date(`${date}T00:00:00`);
  const dayEnd = new Date(`${date}T23:59:59.999`);

  const schoolClass = await prisma.schoolClass.findFirst({
    where: { id: classId, organizationId: ctx.orgId },
  });
  if (!schoolClass) return { class: null, records: [], enrollments: [] };

  const [records, enrollments] = await Promise.all([
    prisma.attendanceRecord.findMany({
      where: {
        organizationId: ctx.orgId,
        classId,
        date: { gte: dayStart, lte: dayEnd },
      },
      include: { customer: { select: { id: true, name: true } } },
    }),
    prisma.enrollment.findMany({
      where: { organizationId: ctx.orgId, classId, status: "ACTIVE" },
      include: { customer: { select: { id: true, name: true } } },
      orderBy: { customer: { name: "asc" } },
    }),
  ]);

  return { class: schoolClass, records, enrollments };
}

export async function createSchoolClass(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireCreateRole(ctx);
  const parsed = classSchema.safeParse({
    name: formData.get("name"),
    grade: formData.get("grade") ?? undefined,
    shift: formData.get("shift") ?? undefined,
    capacity: formData.get("capacity") ?? undefined,
    room: formData.get("room") ?? undefined,
    teacherId: formData.get("teacherId") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const active = formData.get("active") === "on";

  if (parsed.data.teacherId) {
    const teacher = await prisma.membership.findFirst({
      where: { id: parsed.data.teacherId, organizationId: ctx.orgId },
    });
    if (!teacher) return { error: "Professor não encontrado" };
  }

  await prisma.schoolClass.create({
    data: {
      organizationId: ctx.orgId,
      name: parsed.data.name,
      grade: parsed.data.grade || null,
      shift: parsed.data.shift || null,
      capacity: parsed.data.capacity ?? 30,
      room: parsed.data.room || null,
      teacherId: parsed.data.teacherId || null,
      active,
    },
  });

  revalidatePath("/turmas");
  return { ok: true };
}

export async function updateSchoolClass(
  id: string,
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);

  const parsed = classSchema.safeParse({
    name: formData.get("name"),
    grade: formData.get("grade") ?? undefined,
    shift: formData.get("shift") ?? undefined,
    capacity: formData.get("capacity") ?? undefined,
    room: formData.get("room") ?? undefined,
    teacherId: formData.get("teacherId") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const active = formData.get("active") === "on";

  const existing = await prisma.schoolClass.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!existing) return { error: "Turma não encontrada" };

  if (parsed.data.teacherId) {
    const teacher = await prisma.membership.findFirst({
      where: { id: parsed.data.teacherId, organizationId: ctx.orgId },
    });
    if (!teacher) return { error: "Professor não encontrado" };
  }

  await prisma.schoolClass.updateMany({
    where: { id, organizationId: ctx.orgId },
    data: {
      name: parsed.data.name,
      grade: parsed.data.grade || null,
      shift: parsed.data.shift || null,
      capacity: parsed.data.capacity ?? 30,
      room: parsed.data.room || null,
      teacherId: parsed.data.teacherId || null,
      active,
    },
  });

  await logAudit(ctx, "schoolClass.update", { id });
  revalidatePath("/turmas");
  revalidatePath(`/turmas/${id}`);
  return { ok: true };
}

export async function deleteSchoolClass(id: string): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);

  const existing = await prisma.schoolClass.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!existing) return { error: "Turma não encontrada" };

  await prisma.schoolClass.deleteMany({
    where: { id, organizationId: ctx.orgId },
  });

  await logAudit(ctx, "schoolClass.delete", { id, name: existing.name });
  revalidatePath("/turmas");
  return { ok: true };
}

export async function createEnrollment(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireCreateRole(ctx);
  const parsed = enrollmentSchema.safeParse({
    classId: formData.get("classId"),
    customerId: formData.get("customerId"),
    status: formData.get("status") ?? undefined,
    notes: formData.get("notes") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const schoolClass = await prisma.schoolClass.findFirst({
    where: { id: parsed.data.classId, organizationId: ctx.orgId },
    include: { _count: { select: { enrollments: true } } },
  });
  if (!schoolClass) return { error: "Turma não encontrada" };
  if (!schoolClass.active) return { error: "Turma inativa" };
  if (schoolClass._count.enrollments >= schoolClass.capacity) {
    return { error: "Turma atingiu a capacidade máxima" };
  }

  const customer = await prisma.customer.findFirst({
    where: { id: parsed.data.customerId, organizationId: ctx.orgId },
  });
  if (!customer) return { error: "Aluno não encontrado" };

  const duplicate = await prisma.enrollment.findFirst({
    where: {
      organizationId: ctx.orgId,
      classId: parsed.data.classId,
      customerId: parsed.data.customerId,
      status: { in: ["ACTIVE", "SUSPENDED"] },
    },
  });
  if (duplicate) return { error: "Aluno já matriculado nesta turma" };

  await prisma.enrollment.create({
    data: {
      organizationId: ctx.orgId,
      classId: parsed.data.classId,
      customerId: parsed.data.customerId,
      status: parsed.data.status ?? "ACTIVE",
      notes: parsed.data.notes || null,
    },
  });

  revalidatePath("/turmas");
  revalidatePath(`/turmas/${parsed.data.classId}`);
  revalidatePath("/matriculas");
  return { ok: true };
}

export async function deleteEnrollment(id: string): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);

  const existing = await prisma.enrollment.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!existing) return { error: "Matrícula não encontrada" };

  await prisma.enrollment.deleteMany({
    where: { id, organizationId: ctx.orgId },
  });

  await logAudit(ctx, "enrollment.delete", { id, classId: existing.classId });
  revalidatePath("/turmas");
  revalidatePath(`/turmas/${existing.classId}`);
  revalidatePath("/matriculas");
  return { ok: true };
}

export async function updateEnrollmentStatus(
  id: string,
  status: "ACTIVE" | "SUSPENDED" | "COMPLETED" | "CANCELED",
): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);

  const existing = await prisma.enrollment.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!existing) return { error: "Matrícula não encontrada" };

  await prisma.enrollment.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/matriculas");
  revalidatePath(`/matriculas/${id}`);
  revalidatePath(`/turmas/${existing.classId}`);
  return { ok: true };
}

export async function recordAttendance(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  const parsed = attendanceSchema.safeParse({
    classId: formData.get("classId"),
    date: formData.get("date"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const schoolClass = await prisma.schoolClass.findFirst({
    where: { id: parsed.data.classId, organizationId: ctx.orgId },
  });
  if (!schoolClass) return { error: "Turma não encontrada" };

  const enrollments = await prisma.enrollment.findMany({
    where: {
      organizationId: ctx.orgId,
      classId: parsed.data.classId,
      status: "ACTIVE",
    },
    select: { customerId: true },
  });

  const dayStart = new Date(`${parsed.data.date}T00:00:00`);
  const dayEnd = new Date(`${parsed.data.date}T23:59:59.999`);
  const date = new Date(`${parsed.data.date}T12:00:00`);

  for (const enrollment of enrollments) {
    const present = formData.get(`present_${enrollment.customerId}`) === "on";
    const notes = (formData.get(`notes_${enrollment.customerId}`) as string) || null;

    const existing = await prisma.attendanceRecord.findFirst({
      where: {
        organizationId: ctx.orgId,
        classId: parsed.data.classId,
        customerId: enrollment.customerId,
        date: { gte: dayStart, lte: dayEnd },
      },
    });

    if (existing) {
      await prisma.attendanceRecord.update({
        where: { id: existing.id },
        data: { present, notes },
      });
    } else {
      await prisma.attendanceRecord.create({
        data: {
          organizationId: ctx.orgId,
          classId: parsed.data.classId,
          customerId: enrollment.customerId,
          date,
          present,
          notes,
        },
      });
    }
  }

  revalidatePath("/frequencia");
  return { ok: true };
}
