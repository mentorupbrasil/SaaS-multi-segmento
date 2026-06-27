"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/auth-context";

export interface FormResult {
  error?: string;
  ok?: boolean;
}

const schema = z.object({
  name: z.string().min(1, "Informe o nome"),
  price: z.coerce.number().min(0, "Preco invalido"),
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
    return { error: parsed.error.issues[0]?.message ?? "Dados invalidos" };
  }

  await prisma.service.create({
    data: {
      organizationId: ctx.orgId,
      name: parsed.data.name,
      price: parsed.data.price,
      durationMin: parsed.data.durationMin,
    },
  });

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
