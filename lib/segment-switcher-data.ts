import { ALL_SEGMENTS, CATEGORY_LABELS } from "@/segments";
import type { SegmentOption } from "@/components/segment-switcher";

export function listSegmentsForSwitcher(): SegmentOption[] {
  return ALL_SEGMENTS.map((seg) => ({
    id: seg.id,
    label: seg.label,
    tagline: seg.tagline,
    category: CATEGORY_LABELS[seg.category],
    icon: seg.icon,
  })).sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
}
