import { prisma } from "@/lib/db";
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

/** Stub: processa fila de automações pendentes (cron/worker nas próximas fases). */
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
    await prisma.automationJob.update({
      where: { id: job.id },
      data: { status: "COMPLETED" },
    });
    console.log(`[automations] processed ${job.type} for org ${job.organizationId}`, job.payload);
  }

  return jobs.length;
}
