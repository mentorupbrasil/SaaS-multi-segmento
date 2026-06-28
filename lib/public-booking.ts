"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { queueAutomation } from "@/lib/automations";

export interface PublicBookingOrg {
  id: string;
  name: string;
  slug: string;
  publicBookingSlug: string | null;
  publicBookingEnabled: boolean;
}

export async function getOrganizationByBookingSlug(slug: string): Promise<PublicBookingOrg | null> {
  const org = await prisma.organization.findFirst({
    where: {
      OR: [{ publicBookingSlug: slug }, { slug }],
      publicBookingEnabled: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      publicBookingSlug: true,
      publicBookingEnabled: true,
    },
  });
  return org;
}

export async function getOrganizationByPortalSlug(orgSlug: string) {
  return prisma.organization.findFirst({
    where: { OR: [{ slug: orgSlug }, { publicBookingSlug: orgSlug }] },
    select: {
      id: true,
      name: true,
      slug: true,
      segmentId: true,
      publicBookingSlug: true,
      publicBookingEnabled: true,
    },
  });
}

export async function listPublicServices(organizationId: string) {
  return prisma.service.findMany({
    where: { organizationId, active: true },
    orderBy: { name: "asc" },
  });
}

export async function listCustomerUpcomingAppointments(
  organizationId: string,
  email: string,
) {
  const customer = await prisma.customer.findFirst({
    where: {
      organizationId,
      email: { equals: email.toLowerCase(), mode: "insensitive" },
    },
  });
  if (!customer) return [];

  return prisma.appointment.findMany({
    where: {
      organizationId,
      customerId: customer.id,
      startAt: { gte: new Date() },
      status: { in: ["SCHEDULED", "CONFIRMED"] },
    },
    include: { service: true },
    orderBy: { startAt: "asc" },
    take: 20,
  });
}

const bookingSchema = z.object({
  slug: z.string().min(1),
  customerName: z.string().min(2, "Informe seu nome"),
  customerEmail: z.string().email("E-mail inválido").optional().or(z.literal("")),
  customerPhone: z.string().optional(),
  serviceId: z.string().min(1, "Escolha um serviço"),
  startAt: z.string().min(1, "Informe data e hora"),
  notes: z.string().optional(),
});

export interface PublicBookingResult {
  error?: string;
  ok?: boolean;
  appointmentId?: string;
}

export async function createPublicAppointment(
  _prev: PublicBookingResult,
  formData: FormData,
): Promise<PublicBookingResult> {
  const parsed = bookingSchema.safeParse({
    slug: formData.get("slug"),
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail") || undefined,
    customerPhone: formData.get("customerPhone") || undefined,
    serviceId: formData.get("serviceId"),
    startAt: formData.get("startAt"),
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const org = await getOrganizationByBookingSlug(parsed.data.slug);
  if (!org?.publicBookingEnabled) {
    return { error: "Agendamento online indisponível para este negócio." };
  }

  const service = await prisma.service.findFirst({
    where: { id: parsed.data.serviceId, organizationId: org.id, active: true },
  });
  if (!service) return { error: "Serviço inválido." };

  const email = parsed.data.customerEmail?.toLowerCase().trim();
  let customer = email
    ? await prisma.customer.findFirst({
        where: { organizationId: org.id, email: { equals: email, mode: "insensitive" } },
      })
    : null;

  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        organizationId: org.id,
        name: parsed.data.customerName,
        email: email || null,
        phone: parsed.data.customerPhone || null,
      },
    });
  } else if (parsed.data.customerPhone && !customer.phone) {
    customer = await prisma.customer.update({
      where: { id: customer.id },
      data: { phone: parsed.data.customerPhone },
    });
  }

  const startAt = new Date(parsed.data.startAt);
  const endAt = new Date(startAt.getTime() + service.durationMin * 60000);

  const appointment = await prisma.appointment.create({
    data: {
      organizationId: org.id,
      customerId: customer.id,
      serviceId: service.id,
      startAt,
      endAt,
      notes: parsed.data.notes,
      status: "SCHEDULED",
    },
  });

  await queueAutomation(org.id, "appointment_confirmation", {
    appointmentId: appointment.id,
    customerEmail: customer.email,
    customerPhone: customer.phone,
  });

  revalidatePath(`/agendar/${parsed.data.slug}`);
  return { ok: true, appointmentId: appointment.id };
}

export async function ensurePublicBookingSlug(organizationId: string, name: string) {
  const base = slugify(name) || "agendar";
  let slug = base;
  let i = 0;
  while (
    await prisma.organization.findFirst({
      where: { publicBookingSlug: slug, NOT: { id: organizationId } },
    })
  ) {
    i += 1;
    slug = `${base}-${i}`;
  }
  return slug;
}
