import { prisma } from "@/lib/db";
import type { ModuleId } from "@/modules/types";

export type PlanId = "starter" | "pro" | "premium" | "enterprise";

export type PlanFeature =
  | "whatsapp_reminders"
  | "public_booking"
  | "advanced_reports"
  | "consolidated_reports"
  | "extra_modules"
  | "custom_integrations";

export interface PlanLimits {
  maxUsers: number | null;
  maxBranches: number | null;
  moduleExtras: ModuleId[];
  features: PlanFeature[];
}

export const PLAN_LIMITS: Record<PlanId, PlanLimits> = {
  starter: {
    maxUsers: 2,
    maxBranches: 1,
    moduleExtras: [],
    features: [],
  },
  pro: {
    maxUsers: 8,
    maxBranches: 1,
    moduleExtras: [],
    features: ["whatsapp_reminders", "public_booking", "advanced_reports"],
  },
  premium: {
    maxUsers: null,
    maxBranches: null,
    moduleExtras: ["inventory", "work_orders"],
    features: [
      "whatsapp_reminders",
      "public_booking",
      "advanced_reports",
      "consolidated_reports",
      "extra_modules",
    ],
  },
  enterprise: {
    maxUsers: null,
    maxBranches: null,
    moduleExtras: ["inventory", "work_orders"],
    features: [
      "whatsapp_reminders",
      "public_booking",
      "advanced_reports",
      "consolidated_reports",
      "extra_modules",
      "custom_integrations",
    ],
  },
};

const DEFAULT_LIMITS = PLAN_LIMITS.starter;

export function getPlanLimits(plan: string): PlanLimits {
  return PLAN_LIMITS[plan as PlanId] ?? DEFAULT_LIMITS;
}

export function canAccessFeature(plan: string, feature: PlanFeature): boolean {
  return getPlanLimits(plan).features.includes(feature);
}

export async function canAddUser(orgId: string): Promise<boolean> {
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { plan: true, _count: { select: { memberships: true } } },
  });
  if (!org) return false;

  const limits = getPlanLimits(org.plan);
  if (limits.maxUsers === null) return true;
  return org._count.memberships < limits.maxUsers;
}
