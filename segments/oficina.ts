import type { SegmentTemplate } from "./types";

export const oficina: SegmentTemplate = {
  id: "oficina",
  label: "Oficina / Mecanica",
  slug: "oficina-mecanica",
  icon: "Wrench",
  category: "automotivo",
  tagline: "Ordens de servico, clientes e estoque para a sua oficina.",
  modules: ["clients", "work_orders", "services", "inventory", "financial", "team"],
  terms: {
    customer: "Cliente",
    customer_plural: "Clientes",
    professional: "Mecanico",
    professional_plural: "Mecanicos",
    service: "Servico",
    service_plural: "Servicos",
    work_order: "Ordem de Servico",
    work_order_plural: "Ordens de Servico",
    inventory: "Pecas / Estoque",
  },
  customerFields: [
    { key: "veiculo", label: "Veiculo", type: "text", placeholder: "Ex.: Gol 1.6" },
    { key: "placa", label: "Placa", type: "text" },
    { key: "ano", label: "Ano", type: "number" },
  ],
  defaultServices: [
    { name: "Troca de oleo", price: 120, durationMin: 40 },
    { name: "Revisao completa", price: 350, durationMin: 120 },
    { name: "Alinhamento e balanceamento", price: 100, durationMin: 60 },
  ],
  benefits: [
    "Ordens de servico do orcamento ao fechamento",
    "Cadastro de veiculos vinculado ao cliente",
    "Controle de estoque de pecas",
    "Financeiro com faturamento por OS",
  ],
  seo: {
    title: "Sistema para Oficina Mecanica | Ordem de servico e estoque",
    description:
      "Software para oficina mecanica com ordem de servico, clientes, veiculos, estoque de pecas e financeiro.",
    keywords: ["sistema para oficina", "ordem de servico oficina", "software mecanica", "app oficina"],
    headline: "O sistema da sua oficina, do orcamento ao caixa",
    subheadline:
      "Ordens de servico, cadastro de veiculos e clientes, estoque de pecas e controle financeiro.",
  },
};
