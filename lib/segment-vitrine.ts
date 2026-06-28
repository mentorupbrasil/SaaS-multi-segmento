import { ALL_SEGMENTS, getSegmentGroups } from "@/segments";
import type { SegmentCategory, SegmentTemplate } from "@/segments/types";

/** Segmentos exibidos como atalhos rápidos no menu e na vitrine. */
export const FEATURED_SEGMENT_IDS = [
  "barbearia",
  "salao",
  "clinica",
  "oficina",
  "restaurante",
  "hotel",
  "escola",
  "clinica-veterinaria",
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
