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

export interface ComparisonGroup {
  group: string;
  rows: ComparisonRow[];
}

export const COMPARISON: ComparisonGroup[] = [
  {
    group: "Operação do dia a dia",
    rows: [
      { label: "Agenda, clientes e serviços", values: [true, true, true] },
      { label: "Financeiro e caixa", values: [true, true, true] },
      { label: "Módulos extras do segmento (PDV, pets, turmas…)", values: [true, true, true] },
      { label: "Estoque e ordens de serviço", values: [false, true, true] },
      { label: "Painel com indicadores", values: ["Completo", "Completo", "Completo"] },
    ],
  },
  {
    group: "Equipe e unidades",
    rows: [
      { label: "Usuários na equipe", values: ["8", "Ilimitado", "Ilimitado"] },
      { label: "Unidades / filiais", values: ["1", "Ilimitado", "Rede"] },
      { label: "Níveis de permissão", values: [true, true, true] },
    ],
  },
  {
    group: "Crescimento e automação",
    rows: [
      { label: "Relatórios avançados", values: [true, true, true] },
      { label: "Relatórios consolidados (multi-unidade)", values: [false, true, true] },
      { label: "Exportação CSV / Excel", values: [true, true, true] },
      { label: "Lembretes por WhatsApp", values: [true, true, true] },
      { label: "Google Agenda", values: [true, true, true] },
      { label: "Pagamentos (PIX / Mercado Pago)", values: [true, true, true] },
      { label: "Link público de agendamento", values: [true, true, true] },
      { label: "Integrações e IA", values: [true, true, true] },
      { label: "Integrações personalizadas", values: [false, false, true] },
    ],
  },
  {
    group: "Suporte",
    rows: [
      { label: "Atendimento", values: ["Prioritário", "Dedicado", "Gerente de conta"] },
      { label: "Onboarding assistido", values: [true, true, true] },
      { label: "SLA garantido", values: [false, false, true] },
    ],
  },
];
