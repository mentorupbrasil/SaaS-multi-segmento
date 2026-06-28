import { ALL_SEGMENTS, getSegmentGroups } from "@/segments";
import type { SegmentCategory, SegmentTemplate } from "@/segments/types";

/** Máximo de segmentos listados no mega-menu (resto vai para a página). */
export const MENU_SEGMENT_PREVIEW_LIMIT = 12;

/** Segmentos exibidos como atalhos rápidos no menu e na vitrine. */
export const FEATURED_SEGMENT_IDS = [
  "restaurante",
  "barbearia",
  "clinica",
  "oficina",
  "academia",
  "escola",
  "salao",
  "hotel",
] as const;

export function getFeaturedSegments(): SegmentTemplate[] {
  return FEATURED_SEGMENT_IDS.map((id) => ALL_SEGMENTS.find((s) => s.id === id)).filter(
    (s): s is SegmentTemplate => Boolean(s),
  );
}

export function getSegmentTotal(): number {
  return ALL_SEGMENTS.length;
}

export function filterSegments(query: string, category?: SegmentCategory): SegmentTemplate[] {
  const q = query.trim().toLowerCase();
  let list = ALL_SEGMENTS;
  if (category) {
    list = list.filter((s) => s.category === category);
  }
  if (!q) return list;
  return list.filter(
    (s) =>
      s.label.toLowerCase().includes(q) ||
      s.tagline.toLowerCase().includes(q) ||
      s.slug.toLowerCase().includes(q),
  );
}

export function getSegmentGroupsForVitrine() {
  return getSegmentGroups();
}

/** Nomes curtos para preview em cards de categoria (home). */
export function getCategoryPreviewLabels(category: SegmentCategory, limit = 3): string[] {
  return ALL_SEGMENTS.filter((s) => s.category === category)
    .slice(0, limit)
    .map((s) => s.label);
}
