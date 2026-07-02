// Planos de assinatura (marketing e UI).
// Limites efetivos são aplicados em lib/plan-limits.ts e lib/plan-enforcement.ts.

export interface Plan {
  id: string;
  name: string;
  priceMonthly: number | null;
  description: string;
  audience: string;
  highlight?: boolean;
  badge?: string;
  features: string[];
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Inicial",
    priceMonthly: 39.9,
    description:
      "Operação completa do seu segmento com integrações e relatórios — ideal para começar a vender hoje.",
    audience: "Autônomos e pequenas empresas",
    highlight: true,
    badge: "Mais popular",
    features: [
      "Todos os módulos do seu segmento",
      "Agenda, clientes, serviços e financeiro",
      "WhatsApp, Google Agenda e pagamentos (PIX / Mercado Pago)",
      "Relatórios avançados e exportação CSV/Excel",
      "Link público de agendamento online",
      "Até 8 usuários · 1 unidade",
      "Suporte prioritário",
    ],
  },
  {
    id: "pro",
    name: "Profissional",
    priceMonthly: 79.9,
    description: "Estoque, ordens de serviço e operação multi-unidade sem limites.",
    audience: "Empresas em crescimento",
    badge: "Completo",
    features: [
      "Tudo do Inicial",
      "Estoque e ordens de serviço",
      "Usuários e filiais ilimitados",
      "Relatórios consolidados por unidade",
      "Comissões e controle operacional avançado",
      "Suporte dedicado",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceMonthly: null,
    description: "Redes, franquias e operações que exigem contrato e integrações sob medida.",
    audience: "Redes e franquias",
    badge: "Sob medida",
    features: [
      "Tudo do Profissional",
      "Gestão de rede e franquias",
      "Integrações e APIs personalizadas",
      "Onboarding e treinamento dedicados",
      "SLA e gerente de conta",
      "Faturamento personalizado",
    ],
  },
];

export const PAYABLE_PLANS = PLANS.filter((p) => p.priceMonthly !== null);

export function getPlan(id: string): Plan | undefined {
  const normalized = id === "premium" ? "pro" : id;
  return PLANS.find((p) => p.id === normalized);
}

export interface ComparisonRow {
  label: string;
  values: (string | boolean)[];
}

/** Itens iguais em todos os planos — exibidos uma vez acima da tabela. */
export const COMPARISON_INCLUDED_EVERYWHERE = [
  "Agenda, clientes, serviços e financeiro",
  "Todos os módulos do seu segmento",
  "WhatsApp, Google Agenda e pagamentos",
  "Relatórios, exportação Excel e agendamento online",
];

/** Só o que muda entre planos (tabela enxuta). */
export const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "Usuários na equipe", values: ["Até 8", "Ilimitado", "Ilimitado"] },
  { label: "Unidades / filiais", values: ["1 unidade", "Ilimitadas", "Rede / franquias"] },
  { label: "Estoque e ordens de serviço", values: [false, true, true] },
  { label: "Relatórios multi-unidade", values: [false, true, true] },
  { label: "Integrações personalizadas", values: [false, false, true] },
  { label: "Suporte", values: ["Prioritário", "Dedicado", "Gerente de conta"] },
  { label: "SLA garantido", values: [false, false, true] },
];

export function getDifferentiatingComparisonRows(): ComparisonRow[] {
  return COMPARISON_ROWS.filter((row) => {
    const serialized = row.values.map((v) => String(v));
    return new Set(serialized).size > 1;
  });
}

/** @deprecated Use COMPARISON_ROWS — mantido para compatibilidade interna */
export interface ComparisonGroup {
  group: string;
  rows: ComparisonRow[];
}

export const COMPARISON: ComparisonGroup[] = [
  { group: "Diferenças entre planos", rows: getDifferentiatingComparisonRows() },
];
