import { prisma } from "@/lib/db";
import { verifyPortalToken } from "@/lib/portal-token";

export async function findCustomerByEmail(organizationId: string, email: string) {
  return prisma.customer.findFirst({
    where: {
      organizationId,
      email: { equals: email.trim().toLowerCase(), mode: "insensitive" },
    },
  });
}

export async function listCustomerWorkOrders(organizationId: string, customerId: string) {
  return prisma.workOrder.findMany({
    where: { organizationId, customerId },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      title: true,
      status: true,
      total: true,
      createdAt: true,
      dueDate: true,
    },
  });
}

export async function listCustomerQuotes(organizationId: string, customerId: string) {
  return prisma.quote.findMany({
    where: { organizationId, customerId },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      title: true,
      status: true,
      total: true,
      createdAt: true,
      validUntil: true,
    },
  });
}

export async function getPublicWorkOrder(
  organizationId: string,
  id: string,
  token: string,
) {
  if (!verifyPortalToken("work_order", id, organizationId, token)) return null;

  return prisma.workOrder.findFirst({
    where: { id, organizationId },
    include: {
      customer: { select: { name: true } },
      vehicle: { select: { plate: true, model: true } },
      items: { orderBy: { id: "asc" } },
    },
  });
}

export async function getPublicQuote(organizationId: string, id: string, token: string) {
  if (!verifyPortalToken("quote", id, organizationId, token)) return null;

  return prisma.quote.findFirst({
    where: { id, organizationId },
    include: {
      customer: { select: { name: true } },
      vehicle: { select: { plate: true, model: true } },
      items: { orderBy: { id: "asc" } },
    },
  });
}

export async function listParentPortalData(organizationId: string, customerId: string) {
  const [enrollments, financialOpen, attendance] = await Promise.all([
    prisma.enrollment.findMany({
      where: { organizationId, customerId, status: "ACTIVE" },
      include: { class: { select: { name: true, grade: true, shift: true } } },
    }),
    prisma.financialEntry.findMany({
      where: {
        organizationId,
        customerId,
        status: { in: ["PENDING", "OVERDUE"] },
        type: "INCOME",
      },
      orderBy: { dueDate: "asc" },
      take: 10,
    }),
    prisma.attendanceRecord.findMany({
      where: { organizationId, customerId },
      orderBy: { date: "desc" },
      take: 30,
      include: { class: { select: { name: true } } },
    }),
  ]);

  const present = attendance.filter((a) => a.present).length;
  const rate = attendance.length > 0 ? Math.round((present / attendance.length) * 100) : null;

  return { enrollments, financialOpen, attendance, frequencyRate: rate };
}
