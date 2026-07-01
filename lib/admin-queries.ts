import { prisma } from "@/lib/db";
import { PLANS } from "@/lib/plans";

function startOfMonth() {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** MRR estimado com base em assinaturas ACTIVE × preço do plano (não inclui receita operacional dos tenants). */
function estimatePlatformMrr(activeByPlan: Record<string, number>): number {
  return PLANS.reduce((sum, plan) => {
    if (plan.priceMonthly == null) return sum;
    return sum + (activeByPlan[plan.id] ?? 0) * plan.priceMonthly;
  }, 0);
}

export async function getPlatformStats() {
  const [
    orgCount,
    userCount,
    customerCount,
    activeSubscriptions,
    pastDueSubscriptions,
    tenantOperationalIncome,
    activeOrgsByPlan,
  ] = await Promise.all([
    prisma.organization.count(),
    prisma.user.count(),
    prisma.customer.count(),
    prisma.organization.count({ where: { subscriptionStatus: "ACTIVE" } }),
    prisma.organization.count({ where: { subscriptionStatus: "PAST_DUE" } }),
    prisma.financialEntry.aggregate({
      where: {
        type: "INCOME",
        status: "PAID",
        paidAt: { gte: startOfMonth() },
      },
      _sum: { amount: true },
    }),
    prisma.organization.groupBy({
      by: ["plan"],
      where: { subscriptionStatus: "ACTIVE" },
      _count: { _all: true },
    }),
  ]);

  const activeByPlan = activeOrgsByPlan.reduce<Record<string, number>>((acc, row) => {
    acc[row.plan] = row._count._all;
    return acc;
  }, {});

  return {
    orgCount,
    userCount,
    customerCount,
    activeSubscriptions,
    pastDueSubscriptions,
    /** Receita operacional registrada pelos tenants (não é receita da plataforma). */
    tenantOperationalIncome: tenantOperationalIncome._sum.amount ?? 0,
    /** MRR estimado das assinaturas GestorPro. */
    estimatedPlatformMrr: estimatePlatformMrr(activeByPlan),
    activeByPlan,
  };
}

export async function listOrganizations() {
  return prisma.organization.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { memberships: true, customers: true, appointments: true } },
    },
  });
}

export async function getOrganizationAdminDetail(id: string) {
  return prisma.organization.findUnique({
    where: { id },
    include: {
      memberships: {
        include: { user: { select: { id: true, name: true, email: true, createdAt: true } } },
      },
      _count: {
        select: {
          customers: true,
          services: true,
          appointments: true,
          financialEntries: true,
        },
      },
    },
  });
}

export async function listUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      memberships: {
        include: { organization: { select: { id: true, name: true, segmentId: true, plan: true } } },
      },
    },
  });
}

export async function getBillingOverview() {
  const orgs = await prisma.organization.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      segmentId: true,
      plan: true,
      subscriptionStatus: true,
      createdAt: true,
    },
  });

  const byPlan = orgs.reduce<Record<string, number>>((acc, o) => {
    acc[o.plan] = (acc[o.plan] ?? 0) + 1;
    return acc;
  }, {});

  const byStatus = orgs.reduce<Record<string, number>>((acc, o) => {
    acc[o.subscriptionStatus] = (acc[o.subscriptionStatus] ?? 0) + 1;
    return acc;
  }, {});

  return { orgs, byPlan, byStatus };
}

export async function listAuditLogs(limit = 100) {
  return prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: { select: { id: true, name: true, email: true } },
      organization: { select: { id: true, name: true } },
    },
  });
}

/** @deprecated Use tenantOperationalIncome — mantido para compatibilidade temporária. */
export type PlatformStats = Awaited<ReturnType<typeof getPlatformStats>>;
