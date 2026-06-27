import type { SegmentTemplate } from "./types";
import { barbearia } from "./barbearia";
import { salao } from "./salao";
import { clinica } from "./clinica";
import { oficina } from "./oficina";

// Registro central de segmentos. Adicionar um nicho = importar e adicionar aqui.
export const SEGMENTS: Record<string, SegmentTemplate> = {
  barbearia,
  salao,
  clinica,
  oficina,
};

export const ALL_SEGMENTS: SegmentTemplate[] = Object.values(SEGMENTS);

export function getSegment(id: string | undefined | null): SegmentTemplate | undefined {
  if (!id) return undefined;
  return SEGMENTS[id];
}

export function getSegmentBySlug(slug: string): SegmentTemplate | undefined {
  return ALL_SEGMENTS.find((s) => s.slug === slug);
}

export type { SegmentTemplate } from "./types";
