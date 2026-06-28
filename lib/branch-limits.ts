import { prisma } from "@/lib/db";
import { getPlanLimits } from "@/lib/plan-limits";

export async function canAddBranch(orgId: string): Promise<boolean> {
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { plan: true, _count: { select: { branches: true } } },
  });
  if (!org) return false;

  const limits = getPlanLimits(org.plan);
  if (limits.maxBranches === null) return true;
  return org._count.branches < limits.maxBranches;
}
