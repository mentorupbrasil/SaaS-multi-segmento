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
import { consultorioMedico, fisioterapia, nutricionista, terapeuta } from "./saude-pro";
import { lavaRapido } from "./automotivo-extra";
import {
  centroAutomotivo,
  autoEletrica,
  borracharia,
  esteticaAutomotiva,
  funilaria,
  oficinaMotos,
  oficinaCaminhoes,
  trocaOleo,
  lojaPneus,
} from "./automotivo-pro";
import { advogado, assistencia, imobiliaria, obras } from "./servicos";
import { contabilidade, consultoria, seguros, despachante, agencia } from "./servicos-pro";
import { restaurante } from "./alimentacao";
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
import { escola, cursoLivre, escolaInfantil, escolaTecnica, universidade, cursinho, idiomas, musicaEscola, reforcoEscolar } from "./educacao";
import {
  lojaRoupas,
  lojaCalcados,
  lojaCosmeticos,
  lojaInformatica,
  lojaCelulares,
  lojaEletronicos,
  lojaMoveis,
  papelaria,
  livraria,
  lojaPresentes,
} from "./comercio";
import {
  lojaUtilidades,
  lojaFerragens,
  autopecas,
  farmacia,
  supermercado,
  mercearia,
  minimercado,
  distribuidora,
  atacado,
  depositoMateriais,
} from "./comercio-extra";
import {
  hotel,
  pousada,
  hostel,
  resort,
  motel,
  flat,
  apartHotel,
  chales,
  hotelFazenda,
  camping,
  coloniaFerias,
} from "./hotelaria";
import {
  petshop,
  clinicaVeterinaria,
  hospitalVeterinario,
  banhoTosa,
  hotelPet,
  crechePet,
  adestramento,
  esteticaAnimal,
  petCenter,
  petBoutique,
  agropecuaria,
} from "./pet";
import {
  cerimonialista,
  organizadoraEventos,
  empresaEventos,
  casaFestas,
  buffet,
  decoracaoEventos,
  fotografia,
  filmagem,
} from "./eventos";
import {
  djSonorizacao,
  iluminacao,
  locacaoEstruturas,
  aluguelMobiliario,
  assessoriaCasamentos,
  produtoraEventos,
  formatura,
  eventosCorporativos,
} from "./eventos-extra";
import {
  igreja,
  comunidadeReligiosa,
  ministerio,
  associacao,
  ong,
  fundacao,
} from "./organizacoes";
import {
  institutoSocial,
  osfl,
  centroComunitario,
  projetosSociais,
  gruposMovimentos,
} from "./organizacoes-extra";

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
  consultorioMedico,
  odontologia,
  psicologia,
  fisioterapia,
  nutricionista,
  terapeuta,
  personal,
  academia,
  oficina,
  centroAutomotivo,
  autoEletrica,
  oficinaMotos,
  oficinaCaminhoes,
  funilaria,
  trocaOleo,
  borracharia,
  lojaPneus,
  esteticaAutomotiva,
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
  lojaRoupas,
  lojaCalcados,
  lojaCosmeticos,
  lojaInformatica,
  lojaCelulares,
  lojaEletronicos,
  lojaMoveis,
  papelaria,
  livraria,
  lojaPresentes,
  lojaUtilidades,
  lojaFerragens,
  autopecas,
  farmacia,
  supermercado,
  mercearia,
  minimercado,
  distribuidora,
  atacado,
  depositoMateriais,
  hotel,
  pousada,
  hostel,
  resort,
  motel,
  flat,
  apartHotel,
  chales,
  hotelFazenda,
  camping,
  coloniaFerias,
  petshop,
  clinicaVeterinaria,
  hospitalVeterinario,
  banhoTosa,
  hotelPet,
  crechePet,
  adestramento,
  esteticaAnimal,
  petCenter,
  petBoutique,
  agropecuaria,
  cerimonialista,
  organizadoraEventos,
  empresaEventos,
  casaFestas,
  buffet,
  decoracaoEventos,
  fotografia,
  filmagem,
  djSonorizacao,
  iluminacao,
  locacaoEstruturas,
  aluguelMobiliario,
  assessoriaCasamentos,
  produtoraEventos,
  formatura,
  eventosCorporativos,
  igreja,
  comunidadeReligiosa,
  ministerio,
  associacao,
  ong,
  fundacao,
  institutoSocial,
  osfl,
  centroComunitario,
  projetosSociais,
  gruposMovimentos,
  advogado,
  contabilidade,
  imobiliaria,
  assistencia,
  consultoria,
  seguros,
  despachante,
  agencia,
  obras,
  escola,
  cursoLivre,
  escolaInfantil,
  escolaTecnica,
  universidade,
  cursinho,
  idiomas,
  musicaEscola,
  reforcoEscolar,
];

export const SEGMENTS: Record<string, SegmentTemplate> = Object.fromEntries(
  LIST.map((s) => [s.id, s]),
);

export const ALL_SEGMENTS: SegmentTemplate[] = LIST;

import { withDefaultSpecialties } from "@/lib/segment-specialties";

export function getSegment(id: string | undefined | null): SegmentTemplate | undefined {
  if (!id) return undefined;
  const segment = SEGMENTS[id];
  if (!segment) return undefined;
  return withDefaultSpecialties(segment);
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
