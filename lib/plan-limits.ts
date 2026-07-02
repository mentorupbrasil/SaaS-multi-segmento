import { prisma } from "@/lib/db";
import type { ModuleId } from "@/modules/types";

export type PlanId = "starter" | "pro" | "enterprise";

/** Planos legados mapeados para a nova estrutura (Premium → Profissional). */
const LEGACY_PLAN_ALIASES: Record<string, PlanId> = {
  premium: "pro",
  free: "starter",
};

export type PlanFeature =
  | "whatsapp_reminders"
  | "public_booking"
  | "advanced_reports"
  | "consolidated_reports"
  | "data_export"
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
    maxUsers: 8,
    maxBranches: 1,
    moduleExtras: [],
    features: ["whatsapp_reminders", "public_booking", "advanced_reports", "data_export"],
  },
  pro: {
    maxUsers: null,
    maxBranches: null,
    moduleExtras: ["inventory", "work_orders"],
    features: [
      "whatsapp_reminders",
      "public_booking",
      "advanced_reports",
      "consolidated_reports",
      "data_export",
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
      "data_export",
      "extra_modules",
      "custom_integrations",
    ],
  },
};

const DEFAULT_LIMITS = PLAN_LIMITS.starter;

export function normalizePlanId(plan: string): PlanId {
  if (plan in LEGACY_PLAN_ALIASES) return LEGACY_PLAN_ALIASES[plan];
  if (plan in PLAN_LIMITS) return plan as PlanId;
  return "starter";
}

export function getPlanLimits(plan: string): PlanLimits {
  return PLAN_LIMITS[normalizePlanId(plan)];
}

export function canAccessFeature(plan: string, feature: PlanFeature): boolean {
  return getPlanLimits(plan).features.includes(feature);
}

/** Integrações (/conexoes), relatórios avançados e IA a partir do Inicial. */
export function hasGrowthPlanAccess(plan: string): boolean {
  const id = normalizePlanId(plan);
  return id === "starter" || id === "pro" || id === "enterprise";
}

export function formatUserLimit(plan: string): string {
  const max = getPlanLimits(plan).maxUsers;
  return max === null ? "Ilimitado" : String(max);
}

export function formatBranchLimit(plan: string): string {
  const max = getPlanLimits(plan).maxBranches;
  if (max === null) return "Ilimitado";
  return max === 1 ? "1 unidade" : String(max);
}

export async function getOrgUsage(orgId: string) {
  const [org, userCount, branchCount] = await Promise.all([
    prisma.organization.findUnique({
      where: { id: orgId },
      select: { plan: true },
    }),
    prisma.membership.count({ where: { organizationId: orgId } }),
    prisma.branch.count({ where: { organizationId: orgId } }),
  ]);

  if (!org) {
    return {
      plan: "starter" as PlanId,
      userCount: 0,
      branchCount: 0,
      limits: PLAN_LIMITS.starter,
      usersOverLimit: false,
      branchesOverLimit: false,
    };
  }

  const limits = getPlanLimits(org.plan);
  const usersOverLimit = limits.maxUsers !== null && userCount > limits.maxUsers;
  const branchesOverLimit = limits.maxBranches !== null && branchCount > limits.maxBranches;

  return {
    plan: normalizePlanId(org.plan),
    userCount,
    branchCount,
    limits,
    usersOverLimit,
    branchesOverLimit,
  };
}

export async function canAddUser(orgId: string): Promise<boolean> {
  const usage = await getOrgUsage(orgId);
  if (usage.limits.maxUsers === null) return true;
  return usage.userCount < usage.limits.maxUsers;
}
