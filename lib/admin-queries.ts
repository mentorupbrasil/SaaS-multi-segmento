import { prisma } from "@/lib/db";

export async function getPlatformStats() {
  const [
    orgCount,
    userCount,
    customerCount,
    activeSubscriptions,
    pastDueSubscriptions,
    monthIncome,
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
  ]);

  return {
    orgCount,
    userCount,
    customerCount,
    activeSubscriptions,
    pastDueSubscriptions,
    monthIncome: monthIncome._sum.amount ?? 0,
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

function startOfMonth() {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}
