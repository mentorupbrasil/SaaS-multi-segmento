import { canAccessFeature, normalizePlanId } from "@/lib/plan-limits";
import type { ModuleId } from "@/modules/types";

/** Operação essencial — legado (referência em testes). */
export const STARTER_BASE_MODULES: ModuleId[] = [
  "clients",
  "scheduling",
  "services",
  "financial",
  "team",
];

/** Módulos avançados — plano Profissional+. */
export const PREMIUM_GATED_MODULES: ModuleId[] = ["inventory", "work_orders"];

const MIN_PLAN_LABEL: Record<string, string> = {
  whatsapp_reminders: "Inicial",
  public_booking: "Inicial",
  advanced_reports: "Inicial",
  data_export: "Inicial",
  extra_modules: "Profissional",
  consolidated_reports: "Profissional",
  custom_integrations: "Enterprise",
};

/** Remove módulos bloqueados pelo plano da organização. */
export function filterModulesByPlan(modules: ModuleId[], plan: string): ModuleId[] {
  const planId = normalizePlanId(plan);
  const premiumGated = new Set<ModuleId>(PREMIUM_GATED_MODULES);

  if (canAccessFeature(planId, "extra_modules")) {
    return modules;
  }

  // Inicial: todos os módulos do segmento, exceto estoque/OS
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
  return MIN_PLAN_LABEL[feature] ?? "Inicial";
}

/** Mensagem curta para upgrade quando um recurso está bloqueado. */
export function planUpgradeMessage(feature: keyof typeof MIN_PLAN_LABEL): string {
  return `Disponível a partir do plano ${getMinimumPlanLabelForFeature(feature)}.`;
}

/** Lista módulos do segmento que o plano não inclui (para UI de assinatura). */
export function getLockedModulesForPlan(segmentModules: ModuleId[], plan: string): ModuleId[] {
  const allowed = new Set(filterModulesByPlan(segmentModules, plan));
  return segmentModules.filter((m) => !allowed.has(m));
}

/** Bloqueia recurso premium quando o plano não inclui o módulo. */
export function assertPremiumModule(moduleId: ModuleId, plan: string): boolean {
  return isModuleAllowedByPlan(moduleId, plan);
}
