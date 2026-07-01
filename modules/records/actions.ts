"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/auth-context";
import { requireMutationRole, requireCreateRole } from "@/lib/action-auth";
import { logAudit } from "@/lib/audit-log";

const schema = z.object({
  customerId: z.string().min(1, "Selecione o cliente"),
  title: z.string().min(1, "Informe o título"),
  content: z.string().optional(),
  attachmentUrl: z.string().optional(),
});

export interface FormResult {
  error?: string;
  ok?: boolean;
}

export async function createCustomerRecord(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireCreateRole(ctx);
  const parsed = schema.safeParse({
    customerId: formData.get("customerId"),
    title: formData.get("title"),
    content: formData.get("content") ?? undefined,
    attachmentUrl: formData.get("attachmentUrl") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const record = await prisma.customerRecord.create({
    data: {
      organizationId: ctx.orgId,
      customerId: parsed.data.customerId,
      title: parsed.data.title,
      content: parsed.data.content || null,
    },
  });

  if (parsed.data.attachmentUrl) {
    const url = parsed.data.attachmentUrl;
    const fileName = url.split("/").pop() || "anexo";
    await prisma.recordAttachment.create({
      data: {
        recordId: record.id,
        fileName,
        fileUrl: url,
      },
    });
  }

  revalidatePath("/prontuario");
  return { ok: true };
}

export async function deleteCustomerRecord(id: string): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);

  const existing = await prisma.customerRecord.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!existing) return { error: "Registro não encontrado" };

  await prisma.customerRecord.deleteMany({
    where: { id, organizationId: ctx.orgId },
  });

  await logAudit(ctx, "record.delete", { id, title: existing.title });
  revalidatePath("/prontuario");
  return { ok: true };
}
