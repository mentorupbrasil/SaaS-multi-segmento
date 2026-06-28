import { getSegment } from "@/segments";
import { MODULES } from "@/modules";
import { resolveSegmentModules } from "./segment-modules";
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

export function buildNav(org: OrgLike): NavItem[] {
  const segment = getSegment(org.segmentId);
  if (!segment) return [];
  const terms: Terms = resolveTerms(org.segmentId, extractTermOverrides(org.config));
  const moduleIds = resolveSegmentModules(org.segmentId);

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
  return items;
}

export function buildSuperAdminNav(): NavItem[] {
  return buildNav({ segmentId: "barbearia" });
}

export function buildNavForUser(org: OrgLike, _isPlatformAdmin?: boolean): NavItem[] {
  return buildNav(org);
}

export function isModuleEnabled(segmentId: string, moduleId: string): boolean {
  return resolveSegmentModules(segmentId).includes(moduleId as never);
}
