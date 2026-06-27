import type { SegmentTemplate } from "./types";

export const estetica: SegmentTemplate = {
  id: "estetica",
  label: "Clinica de Estetica",
  slug: "estetica",
  icon: "Flower2",
  category: "beleza",
  tagline: "Agenda de procedimentos e ficha de avaliacao.",
  modules: ["clients", "scheduling", "services", "financial", "team"],
  terms: {
    customer: "Cliente",
    customer_plural: "Clientes",
    professional: "Esteticista",
    professional_plural: "Esteticistas",
    service: "Procedimento",
    service_plural: "Procedimentos",
    appointment: "Sessao",
    appointment_plural: "Agenda",
  },
  customerFields: [
    { key: "tipo_pele", label: "Tipo de pele", type: "select", options: ["Normal", "Seca", "Oleosa", "Mista"] },
    { key: "objetivo", label: "Objetivo", type: "text", placeholder: "Ex.: tratamento facial" },
  ],
  defaultServices: [
    { name: "Limpeza de pele", price: 120, durationMin: 60 },
    { name: "Drenagem linfatica", price: 100, durationMin: 50 },
    { name: "Peeling", price: 180, durationMin: 45 },
  ],
  benefits: [
    "Agenda de sessoes e pacotes",
    "Ficha de avaliacao por cliente",
    "Controle de pacotes e retornos",
    "Financeiro e relatorios de faturamento",
  ],
  seo: {
    title: "Sistema para Clinica de Estetica | Agenda e procedimentos",
    description:
      "Software para clinica de estetica com agenda de sessoes, ficha de avaliacao, pacotes e financeiro.",
    keywords: ["sistema para estetica", "agenda estetica", "software clinica de estetica"],
    headline: "Gestao completa para a sua clinica de estetica",
    subheadline: "Agenda de sessoes, ficha de avaliacao, pacotes e controle financeiro.",
  },
};

export const tatuagem: SegmentTemplate = {
  id: "tatuagem",
  label: "Studio de Tatuagem",
  slug: "studio-de-tatuagem",
  icon: "Palette",
  category: "beleza",
  tagline: "Agenda de sessoes e orcamentos do seu studio.",
  modules: ["clients", "scheduling", "services", "financial", "team"],
  terms: {
    customer: "Cliente",
    customer_plural: "Clientes",
    professional: "Tatuador",
    professional_plural: "Tatuadores",
    service: "Sessao",
    service_plural: "Sessoes",
    appointment: "Agendamento",
    appointment_plural: "Agenda",
  },
  defaultServices: [
    { name: "Sessao pequena", price: 200, durationMin: 60 },
    { name: "Sessao media", price: 450, durationMin: 120 },
    { name: "Sessao fechamento", price: 800, durationMin: 240 },
  ],
  benefits: [
    "Agenda por tatuador",
    "Controle de sinais e pagamentos",
    "Historico de trabalhos por cliente",
    "Financeiro e comissoes",
  ],
  seo: {
    title: "Sistema para Studio de Tatuagem | Agenda e financeiro",
    description:
      "Software para studio de tatuagem com agenda de sessoes, sinais, clientes e financeiro.",
    keywords: ["sistema para tatuagem", "agenda studio tatuagem", "software tatuador"],
    headline: "O sistema do seu studio de tatuagem",
    subheadline: "Agenda de sessoes, sinais, historico de clientes e controle financeiro.",
  },
};
