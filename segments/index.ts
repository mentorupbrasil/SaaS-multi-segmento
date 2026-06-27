import type { SegmentTemplate, SegmentCategory } from "./types";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "./types";
import { barbearia } from "./barbearia";
import { salao } from "./salao";
import { clinica } from "./clinica";
import { oficina } from "./oficina";
import { estetica, tatuagem } from "./beleza-extra";
import {
  esmalteria,
  sobrancelhas,
  cilios,
  maquiagem,
  cabeleireiro,
  penteadista,
  depilacao,
  massoterapia,
} from "./beleza-pro";
import { odontologia, psicologia, personal, academia } from "./saude-extra";
import { lavaRapido } from "./automotivo-extra";
import { advogado, assistencia, imobiliaria, obras } from "./servicos";
import { restaurante, petshop } from "./alimentacao";
import {
  lanchonete,
  pizzaria,
  hamburgueria,
  churrascaria,
  sushi,
  acaiteria,
  cafeteria,
  padaria,
  sorveteria,
  foodtruck,
  delivery,
} from "./alimentacao-extra";
import { escola } from "./educacao";

// Registro central de segmentos. Adicionar um nicho = importar e adicionar aqui.
const LIST: SegmentTemplate[] = [
  salao,
  cabeleireiro,
  barbearia,
  esmalteria,
  sobrancelhas,
  cilios,
  maquiagem,
  penteadista,
  depilacao,
  estetica,
  massoterapia,
  tatuagem,
  clinica,
  odontologia,
  psicologia,
  personal,
  academia,
  oficina,
  lavaRapido,
  restaurante,
  lanchonete,
  pizzaria,
  hamburgueria,
  churrascaria,
  sushi,
  acaiteria,
  cafeteria,
  padaria,
  sorveteria,
  foodtruck,
  delivery,
  advogado,
  assistencia,
  imobiliaria,
  obras,
  petshop,
  escola,
];

export const SEGMENTS: Record<string, SegmentTemplate> = Object.fromEntries(
  LIST.map((s) => [s.id, s]),
);

export const ALL_SEGMENTS: SegmentTemplate[] = LIST;

export function getSegment(id: string | undefined | null): SegmentTemplate | undefined {
  if (!id) return undefined;
  return SEGMENTS[id];
}

export function getSegmentBySlug(slug: string): SegmentTemplate | undefined {
  return ALL_SEGMENTS.find((s) => s.slug === slug);
}

export interface SegmentGroup {
  category: SegmentCategory;
  label: string;
  segments: SegmentTemplate[];
}

/** Segmentos agrupados por categoria, na ordem definida. */
export function getSegmentGroups(): SegmentGroup[] {
  return CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    segments: ALL_SEGMENTS.filter((s) => s.category === category),
  })).filter((g) => g.segments.length > 0);
}

export type { SegmentTemplate, SegmentCategory } from "./types";
export { CATEGORY_LABELS, CATEGORY_ORDER } from "./types";
