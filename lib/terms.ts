import { getSegment } from "@/segments";

// Termos padrao (fallback). Cada segmento sobrescreve o que precisar.
export const DEFAULT_TERMS: Record<string, string> = {
  customer: "Cliente",
  customer_plural: "Clientes",
  professional: "Profissional",
  professional_plural: "Profissionais",
  service: "Servico",
  service_plural: "Servicos",
  appointment: "Agendamento",
  appointment_plural: "Agenda",
  work_order: "Ordem de Servico",
  work_order_plural: "Ordens de Servico",
  financial: "Financeiro",
  team: "Equipe",
  inventory: "Estoque",
  records: "Prontuario",
};

export type Terms = Record<string, string>;

/**
 * Resolve a nomenclatura final de um tenant:
 * padrao -> termos do segmento -> overrides do tenant (organization.config.terms)
 */
export function resolveTerms(
  segmentId: string | undefined | null,
  overrides: Record<string, string> = {},
): Terms {
  const segment = getSegment(segmentId);
  return {
    ...DEFAULT_TERMS,
    ...(segment?.terms ?? {}),
    ...overrides,
  };
}

/** Helper para pegar um termo com fallback. */
export function term(terms: Terms, key: string, fallback?: string): string {
  return terms[key] ?? fallback ?? key;
}
