import { canAccessFeature, normalizePlanId } from "@/lib/plan-limits";
import type { ModuleId } from "@/modules/types";

/** Operação essencial — plano Inicial. */
export const STARTER_BASE_MODULES: ModuleId[] = [
  "clients",
  "scheduling",
  "services",
  "financial",
  "team",
];

/** Módulos avançados — plano Premium+. */
export const PREMIUM_GATED_MODULES: ModuleId[] = ["inventory", "work_orders"];

const MIN_PLAN_LABEL: Record<string, string> = {
  whatsapp_reminders: "Profissional",
  public_booking: "Profissional",
  advanced_reports: "Profissional",
  data_export: "Profissional",
  extra_modules: "Premium",
  consolidated_reports: "Premium",
  custom_integrations: "Enterprise",
};

/** Remove módulos bloqueados pelo plano da organização. */
export function filterModulesByPlan(modules: ModuleId[], plan: string): ModuleId[] {
  const planId = normalizePlanId(plan);
  const premiumGated = new Set<ModuleId>(PREMIUM_GATED_MODULES);

  if (canAccessFeature(planId, "extra_modules")) {
    return modules;
  }

  if (planId === "starter") {
    const base = new Set(STARTER_BASE_MODULES);
    return modules.filter((m) => base.has(m) && !premiumGated.has(m));
  }

  // Profissional: todos os módulos do segmento, exceto estoque/OS
  return modules.filter((m) => !premiumGated.has(m));
}

export function canUsePublicBooking(plan: string): boolean {
  return canAccessFeature(plan, "public_booking");
}

export function canExportData(plan: string): boolean {
  return canAccessFeature(plan, "data_export");
}

export function isModuleAllowedByPlan(moduleId: ModuleId, plan: string): boolean {
  return filterModulesByPlan([moduleId], plan).includes(moduleId);
}

export function getMinimumPlanLabelForFeature(feature: keyof typeof MIN_PLAN_LABEL): string {
  return MIN_PLAN_LABEL[feature] ?? "Profissional";
}

/** Mensagem curta para upgrade quando um recurso está bloqueado. */
export function planUpgradeMessage(feature: keyof typeof MIN_PLAN_LABEL): string {
  return `Disponível a partir do plano ${getMinimumPlanLabelForFeature(feature)}.`;
}

/** Lista módulos do segmento que o plano não inclui (para UI de assinatura). */
export function getLockedModulesForPlan(
  segmentModules: ModuleId[],
  plan: string,
): ModuleId[] {
  const allowed = new Set(filterModulesByPlan(segmentModules, plan));
  return segmentModules.filter((m) => !allowed.has(m));
}

/** Bloqueia recurso premium quando o plano não inclui o módulo. */
export function assertPremiumModule(moduleId: ModuleId, plan: string): boolean {
  return isModuleAllowedByPlan(moduleId, plan);
}
