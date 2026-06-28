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
  customerId: z.string().min(1),
  name: z.string().min(1),
  species: z.string().optional(),
  breed: z.string().optional(),
  sex: z.string().optional(),
  weight: z.coerce.number().optional(),
  allergies: z.string().optional(),
  notes: z.string().optional(),
});

export async function createPet(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  const parsed = schema.safeParse({
    customerId: formData.get("customerId"),
    name: formData.get("name"),
    species: formData.get("species") ?? undefined,
    breed: formData.get("breed") ?? undefined,
    sex: formData.get("sex") ?? undefined,
    weight: formData.get("weight") ?? undefined,
    allergies: formData.get("allergies") ?? undefined,
    notes: formData.get("notes") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  await prisma.pet.create({
    data: {
      organizationId: ctx.orgId,
      customerId: parsed.data.customerId,
      name: parsed.data.name,
      species: parsed.data.species || null,
      breed: parsed.data.breed || null,
      sex: parsed.data.sex || null,
      weight: parsed.data.weight ?? null,
      allergies: parsed.data.allergies || null,
      notes: parsed.data.notes || null,
    },
  });

  revalidatePath("/pets");
  return { ok: true };
}
