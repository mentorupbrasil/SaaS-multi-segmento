import { isFeatureEnabled } from "@/lib/feature-flags";
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
  const seenHrefs = new Set<string>();

  for (const moduleId of moduleIds) {
    const mod = MODULES[moduleId];
    if (!mod) continue;
    for (const navItem of mod.nav) {
      if (seenHrefs.has(navItem.href)) continue;
      if (navItem.href === "/comissoes" && segment.category === "alimentacao") continue;
      seenHrefs.add(navItem.href);
      items.push({
        href: navItem.href,
        label: terms[navItem.labelKey] ?? navItem.fallback,
        icon: navItem.icon,
        comingSoon: mod.comingSoon,
      });
    }
  }

  const premiumPlans = ["pro", "premium", "enterprise"];
  if (org.plan && premiumPlans.includes(org.plan)) {
    if (isFeatureEnabled("IA")) {
      items.push({ href: "/ia", label: "IA", icon: "Sparkles" });
    }
    items.push({ href: "/conexoes", label: "Integrações", icon: "Plug" });
  }

  items.push({ href: "/chamados", label: "Suporte", icon: "LifeBuoy" });

  return items;
}

/** Nav com todos os módulos da plataforma (super admin). */
export function buildAllModulesNav(segmentId = "barbearia"): NavItem[] {
  const terms: Terms = resolveTerms(segmentId, {});
  const items: NavItem[] = [];
  const seenHrefs = new Set<string>();

  for (const mod of ALL_MODULES) {
    for (const navItem of mod.nav) {
      if (seenHrefs.has(navItem.href)) continue;
      seenHrefs.add(navItem.href);
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

/** Retorna o href do menu mais específico que corresponde à rota atual. */
export function resolveActiveNavHref(pathname: string, hrefs: string[]): string | null {
  const matching = hrefs.filter(
    (href) => pathname === href || pathname.startsWith(`${href}/`),
  );
  if (matching.length === 0) return null;
  return matching.reduce((best, href) => (href.length > best.length ? href : best));
}
