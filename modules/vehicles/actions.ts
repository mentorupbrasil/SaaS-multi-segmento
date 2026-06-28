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
  plate: z.string().min(1),
  model: z.string().min(1),
  brand: z.string().optional(),
  year: z.coerce.number().optional(),
  mileage: z.coerce.number().optional(),
  color: z.string().optional(),
  notes: z.string().optional(),
});

export async function createVehicle(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  const parsed = schema.safeParse({
    customerId: formData.get("customerId"),
    plate: formData.get("plate"),
    model: formData.get("model"),
    brand: formData.get("brand") ?? undefined,
    year: formData.get("year") ?? undefined,
    mileage: formData.get("mileage") ?? undefined,
    color: formData.get("color") ?? undefined,
    notes: formData.get("notes") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  await prisma.vehicle.create({
    data: {
      organizationId: ctx.orgId,
      customerId: parsed.data.customerId,
      plate: parsed.data.plate.toUpperCase(),
      model: parsed.data.model,
      brand: parsed.data.brand || null,
      year: parsed.data.year ?? null,
      mileage: parsed.data.mileage ?? null,
      color: parsed.data.color || null,
      notes: parsed.data.notes || null,
    },
  });

  revalidatePath("/veiculos");
  return { ok: true };
}
