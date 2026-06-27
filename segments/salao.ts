import type { SegmentTemplate } from "./types";

export const salao: SegmentTemplate = {
  id: "salao",
  label: "Salão de Beleza",
  slug: "salao-de-beleza",
  icon: "Sparkles",
  category: "beleza",
  tagline: "Gestão completa para o seu salão de beleza.",
  modules: ["clients", "scheduling", "services", "financial", "team", "inventory"],
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
    { key: "data_nascimento", label: "Data de nascimento", type: "date" },
    { key: "tipo_cabelo", label: "Tipo de cabelo", type: "select", options: ["Liso", "Ondulado", "Cacheado", "Crespo"] },
    { key: "alergias", label: "Alergias", type: "text", placeholder: "Ex.: amônia" },
  ],
  defaultServices: [
    { name: "Corte feminino", price: 70, durationMin: 60 },
    { name: "Escova", price: 50, durationMin: 45 },
    { name: "Manicure", price: 35, durationMin: 40 },
    { name: "Pedicure", price: 40, durationMin: 45 },
    { name: "Coloração", price: 150, durationMin: 120 },
    { name: "Hidratação", price: 80, durationMin: 60 },
  ],
  benefits: [
    "Agenda por profissional e por cabine, sem choque de horários",
    "Ficha técnica com tipo de cabelo, alergias e fotos antes/depois",
    "Comissão da equipe por serviço e por produto, sem planilha",
    "Estoque de produtos com baixa por atendimento",
    "Relatórios de faturamento, ticket médio e serviços mais vendidos",
  ],
  faq: [
    { q: "Cada profissional tem a própria agenda?", a: "Sim. Você vê a agenda por profissional ou a agenda geral do salão, evitando horários duplicados." },
    { q: "Consigo controlar comissões e metas?", a: "Sim. Defina a comissão por serviço e por produto de cada profissional e acompanhe metas e ranking." },
    { q: "Consigo saber quais serviços mais vendem?", a: "Sim. Os relatórios mostram os serviços mais procurados, o ticket médio e o faturamento de cada um." },
  ],
  seo: {
    title: "Sistema para Salão de Beleza | Agenda, comissão e estoque",
    description:
      "Software para salão de beleza com agenda online, clientes, comissões, estoque, vendas e financeiro. Assine e comece hoje.",
    keywords: ["sistema para salão de beleza", "agenda salão", "software salão", "app salão de beleza"],
    headline: "Tudo que o seu salão precisa em um sistema",
    subheadline:
      "Agenda online, ficha de clientes, comissões, estoque, vendas e caixa em um único lugar.",
  },
};
