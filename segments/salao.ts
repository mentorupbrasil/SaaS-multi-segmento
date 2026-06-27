import type { SegmentTemplate } from "./types";

export const salao: SegmentTemplate = {
  id: "salao",
  label: "Salao de Beleza",
  slug: "salao-de-beleza",
  icon: "Sparkles",
  tagline: "Gestao completa para o seu salao de beleza.",
  modules: ["clients", "scheduling", "services", "financial", "team"],
  terms: {
    customer: "Cliente",
    customer_plural: "Clientes",
    professional: "Profissional",
    professional_plural: "Profissionais",
    service: "Servico",
    service_plural: "Servicos",
    appointment: "Agendamento",
    appointment_plural: "Agenda",
  },
  customerFields: [
    { key: "tipo_cabelo", label: "Tipo de cabelo", type: "select", options: ["Liso", "Ondulado", "Cacheado", "Crespo"] },
    { key: "alergias", label: "Alergias", type: "text", placeholder: "Ex.: amonia" },
  ],
  defaultServices: [
    { name: "Corte feminino", price: 70, durationMin: 60 },
    { name: "Escova", price: 50, durationMin: 45 },
    { name: "Manicure", price: 35, durationMin: 40 },
    { name: "Coloracao", price: 150, durationMin: 120 },
  ],
  seo: {
    title: "Sistema para Salao de Beleza | Agenda e gestao",
    description:
      "Software para salao de beleza com agenda online, clientes, servicos, comissoes e financeiro. Experimente.",
    keywords: ["sistema para salao de beleza", "agenda salao", "software salao", "app salao de beleza"],
    headline: "Tudo que o seu salao precisa em um sistema",
    subheadline:
      "Agenda online, ficha de clientes, controle de servicos, comissoes e caixa em um unico lugar.",
  },
};
