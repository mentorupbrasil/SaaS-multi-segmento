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
  customerId: z.string().min(1, "Escolha o cliente"),
  serviceId: z.string().optional(),
  startAt: z.string().min(1, "Informe a data/hora"),
  notes: z.string().optional(),
});

export async function createAppointment(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  const parsed = schema.safeParse({
    customerId: formData.get("customerId"),
    serviceId: formData.get("serviceId") ?? undefined,
    startAt: formData.get("startAt"),
    notes: formData.get("notes") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados invalidos" };
  }

  // Garante que cliente/servico pertencem ao tenant.
  const customer = await prisma.customer.findFirst({
    where: { id: parsed.data.customerId, organizationId: ctx.orgId },
  });
  if (!customer) return { error: "Cliente invalido" };

  let durationMin = 30;
  let serviceId: string | null = null;
  if (parsed.data.serviceId) {
    const service = await prisma.service.findFirst({
      where: { id: parsed.data.serviceId, organizationId: ctx.orgId },
    });
    if (service) {
      serviceId = service.id;
      durationMin = service.durationMin;
    }
  }

  const startAt = new Date(parsed.data.startAt);
  const endAt = new Date(startAt.getTime() + durationMin * 60000);

  await prisma.appointment.create({
    data: {
      organizationId: ctx.orgId,
      customerId: customer.id,
      serviceId,
      startAt,
      endAt,
      notes: parsed.data.notes || null,
    },
  });

  revalidatePath("/agenda");
  return { ok: true };
}

export async function updateAppointmentStatus(
  id: string,
  status: "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELED" | "NO_SHOW",
): Promise<void> {
  const ctx = await getAuthContext();
  await prisma.appointment.updateMany({
    where: { id, organizationId: ctx.orgId },
    data: { status },
  });
  revalidatePath("/agenda");
}
