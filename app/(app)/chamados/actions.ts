"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/auth-context";
import { logAudit } from "@/lib/audit-log";

export interface TicketActionState {
  error?: string;
  ok?: boolean;
}

const createSchema = z.object({
  subject: z.string().min(3, "Informe o assunto"),
  body: z.string().min(10, "Descreva o problema com mais detalhes"),
});

export async function createTenantTicketAction(
  _prev: TicketActionState,
  formData: FormData,
): Promise<TicketActionState> {
  const ctx = await getAuthContext();

  const parsed = createSchema.safeParse({
    subject: formData.get("subject"),
    body: formData.get("body"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  await prisma.supportTicket.create({
    data: {
      subject: parsed.data.subject,
      body: parsed.data.body,
      organizationId: ctx.orgId,
      userId: ctx.userId,
      status: "OPEN",
    },
  });

  await logAudit(ctx, "support_ticket.create", { subject: parsed.data.subject });
  revalidatePath("/chamados");
  return { ok: true };
}

export async function listTenantTickets() {
  const ctx = await getAuthContext();
  return prisma.supportTicket.findMany({
    where: { organizationId: ctx.orgId },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
}
