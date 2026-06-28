"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { MasterDataType } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/auth-context";
import { requireMutationRole } from "@/lib/action-auth";
import { logAudit } from "@/lib/audit-log";
import { isMasterDataType } from "@/lib/master-data";

export interface FormResult {
  error?: string;
  ok?: boolean;
}

const createSchema = z.object({
  type: z.string().min(1),
  label: z.string().min(1, "Informe o nome"),
  value: z.string().optional(),
});


export async function createMasterDataItem(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);

  const rawType = String(formData.get("type") ?? "");
  if (!isMasterDataType(rawType)) {
    return { error: "Tipo de cadastro inválido" };
  }

  const parsed = createSchema.safeParse({
    type: rawType,
    label: formData.get("label"),
    value: formData.get("value") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const label = parsed.data.label.trim();
  const value = parsed.data.value?.trim() || null;
  const type = rawType as MasterDataType;

  const duplicate = await prisma.masterData.findFirst({
    where: {
      organizationId: ctx.orgId,
      type,
      label: { equals: label, mode: "insensitive" },
    },
  });
  if (duplicate) {
    return { error: "Já existe um item com este nome" };
  }

  const last = await prisma.masterData.findFirst({
    where: { organizationId: ctx.orgId, type },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  await prisma.masterData.create({
    data: {
      organizationId: ctx.orgId,
      type,
      label,
      value,
      sortOrder: (last?.sortOrder ?? 0) + 1,
    },
  });

  await logAudit(ctx, "master_data.create", { type, label });
  revalidatePath("/configuracoes/cadastros");
  return { ok: true };
}

export async function deleteMasterDataItem(id: string): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);

  const existing = await prisma.masterData.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!existing) return { error: "Item não encontrado" };

  await prisma.masterData.deleteMany({
    where: { id, organizationId: ctx.orgId },
  });

  await logAudit(ctx, "master_data.delete", {
    id,
    type: existing.type,
    label: existing.label,
  });
  revalidatePath("/configuracoes/cadastros");
  return { ok: true };
}
