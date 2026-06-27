import type { SegmentTemplate } from "./types";

export const estetica: SegmentTemplate = {
  id: "estetica",
  label: "Clínica de Estética",
  slug: "estetica",
  icon: "Flower2",
  category: "beleza",
  tagline: "Agenda de procedimentos e ficha de avaliação.",
  modules: ["clients", "scheduling", "services", "financial", "team"],
  terms: {
    customer: "Cliente",
    customer_plural: "Clientes",
    professional: "Esteticista",
    professional_plural: "Esteticistas",
    service: "Procedimento",
    service_plural: "Procedimentos",
    appointment: "Sessão",
    appointment_plural: "Agenda",
  },
  customerFields: [
    { key: "tipo_pele", label: "Tipo de pele", type: "select", options: ["Normal", "Seca", "Oleosa", "Mista"] },
    { key: "objetivo", label: "Objetivo", type: "text", placeholder: "Ex.: tratamento facial" },
  ],
  defaultServices: [
    { name: "Limpeza de pele", price: 120, durationMin: 60 },
    { name: "Drenagem linfática", price: 100, durationMin: 50 },
    { name: "Peeling", price: 180, durationMin: 45 },
  ],
  benefits: [
    "Agenda de sessões e pacotes com controle de retornos",
    "Ficha de avaliação completa por cliente",
    "Acompanhamento de pacotes e sessões restantes",
    "Financeiro e relatórios de faturamento",
  ],
  faq: [
    { q: "Consigo controlar pacotes de sessões?", a: "Sim. Você acompanha quantas sessões o cliente já usou e quantas faltam em cada pacote." },
    { q: "Tem ficha de avaliação?", a: "Sim. Cada cliente tem uma ficha com tipo de pele, objetivos e histórico de procedimentos." },
  ],
  seo: {
    title: "Sistema para Clínica de Estética | Agenda e procedimentos",
    description:
      "Software para clínica de estética com agenda de sessões, ficha de avaliação, pacotes e financeiro.",
    keywords: ["sistema para estética", "agenda estética", "software clínica de estética"],
    headline: "Gestão completa para a sua clínica de estética",
    subheadline: "Agenda de sessões, ficha de avaliação, pacotes e controle financeiro.",
  },
};

export const tatuagem: SegmentTemplate = {
  id: "tatuagem",
  label: "Studio de Tatuagem",
  slug: "studio-de-tatuagem",
  icon: "Palette",
  category: "beleza",
  tagline: "Agenda de sessões e orçamentos do seu studio.",
  modules: ["clients", "scheduling", "services", "financial", "team"],
  terms: {
    customer: "Cliente",
    customer_plural: "Clientes",
    professional: "Tatuador",
    professional_plural: "Tatuadores",
    service: "Sessão",
    service_plural: "Sessões",
    appointment: "Agendamento",
    appointment_plural: "Agenda",
  },
  defaultServices: [
    { name: "Sessão pequena", price: 200, durationMin: 60 },
    { name: "Sessão média", price: 450, durationMin: 120 },
    { name: "Sessão fechamento", price: 800, durationMin: 240 },
  ],
  benefits: [
    "Agenda por tatuador com bloqueio de horários longos",
    "Controle de sinais e pagamentos por sessão",
    "Histórico de trabalhos por cliente",
    "Financeiro e comissões da equipe",
  ],
  faq: [
    { q: "Consigo registrar o sinal do cliente?", a: "Sim. Você registra o sinal pago e o valor restante de cada sessão no financeiro." },
    { q: "Dá para ter mais de um tatuador?", a: "Sim. Cada tatuador tem a própria agenda e o controle de comissão por trabalho." },
  ],
  seo: {
    title: "Sistema para Studio de Tatuagem | Agenda e financeiro",
    description:
      "Software para studio de tatuagem com agenda de sessões, sinais, clientes e financeiro.",
    keywords: ["sistema para tatuagem", "agenda studio tatuagem", "software tatuador"],
    headline: "O sistema do seu studio de tatuagem",
    subheadline: "Agenda de sessões, sinais, histórico de clientes e controle financeiro.",
  },
};
