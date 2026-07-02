import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth-context";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { isModuleAllowedByPlan } from "@/lib/plan-enforcement";
import { canAccessFeature, hasGrowthPlanAccess } from "@/lib/plan-limits";
import { checkModuleAccess, getModuleForPath } from "@/lib/route-modules";

export { checkModuleAccess, getModuleForPath } from "@/lib/route-modules";

function basePath(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  return parts[0] ? `/${parts[0]}` : "/";
}

/** Bloqueia rota se módulo, plano ou feature flag não permitem acesso. */
export async function requireModule(pathname: string) {
  const ctx = await getAuthContext();
  const plan = ctx.organization.plan;
  const base = basePath(pathname);

  if (!checkModuleAccess(pathname, ctx.effectiveSegmentId)) {
    redirect("/dashboard");
  }

  const moduleId = getModuleForPath(pathname);
  if (moduleId && !isModuleAllowedByPlan(moduleId, plan)) {
    redirect("/assinatura");
  }

  if (base === "/relatorios" && !canAccessFeature(plan, "advanced_reports")) {
    redirect("/assinatura");
  }

  if (base === "/ia") {
    if (!isFeatureEnabled("IA")) redirect("/dashboard");
    if (!hasGrowthPlanAccess(plan)) redirect("/assinatura");
  }

  if (base === "/conexoes" && !hasGrowthPlanAccess(plan)) {
    redirect("/assinatura");
  }
}
