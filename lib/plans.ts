// Planos de assinatura (marketing e UI).
// Limites efetivos (usuários, filiais, módulos extras) são aplicados em lib/plan-limits.ts.
// O billing real (Asaas) usa ASAAS_API_KEY; sem chave, a assinatura é simulada.

export interface Plan {
  id: string;
  name: string;
  priceMonthly: number | null; // null = sob consulta (Enterprise)
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
    description: "Para quem está começando a organizar o negócio.",
    audience: "Autônomos e MEI",
    features: [
      "Todos os módulos do seu segmento",
      "Clientes e agendamentos ilimitados",
      "Controle financeiro e caixa",
      "Até 2 usuários na equipe",
      "1 unidade",
      "Suporte por e-mail",
    ],
  },
  {
    id: "pro",
    name: "Profissional",
    priceMonthly: 79.9,
    description: "Para negócios em crescimento que querem vender mais.",
    audience: "Pequenas empresas",
    highlight: true,
    badge: "Mais popular",
    features: [
      "Tudo do Inicial",
      "Até 8 usuários na equipe",
      "Lembretes automáticos por WhatsApp",
      "Link público de agendamento",
      "Relatórios avançados",
      "Suporte prioritário",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    priceMonthly: 149.9,
    description: "Para empresas em crescimento com mais volume.",
    audience: "Empresas em crescimento",
    badge: "Completo",
    features: [
      "Tudo do Profissional",
      "Usuários ilimitados",
      "Múltiplas unidades e filiais",
      "Módulos extras (estoque, comissão)",
      "Relatórios consolidados por unidade",
      "Suporte dedicado",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceMonthly: null,
    description: "Para redes, franquias e operações personalizadas.",
    audience: "Redes e franquias",
    badge: "Sob medida",
    features: [
      "Tudo do Premium",
      "Gestão de rede e franquias",
      "Onboarding e treinamento dedicados",
      "Integrações personalizadas",
      "SLA e gerente de conta",
      "Faturamento personalizado",
    ],
  },
];

/** Planos com preço fixo (assináveis no autoatendimento). */
export const PAYABLE_PLANS = PLANS.filter((p) => p.priceMonthly !== null);

export function getPlan(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

// Tabela comparativa (valores na mesma ordem de PLANS: Inicial, Profissional, Premium, Enterprise).
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
    group: "Essencial do dia a dia",
    rows: [
      { label: "Módulos do seu segmento", values: [true, true, true, true] },
      { label: "Clientes cadastrados", values: ["Ilimitado", "Ilimitado", "Ilimitado", "Ilimitado"] },
      { label: "Agendamentos", values: ["Ilimitado", "Ilimitado", "Ilimitado", "Ilimitado"] },
      { label: "Controle financeiro e caixa", values: [true, true, true, true] },
      { label: "Acesso no celular e computador", values: [true, true, true, true] },
    ],
  },
  {
    group: "Equipe e unidades",
    rows: [
      { label: "Usuários na equipe", values: ["2", "8", "Ilimitado", "Ilimitado"] },
      { label: "Unidades / filiais", values: ["1", "1", "Múltiplas", "Rede"] },
      { label: "Níveis de permissão", values: [true, true, true, true] },
    ],
  },
  {
    group: "Crescimento e automação",
    rows: [
      { label: "Relatórios", values: ["Básicos", "Avançados", "Consolidados", "Personalizados"] },
      { label: "Lembretes por WhatsApp", values: [false, true, true, true] },
      { label: "Link público de agendamento", values: [false, true, true, true] },
      { label: "Módulos extras (estoque, comissão)", values: [false, false, true, true] },
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
