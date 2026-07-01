import { ALL_MODULES } from "@/modules";
import { isModuleEnabled } from "@/lib/nav";
import type { ModuleId } from "@/modules/types";

/** Rotas extras cujo prefixo não basta inferir só pelo primeiro segmento do href. */
const ROUTE_OVERRIDES: Record<string, ModuleId> = {
  "/mesas": "pdv",
};

function buildRouteModuleMap(): Record<string, ModuleId> {
  const map: Record<string, ModuleId> = {};
  for (const mod of ALL_MODULES) {
    for (const navItem of mod.nav) {
      const first = navItem.href.split("/").filter(Boolean)[0];
      if (!first) continue;
      const base = `/${first}`;
      map[base] = mod.id;
    }
  }
  return { ...map, ...ROUTE_OVERRIDES };
}

export const ROUTE_MODULE: Record<string, ModuleId> = buildRouteModuleMap();

/** Verifica se o segmento tem acesso ao módulo da rota. */
export function checkModuleAccess(pathname: string, segmentId: string): boolean {
  const base = "/" + pathname.split("/").filter(Boolean)[0];
  const moduleId = ROUTE_MODULE[base];
  if (!moduleId) return true;

  if (base === "/mesas") {
    return isModuleEnabled(segmentId, "pdv") || isModuleEnabled(segmentId, "kitchen");
  }

  return isModuleEnabled(segmentId, moduleId);
}

export function getModuleForPath(pathname: string): ModuleId | undefined {
  const base = "/" + pathname.split("/").filter(Boolean)[0];
  return ROUTE_MODULE[base];
}
