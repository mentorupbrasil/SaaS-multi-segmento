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
    description: "Organize agenda, clientes e caixa — ideal para começar sozinho ou em dupla.",
    audience: "Autônomos e MEI",
    features: [
      "Agenda, clientes, serviços e financeiro",
      "Caixa do dia a dia",
      "Painel com indicadores básicos",
      "Até 2 usuários · 1 unidade",
      "Suporte por e-mail",
    ],
  },
  {
    id: "pro",
    name: "Profissional",
    priceMonthly: 79.9,
    description: "Para quem quer crescer com todos os módulos do segmento e automação.",
    audience: "Pequenas empresas",
    highlight: true,
    badge: "Mais popular",
    features: [
      "Tudo do Inicial",
      "Todos os módulos do seu segmento",
      "Até 8 usuários · 1 unidade",
      "WhatsApp e link de agendamento online",
      "Relatórios avançados e exportação CSV/Excel",
      "Integrações e IA (conforme plano)",
      "Suporte prioritário",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    priceMonthly: 149.9,
    description: "Estoque, ordens de serviço e operação multi-unidade sem limites.",
    audience: "Empresas em crescimento",
    badge: "Completo",
    features: [
      "Tudo do Profissional",
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
      "Tudo do Premium",
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
  return PLANS.find((p) => p.id === id);
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
      { label: "Agenda, clientes e serviços", values: [true, true, true, true] },
      { label: "Financeiro e caixa", values: [true, true, true, true] },
      { label: "Módulos extras do segmento (PDV, pets, turmas…)", values: [false, true, true, true] },
      { label: "Estoque e ordens de serviço", values: [false, false, true, true] },
      { label: "Painel com indicadores", values: ["Básico", "Completo", "Completo", "Completo"] },
    ],
  },
  {
    group: "Equipe e unidades",
    rows: [
      { label: "Usuários na equipe", values: ["2", "8", "Ilimitado", "Ilimitado"] },
      { label: "Unidades / filiais", values: ["1", "1", "Ilimitado", "Rede"] },
      { label: "Níveis de permissão", values: [true, true, true, true] },
    ],
  },
  {
    group: "Crescimento e automação",
    rows: [
      { label: "Relatórios avançados", values: [false, true, true, true] },
      { label: "Relatórios consolidados (multi-unidade)", values: [false, false, true, true] },
      { label: "Exportação CSV / Excel", values: [false, true, true, true] },
      { label: "Lembretes por WhatsApp", values: [false, true, true, true] },
      { label: "Link público de agendamento", values: [false, true, true, true] },
      { label: "Integrações e IA", values: [false, true, true, true] },
      { label: "Integrações personalizadas", values: [false, false, false, true] },
    ],
  },
  {
    group: "Suporte",
    rows: [
      { label: "Atendimento", values: ["E-mail", "Prioritário", "Dedicado", "Gerente de conta"] },
      { label: "Onboarding assistido", values: [false, true, true, true] },
      { label: "SLA garantido", values: [false, false, false, true] },
    ],
  },
];
