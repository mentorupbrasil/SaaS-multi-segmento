import { canAccessFeature, getPlanLimits } from "@/lib/plan-limits";
import type { ModuleId } from "@/modules/types";

/** Módulos liberados apenas em planos com `extra_modules` (Premium+). */
export const PREMIUM_GATED_MODULES: ModuleId[] = ["inventory", "work_orders"];

/** Remove módulos bloqueados pelo plano da organização. */
export function filterModulesByPlan(modules: ModuleId[], plan: string): ModuleId[] {
  if (canAccessFeature(plan, "extra_modules")) {
    return modules;
  }
  const gated = new Set(getPlanLimits(plan).moduleExtras);
  for (const mod of PREMIUM_GATED_MODULES) {
    gated.add(mod);
  }
  return modules.filter((m) => !gated.has(m));
}

export function canUsePublicBooking(plan: string): boolean {
  return canAccessFeature(plan, "public_booking");
}

/** Verifica se um módulo específico está permitido no plano. */
export function isModuleAllowedByPlan(moduleId: ModuleId, plan: string): boolean {
  return filterModulesByPlan([moduleId], plan).includes(moduleId);
}

/** Bloqueia recurso premium quando o plano não inclui o módulo. */
export function assertPremiumModule(moduleId: ModuleId, plan: string): boolean {
  return isModuleAllowedByPlan(moduleId, plan);
}
