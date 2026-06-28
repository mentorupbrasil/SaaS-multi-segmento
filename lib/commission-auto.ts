import { prisma } from "@/lib/db";
import { getMasterDataOptions } from "@/lib/master-data";

const COMMISSION_TAG = (appointmentId: string) => `[apt:${appointmentId}]`;

async function defaultCommissionRate(orgId: string): Promise<number> {
  const rates = await getMasterDataOptions(orgId, "COMMISSION_RATE");
  for (const option of rates) {
    const parsed = parseFloat(option.value.replace("%", "").replace(",", "."));
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return 10;
}

/** Cria comissão automática quando um agendamento é concluído (idempotente). */
export async function maybeCreateAppointmentCommission(
  organizationId: string,
  appointmentId: string,
): Promise<void> {
  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, organizationId },
    include: { service: true, customer: true },
  });

  if (!appointment?.staffId || !appointment.service || appointment.service.price <= 0) {
    return;
  }

  const tag = COMMISSION_TAG(appointmentId);
  const existing = await prisma.commissionEntry.findFirst({
    where: {
      organizationId,
      staffId: appointment.staffId,
      description: { contains: tag },
    },
  });
  if (existing) return;

  const rate = await defaultCommissionRate(organizationId);
  const amount = Math.round(appointment.service.price * (rate / 100) * 100) / 100;
  if (amount <= 0) return;

  await prisma.commissionEntry.create({
    data: {
      organizationId,
      staffId: appointment.staffId,
      customerId: appointment.customerId,
      description: `Agendamento: ${appointment.service.name} ${tag}`,
      amount,
    },
  });
}

/** Varre agendamentos concluídos sem comissão e gera entradas pendentes. */
export async function syncAppointmentCommissions(organizationId: string): Promise<number> {
  const completed = await prisma.appointment.findMany({
    where: {
      organizationId,
      status: "COMPLETED",
      staffId: { not: null },
      serviceId: { not: null },
    },
    select: { id: true },
    take: 200,
    orderBy: { startAt: "desc" },
  });

  let created = 0;
  for (const apt of completed) {
    const before = await prisma.commissionEntry.count({
      where: {
        organizationId,
        description: { contains: COMMISSION_TAG(apt.id) },
      },
    });
    await maybeCreateAppointmentCommission(organizationId, apt.id);
    const after = await prisma.commissionEntry.count({
      where: {
        organizationId,
        description: { contains: COMMISSION_TAG(apt.id) },
      },
    });
    if (after > before) created += 1;
  }

  return created;
}
