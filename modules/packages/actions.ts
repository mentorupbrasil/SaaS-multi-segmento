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
  customerId: z.string().min(1, "Selecione o cliente"),
  name: z.string().min(1, "Informe o nome"),
  totalSessions: z.coerce.number().int().min(1),
  price: z.coerce.number().min(0).optional(),
  expiresAt: z.string().optional(),
});

export async function createSessionPackage(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  const parsed = schema.safeParse({
    customerId: formData.get("customerId"),
    name: formData.get("name"),
    totalSessions: formData.get("totalSessions"),
    price: formData.get("price") ?? 0,
    expiresAt: formData.get("expiresAt") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const customer = await prisma.customer.findFirst({
    where: { id: parsed.data.customerId, organizationId: ctx.orgId },
  });
  if (!customer) return { error: "Cliente não encontrado" };

  await prisma.sessionPackage.create({
    data: {
      organizationId: ctx.orgId,
      customerId: customer.id,
      name: parsed.data.name,
      totalSessions: parsed.data.totalSessions,
      price: parsed.data.price ?? 0,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
    },
  });

  revalidatePath("/pacotes");
  return { ok: true };
}

export async function useSessionPackage(id: string): Promise<FormResult> {
  const ctx = await getAuthContext();
  const pkg = await prisma.sessionPackage.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!pkg) return { error: "Pacote não encontrado" };
  if (pkg.usedSessions >= pkg.totalSessions) return { error: "Pacote esgotado" };

  await prisma.sessionPackage.update({
    where: { id },
    data: { usedSessions: pkg.usedSessions + 1 },
  });

  revalidatePath("/pacotes");
  return { ok: true };
}

export async function deleteSessionPackage(id: string): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);

  const existing = await prisma.sessionPackage.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!existing) return { error: "Pacote não encontrado" };

  await prisma.sessionPackage.deleteMany({
    where: { id, organizationId: ctx.orgId },
  });

  await logAudit(ctx, "session_package.delete", { id, name: existing.name });
  revalidatePath("/pacotes");
  return { ok: true };
}
