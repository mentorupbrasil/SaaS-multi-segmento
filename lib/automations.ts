import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { sendWhatsApp } from "@/lib/whatsapp";
import type { AutomationJob, Prisma } from "@prisma/client";

export async function queueAutomation(
  organizationId: string,
  type: string,
  payload: Prisma.InputJsonValue,
  runAt?: Date,
): Promise<AutomationJob> {
  return prisma.automationJob.create({
    data: {
      organizationId,
      type,
      payload,
      runAt: runAt ?? new Date(),
      status: "PENDING",
    },
  });
}

function payloadRecord(payload: Prisma.JsonValue): Record<string, unknown> {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    return payload as Record<string, unknown>;
  }
  return {};
}

function formatWhatsAppMessage(type: string, data: Record<string, unknown>): string {
  const phone = String(data.customerPhone ?? data.phone ?? "");
  const name = String(data.customerName ?? data.name ?? "Cliente");
  const lines = [
    `[whatsapp] org=${data.organizationId ?? "?"} type=${type}`,
    `Para: ${phone || "(sem telefone)"}`,
    `Olá ${name}!`,
  ];

  if (type === "appointment_confirmation") {
    lines.push("Seu agendamento foi confirmado. Aguardamos você!");
  } else {
    lines.push(String(data.message ?? "Mensagem automática do GestorPro."));
  }

  return lines.join("\n");
}

async function processAutomationJob(job: AutomationJob): Promise<void> {
  const data = payloadRecord(job.payload);

  if (job.type === "email" || job.type === "appointment_confirmation") {
    const to = String(data.customerEmail ?? data.to ?? "");
    if (to) {
      const subject =
        String(data.subject ?? "") ||
        (job.type === "appointment_confirmation"
          ? "Agendamento confirmado"
          : "Mensagem do GestorPro");
      const text =
        String(data.text ?? data.message ?? "") ||
        (job.type === "appointment_confirmation"
          ? "Seu agendamento foi confirmado. Aguardamos você!"
          : "Mensagem automática do GestorPro.");

      const result = await sendEmail({ to, subject, text });
      if (!result.ok) {
        throw new Error(result.error ?? "Falha ao enviar e-mail");
      }
    }
  }

  if (job.type === "whatsapp" || job.type === "appointment_confirmation") {
    const phone = String(data.customerPhone ?? data.phone ?? "");
    if (phone) {
      const message = formatWhatsAppMessage(job.type, { ...data, organizationId: job.organizationId });
      const result = await sendWhatsApp({
        organizationId: job.organizationId,
        phone,
        message,
      });
      if (!result.ok) {
        throw new Error(result.error ?? "Falha ao enviar WhatsApp");
      }
    }
  }
}

/** Processa fila de automações pendentes (cron/worker). */
export async function processPendingAutomations(limit = 10): Promise<number> {
  const jobs = await prisma.automationJob.findMany({
    where: {
      status: "PENDING",
      runAt: { lte: new Date() },
    },
    orderBy: { runAt: "asc" },
    take: limit,
  });

  for (const job of jobs) {
    try {
      await processAutomationJob(job);
      await prisma.automationJob.update({
        where: { id: job.id },
        data: { status: "COMPLETED" },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      console.error(`[automations] failed ${job.type} for org ${job.organizationId}:`, message);
      await prisma.automationJob.update({
        where: { id: job.id },
        data: { status: "FAILED" },
      });
    }
  }

  return jobs.length;
}
