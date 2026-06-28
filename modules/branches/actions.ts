"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/auth-context";
import { requireMutationRole } from "@/lib/action-auth";
import { canAddBranch } from "@/lib/branch-limits";

export interface FormResult {
  error?: string;
  ok?: boolean;
}

const schema = z.object({
  name: z.string().min(1, "Informe o nome da filial"),
  address: z.string().optional(),
});

export async function createBranch(_prev: FormResult, formData: FormData): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);

  if (!(await canAddBranch(ctx.orgId))) {
    return { error: "Seu plano atingiu o limite de filiais. Faça upgrade para adicionar mais." };
  }

  const parsed = schema.safeParse({
    name: formData.get("name"),
    address: formData.get("address") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const count = await prisma.branch.count({ where: { organizationId: ctx.orgId } });

  await prisma.branch.create({
    data: {
      organizationId: ctx.orgId,
      name: parsed.data.name,
      address: parsed.data.address || null,
      isDefault: count === 0,
    },
  });

  revalidatePath("/configuracoes/filiais");
  return { ok: true };
}

export async function deleteBranch(id: string): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);

  const branch = await prisma.branch.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!branch) return { error: "Filial não encontrada" };
  if (branch.isDefault) {
    return { error: "Não é possível excluir a filial padrão." };
  }

  await prisma.branch.deleteMany({ where: { id, organizationId: ctx.orgId } });
  revalidatePath("/configuracoes/filiais");
  return { ok: true };
}
