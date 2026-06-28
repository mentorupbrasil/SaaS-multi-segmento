import { getSegment } from "@/segments";
import { ALL_MODULES, MODULES } from "@/modules";
import { resolveSegmentModules } from "./segment-modules";
import { filterModulesByPlan } from "./plan-enforcement";
import { resolveTerms, type Terms } from "./terms";

export interface NavItem {
  href: string;
  label: string;
  icon: string;
  comingSoon?: boolean;
}

interface OrgLike {
  segmentId: string;
  config?: unknown;
  plan?: string;
}

function extractTermOverrides(config: unknown): Record<string, string> {
  if (config && typeof config === "object" && "terms" in config) {
    const terms = (config as { terms?: unknown }).terms;
    if (terms && typeof terms === "object") return terms as Record<string, string>;
  }
  return {};
}

export function buildNav(org: OrgLike): NavItem[] {
  const segment = getSegment(org.segmentId);
  if (!segment) return [];
  const terms: Terms = resolveTerms(org.segmentId, extractTermOverrides(org.config));
  const moduleIds = filterModulesByPlan(
    resolveSegmentModules(org.segmentId),
    org.plan ?? "free",
  );

  const items: NavItem[] = [];
  for (const moduleId of moduleIds) {
    const mod = MODULES[moduleId];
    if (!mod) continue;
    for (const navItem of mod.nav) {
      items.push({
        href: navItem.href,
        label: terms[navItem.labelKey] ?? navItem.fallback,
        icon: navItem.icon,
      });
    }
  }

  const premiumPlans = ["pro", "premium", "enterprise"];
  if (org.plan && premiumPlans.includes(org.plan)) {
    items.push(
      { href: "/conexoes", label: "Integrações", icon: "Plug" },
      { href: "/ia", label: "IA", icon: "Sparkles" },
    );
  }

  return items;
}

/** Nav com todos os módulos da plataforma (super admin). */
export function buildAllModulesNav(segmentId = "barbearia"): NavItem[] {
  const terms: Terms = resolveTerms(segmentId, {});
  const items: NavItem[] = [];

  for (const mod of ALL_MODULES) {
    for (const navItem of mod.nav) {
      items.push({
        href: navItem.href,
        label: terms[navItem.labelKey] ?? navItem.fallback,
        icon: navItem.icon,
        comingSoon: mod.comingSoon,
      });
    }
  }

  return items;
}

export function buildSuperAdminNav(segmentId?: string): NavItem[] {
  return buildAllModulesNav(segmentId ?? "barbearia");
}

export function buildNavForUser(org: OrgLike, _isPlatformAdmin?: boolean): NavItem[] {
  return buildNav(org);
}

export function isModuleEnabled(segmentId: string, moduleId: string): boolean {
  return resolveSegmentModules(segmentId).includes(moduleId as never);
}
