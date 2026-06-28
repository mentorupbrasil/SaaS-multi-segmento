import { getSegment } from "@/segments";

// Termos padrao (fallback). Cada segmento sobrescreve o que precisar.
export const DEFAULT_TERMS: Record<string, string> = {
  customer: "Cliente",
  customer_plural: "Clientes",
  professional: "Profissional",
  professional_plural: "Profissionais",
  service: "Serviço",
  service_plural: "Serviços",
  appointment: "Agendamento",
  appointment_plural: "Agenda",
  work_order: "Ordem de Serviço",
  work_order_plural: "Ordens de Serviço",
  financial: "Financeiro",
  cash_register: "Caixa",
  team: "Equipe",
  inventory: "Estoque",
  records: "Prontuário",
  quote: "Orçamento",
  quote_plural: "Orçamentos",
  supplier: "Fornecedor",
  supplier_plural: "Fornecedores",
  vehicle: "Veículo",
  vehicle_plural: "Veículos",
  pet: "Pet",
  pet_plural: "Pets",
  pdv: "PDV",
  room: "Quarto",
  room_plural: "Quartos",
  reservation: "Reserva",
  reservation_plural: "Reservas",
  event: "Evento",
  event_plural: "Eventos",
  donation: "Doação",
  donation_plural: "Doações",
  group: "Grupo",
  group_plural: "Grupos",
  package_plural: "Pacotes",
  vaccination_plural: "Vacinas",
  commission_plural: "Comissões",
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
