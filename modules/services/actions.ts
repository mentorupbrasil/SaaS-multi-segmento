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
  name: z.string().min(1, "Informe o nome"),
  price: z.coerce.number().min(0, "Preço inválido"),
  durationMin: z.coerce.number().int().min(0).default(30),
});

export async function createService(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  const parsed = schema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    durationMin: formData.get("durationMin"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const staffIds = formData.getAll("staffIds").filter((v): v is string => typeof v === "string" && v.length > 0);

  await prisma.service.create({
    data: {
      organizationId: ctx.orgId,
      name: parsed.data.name,
      price: parsed.data.price,
      durationMin: parsed.data.durationMin,
      staffLinks: staffIds.length
        ? { create: staffIds.map((membershipId) => ({ membershipId })) }
        : undefined,
    },
  });

  revalidatePath("/servicos");
  return { ok: true };
}

export async function updateServiceStaff(serviceId: string, staffIds: string[]): Promise<FormResult> {
  const ctx = await getAuthContext();
  const service = await prisma.service.findFirst({
    where: { id: serviceId, organizationId: ctx.orgId },
  });
  if (!service) return { error: "Serviço não encontrado" };

  await prisma.$transaction([
    prisma.serviceStaff.deleteMany({ where: { serviceId } }),
    ...(staffIds.length
      ? [
          prisma.serviceStaff.createMany({
            data: staffIds.map((membershipId) => ({ serviceId, membershipId })),
          }),
        ]
      : []),
  ]);

  revalidatePath("/servicos");
  return { ok: true };
}

export async function toggleService(id: string, active: boolean): Promise<void> {
  const ctx = await getAuthContext();
  await prisma.service.updateMany({
    where: { id, organizationId: ctx.orgId },
    data: { active },
  });
  revalidatePath("/servicos");
}

export async function updateService(
  id: string,
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);

  const parsed = schema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    durationMin: formData.get("durationMin"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const existing = await prisma.service.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!existing) return { error: "Serviço não encontrado" };

  await prisma.service.updateMany({
    where: { id, organizationId: ctx.orgId },
    data: {
      name: parsed.data.name,
      price: parsed.data.price,
      durationMin: parsed.data.durationMin,
    },
  });

  await logAudit(ctx, "service.update", { id });
  revalidatePath("/servicos");
  return { ok: true };
}

export async function deleteService(id: string): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);

  const existing = await prisma.service.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!existing) return { error: "Serviço não encontrado" };

  await prisma.service.deleteMany({
    where: { id, organizationId: ctx.orgId },
  });

  await logAudit(ctx, "service.delete", { id, name: existing.name });
  revalidatePath("/servicos");
  return { ok: true };
}
