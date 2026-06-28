import { getSegment } from "@/segments";
import { MODULES, ALL_MODULES } from "@/modules";
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
}

function extractTermOverrides(config: unknown): Record<string, string> {
  if (config && typeof config === "object" && "terms" in config) {
    const terms = (config as { terms?: unknown }).terms;
    if (terms && typeof terms === "object") return terms as Record<string, string>;
  }
  return {};
}

/** Monta o menu lateral com base nos modulos ligados do segmento + nomenclatura. */
export function buildNav(org: OrgLike): NavItem[] {
  const segment = getSegment(org.segmentId);
  if (!segment) return [];
  const terms: Terms = resolveTerms(org.segmentId, extractTermOverrides(org.config));

  const items: NavItem[] = [];
  for (const moduleId of segment.modules) {
    const mod = MODULES[moduleId];
    if (!mod) continue;
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

/** Super admin: todos os modulos do sistema, independente do segmento. */
export function buildSuperAdminNav(): NavItem[] {
  const seen = new Set<string>();
  const items: NavItem[] = [];
  for (const mod of ALL_MODULES) {
    for (const navItem of mod.nav) {
      if (seen.has(navItem.href)) continue;
      seen.add(navItem.href);
      items.push({
        href: navItem.href,
        label: navItem.fallback,
        icon: navItem.icon,
        comingSoon: mod.comingSoon,
      });
    }
  }
  return items;
}

/** Monta nav do tenant; super admin ve todos os modulos. */
export function buildNavForUser(org: OrgLike, isPlatformAdmin: boolean): NavItem[] {
  if (isPlatformAdmin) return buildSuperAdminNav();
  return buildNav(org);
}

/** Verifica se um modulo esta ligado para um segmento. */
export function isModuleEnabled(segmentId: string, moduleId: string): boolean {
  const segment = getSegment(segmentId);
  return segment?.modules.includes(moduleId as never) ?? false;
}
