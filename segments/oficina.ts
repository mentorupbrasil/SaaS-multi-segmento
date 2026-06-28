import type { SegmentTemplate } from "./types";

export const oficina: SegmentTemplate = {
  id: "oficina",
  label: "Oficina / Mecânica",
  slug: "oficina-mecanica",
  icon: "Wrench",
  category: "automotivo",
  tagline: "Ordens de serviço, clientes e estoque para a sua oficina.",
  modules: ["clients", "work_orders", "services", "inventory", "financial", "team"],
  terms: {
    customer: "Cliente",
    customer_plural: "Clientes",
    professional: "Mecânico",
    professional_plural: "Mecânicos",
    service: "Serviço",
    service_plural: "Serviços",
    work_order: "Ordem de Serviço",
    work_order_plural: "Ordens de Serviço",
    inventory: "Peças / Estoque",
    quote: "Orçamento",
    quote_plural: "Orçamentos",
    vehicle: "Veículo",
    vehicle_plural: "Veículos",
    supplier_plural: "Fornecedores",
  },
  customerFields: [
    { key: "veiculo", label: "Veículo", type: "text", placeholder: "Ex.: Gol 1.6" },
    { key: "placa", label: "Placa", type: "text" },
    { key: "ano", label: "Ano", type: "number" },
  ],
  specialties: [
    { id: "mecanica-geral", label: "Mecânica geral" },
    { id: "eletrica", label: "Elétrica automotiva" },
    { id: "funilaria", label: "Funilaria e pintura" },
    { id: "suspensao", label: "Suspensão e freios" },
  ],
  defaultServices: [
    { name: "Troca de óleo", price: 120, durationMin: 40 },
    { name: "Revisão completa", price: 350, durationMin: 120 },
    { name: "Alinhamento e balanceamento", price: 100, durationMin: 60 },
  ],
  benefits: [
    "Ordens de serviço do orçamento ao fechamento",
    "Cadastro de veículos vinculado ao cliente",
    "Controle de estoque de peças com baixa automática",
    "Financeiro com faturamento por ordem de serviço",
  ],
  faq: [
    { q: "Consigo gerar orçamento antes de aprovar?", a: "Sim. A ordem de serviço começa como orçamento e vira serviço aprovado quando o cliente autoriza." },
    { q: "O estoque baixa sozinho?", a: "Sim. Ao usar uma peça na ordem de serviço, o estoque é atualizado automaticamente." },
  ],
  seo: {
    title: "Sistema para Oficina Mecânica | Ordem de serviço e estoque",
    description:
      "Software para oficina mecânica com ordem de serviço, clientes, veículos, estoque de peças e financeiro.",
    keywords: ["sistema para oficina", "ordem de serviço oficina", "software mecânica", "app oficina"],
    headline: "O sistema da sua oficina, do orçamento ao caixa",
    subheadline:
      "Ordens de serviço, cadastro de veículos e clientes, estoque de peças e controle financeiro.",
  },
};
