// Planos de assinatura. O billing real (Mercado Pago) entra nas proximas fases;
// por enquanto a assinatura e simulada.

export interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  highlight?: boolean;
  features: string[];
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Essencial",
    priceMonthly: 39.9,
    highlight: true,
    features: [
      "Todos os modulos do seu segmento",
      "Clientes ilimitados",
      "Agenda e financeiro",
      "1 unidade",
      "Suporte por e-mail",
    ],
  },
  {
    id: "pro",
    name: "Profissional",
    priceMonthly: 79.9,
    features: [
      "Tudo do Essencial",
      "Multiplas unidades",
      "Relatorios avancados",
      "Modulos extras (estoque, comissao)",
      "Integracao WhatsApp",
    ],
  },
];

export function getPlan(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}
