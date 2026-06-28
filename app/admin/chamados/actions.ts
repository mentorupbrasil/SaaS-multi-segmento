"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requirePlatformAdmin } from "@/lib/platform-admin";

export interface TicketActionState {
  error?: string;
  ok?: boolean;
}

const createSchema = z.object({
  subject: z.string().min(3, "Informe o assunto"),
  body: z.string().min(10, "Descreva o chamado com mais detalhes"),
  organizationId: z.string().optional(),
});

export async function createSupportTicketAction(
  _prev: TicketActionState,
  formData: FormData,
): Promise<TicketActionState> {
  await requirePlatformAdmin();

  const parsed = createSchema.safeParse({
    subject: formData.get("subject"),
    body: formData.get("body"),
    organizationId: formData.get("organizationId") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  await prisma.supportTicket.create({
    data: {
      subject: parsed.data.subject,
      body: parsed.data.body,
      organizationId: parsed.data.organizationId || null,
      status: "OPEN",
    },
  });

  revalidatePath("/admin/chamados");
  return { ok: true };
}

const statusSchema = z.object({
  ticketId: z.string().min(1),
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
});

export async function updateTicketStatusAction(
  _prev: TicketActionState,
  formData: FormData,
): Promise<TicketActionState> {
  await requirePlatformAdmin();

  const parsed = statusSchema.safeParse({
    ticketId: formData.get("ticketId"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  await prisma.supportTicket.update({
    where: { id: parsed.data.ticketId },
    data: { status: parsed.data.status },
  });

  revalidatePath("/admin/chamados");
  return { ok: true };
}

export async function listSupportTickets() {
  await requirePlatformAdmin();
  return prisma.supportTicket.findMany({
    include: {
      organization: { select: { id: true, name: true, slug: true } },
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function listOrganizationsForTickets() {
  await requirePlatformAdmin();
  return prisma.organization.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}
