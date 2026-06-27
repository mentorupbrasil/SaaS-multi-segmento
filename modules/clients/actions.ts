"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/auth-context";
import { getSegment } from "@/segments";

const schema = z.object({
  name: z.string().min(1, "Informe o nome"),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  notes: z.string().optional(),
});

export interface FormResult {
  error?: string;
  ok?: boolean;
}

export async function createCustomer(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();

  const parsed = schema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone") ?? undefined,
    email: formData.get("email") ?? undefined,
    notes: formData.get("notes") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  // Campos customizados do segmento (prefixo cf_)
  const segment = getSegment(ctx.organization.segmentId);
  const customFields: Record<string, string> = {};
  for (const field of segment?.customerFields ?? []) {
    const value = formData.get(`cf_${field.key}`);
    if (typeof value === "string" && value.trim()) {
      customFields[field.key] = value.trim();
    }
  }

  await prisma.customer.create({
    data: {
      organizationId: ctx.orgId,
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      notes: parsed.data.notes || null,
      customFields,
    },
  });

  revalidatePath("/clientes");
  return { ok: true };
}
