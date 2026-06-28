import type { ModuleId } from "@/modules/types";
import type { SegmentCategory } from "@/segments/types";
import { getSegment } from "@/segments";

/** Modulos extras ligados automaticamente por categoria de segmento. */
const CATEGORY_MODULES: Partial<Record<SegmentCategory, ModuleId[]>> = {
  automotivo: ["vehicles", "quotes"],
  pet: ["pets"],
  hotelaria: ["rooms", "reservations", "housekeeping"],
  comercio: ["pdv", "quotes", "suppliers"],
  alimentacao: ["pdv", "quotes", "kitchen"],
  eventos: ["events", "quotes", "suppliers"],
  organizacoes: ["donations", "groups"],
  saude: ["suppliers", "scheduling"],
  servicos: ["quotes"],
  educacao: ["education"],
};

const BASE_MODULES: ModuleId[] = [
  "clients",
  "scheduling",
  "services",
  "financial",
  "team",
];

/** Resolve modulos ativos para um segmento (template + categoria). */
export function resolveSegmentModules(segmentId: string): ModuleId[] {
  const segment = getSegment(segmentId);
  if (!segment) return BASE_MODULES;

  const fromCategory = CATEGORY_MODULES[segment.category] ?? [];
  const excluded = new Set<ModuleId>(segment.excludeModules ?? []);
  const merged = new Set<ModuleId>([
    ...BASE_MODULES,
    ...segment.modules,
    ...fromCategory,
  ]);

  return Array.from(merged).filter((moduleId) => !excluded.has(moduleId));
}
