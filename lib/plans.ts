// Planos de assinatura. O billing real (Mercado Pago) entra nas proximas fases;
// por enquanto a assinatura e simulada.

export interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  description: string;
  highlight?: boolean;
  badge?: string;
  features: string[];
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Essencial",
    priceMonthly: 39.9,
    description: "Para quem está começando a organizar o negócio.",
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
    highlight: true,
    badge: "Mais popular",
    features: [
      "Tudo do Essencial",
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
    description: "Para redes, franquias e múltiplas unidades.",
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
];

export function getPlan(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

// Tabela comparativa (valores na mesma ordem de PLANS: Essencial, Profissional, Premium).
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
      { label: "Módulos do seu segmento", values: [true, true, true] },
      { label: "Clientes cadastrados", values: ["Ilimitado", "Ilimitado", "Ilimitado"] },
      { label: "Agendamentos", values: ["Ilimitado", "Ilimitado", "Ilimitado"] },
      { label: "Controle financeiro e caixa", values: [true, true, true] },
      { label: "Acesso no celular e computador", values: [true, true, true] },
    ],
  },
  {
    group: "Equipe e unidades",
    rows: [
      { label: "Usuários na equipe", values: ["2", "8", "Ilimitado"] },
      { label: "Unidades / filiais", values: ["1", "1", "Ilimitado"] },
      { label: "Níveis de permissão", values: [true, true, true] },
    ],
  },
  {
    group: "Crescimento e automação",
    rows: [
      { label: "Relatórios", values: ["Básicos", "Avançados", "Consolidados"] },
      { label: "Lembretes por WhatsApp", values: [false, true, true] },
      { label: "Link público de agendamento", values: [false, true, true] },
      { label: "Módulos extras (estoque, comissão)", values: [false, false, true] },
    ],
  },
  {
    group: "Suporte",
    rows: [
      { label: "Atendimento", values: ["E-mail", "Prioritário", "Dedicado"] },
      { label: "Onboarding assistido", values: [false, true, true] },
    ],
  },
];
