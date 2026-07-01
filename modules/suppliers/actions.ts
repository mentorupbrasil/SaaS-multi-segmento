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
  name: z.string().min(1, "Informe o nome"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  document: z.string().optional(),
  notes: z.string().optional(),
});

export async function createSupplier(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireCreateRole(ctx);
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email") ?? undefined,
    phone: formData.get("phone") ?? undefined,
    document: formData.get("document") ?? undefined,
    notes: formData.get("notes") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  await prisma.supplier.create({
    data: {
      organizationId: ctx.orgId,
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      document: parsed.data.document || null,
      notes: parsed.data.notes || null,
    },
  });

  revalidatePath("/fornecedores");
  return { ok: true };
}

export async function updateSupplier(
  id: string,
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);

  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email") ?? undefined,
    phone: formData.get("phone") ?? undefined,
    document: formData.get("document") ?? undefined,
    notes: formData.get("notes") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const existing = await prisma.supplier.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!existing) return { error: "Fornecedor não encontrado" };

  await prisma.supplier.updateMany({
    where: { id, organizationId: ctx.orgId },
    data: {
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      document: parsed.data.document || null,
      notes: parsed.data.notes || null,
    },
  });

  await logAudit(ctx, "supplier.update", { id });
  revalidatePath("/fornecedores");
  return { ok: true };
}

export async function deleteSupplier(id: string): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);

  const existing = await prisma.supplier.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!existing) return { error: "Fornecedor não encontrado" };

  await prisma.supplier.deleteMany({
    where: { id, organizationId: ctx.orgId },
  });

  await logAudit(ctx, "supplier.delete", { id, name: existing.name });
  revalidatePath("/fornecedores");
  return { ok: true };
}

