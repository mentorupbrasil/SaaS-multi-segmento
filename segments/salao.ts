import type { SegmentTemplate } from "./types";

export const salao: SegmentTemplate = {
  id: "salao",
  label: "Salão de Beleza",
  slug: "salao-de-beleza",
  icon: "Sparkles",
  category: "beleza",
  tagline: "Gestão completa para o seu salão de beleza.",
  modules: ["clients", "scheduling", "services", "financial", "team"],
  terms: {
    customer: "Cliente",
    customer_plural: "Clientes",
    professional: "Profissional",
    professional_plural: "Profissionais",
    service: "Serviço",
    service_plural: "Serviços",
    appointment: "Agendamento",
    appointment_plural: "Agenda",
  },
  customerFields: [
    { key: "tipo_cabelo", label: "Tipo de cabelo", type: "select", options: ["Liso", "Ondulado", "Cacheado", "Crespo"] },
    { key: "alergias", label: "Alergias", type: "text", placeholder: "Ex.: amônia" },
  ],
  defaultServices: [
    { name: "Corte feminino", price: 70, durationMin: 60 },
    { name: "Escova", price: 50, durationMin: 45 },
    { name: "Manicure", price: 35, durationMin: 40 },
    { name: "Coloração", price: 150, durationMin: 120 },
  ],
  benefits: [
    "Agenda por profissional e por serviço, sem choque de horários",
    "Ficha técnica com tipo de cabelo, alergias e histórico",
    "Controle de comissões da equipe sem planilha",
    "Relatórios de faturamento e serviços mais vendidos",
  ],
  faq: [
    { q: "Cada profissional tem a própria agenda?", a: "Sim. Você vê a agenda por profissional ou a agenda geral do salão, evitando horários duplicados." },
    { q: "Consigo saber quais serviços mais vendem?", a: "Sim. Os relatórios mostram os serviços mais procurados e o faturamento de cada um." },
  ],
  seo: {
    title: "Sistema para Salão de Beleza | Agenda e gestão",
    description:
      "Software para salão de beleza com agenda online, clientes, serviços, comissões e financeiro. Assine e comece hoje.",
    keywords: ["sistema para salão de beleza", "agenda salão", "software salão", "app salão de beleza"],
    headline: "Tudo que o seu salão precisa em um sistema",
    subheadline:
      "Agenda online, ficha de clientes, controle de serviços, comissões e caixa em um único lugar.",
  },
};
