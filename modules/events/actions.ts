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
  name: z.string().min(1),
  customerId: z.string().optional(),
  eventType: z.string().optional(),
  eventDate: z.string().optional(),
  location: z.string().optional(),
  total: z.coerce.number().optional(),
  notes: z.string().optional(),
});

export async function createBusinessEvent(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  const parsed = schema.safeParse({
    name: formData.get("name"),
    customerId: formData.get("customerId") || undefined,
    eventType: formData.get("eventType") ?? undefined,
    eventDate: formData.get("eventDate") ?? undefined,
    location: formData.get("location") ?? undefined,
    total: formData.get("total") ?? 0,
    notes: formData.get("notes") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  await prisma.businessEvent.create({
    data: {
      organizationId: ctx.orgId,
      name: parsed.data.name,
      customerId: parsed.data.customerId || null,
      eventType: parsed.data.eventType || null,
      eventDate: parsed.data.eventDate ? new Date(parsed.data.eventDate) : null,
      location: parsed.data.location || null,
      total: parsed.data.total ?? 0,
      notes: parsed.data.notes || null,
    },
  });

  revalidatePath("/eventos");
  return { ok: true };
}

export async function updateEventStatus(
  id: string,
  status: "PLANNING" | "CONFIRMED" | "IN_PROGRESS" | "DONE" | "CANCELED",
): Promise<void> {
  const ctx = await getAuthContext();
  await prisma.businessEvent.updateMany({
    where: { id, organizationId: ctx.orgId },
    data: { status },
  });
  revalidatePath("/eventos");
}
