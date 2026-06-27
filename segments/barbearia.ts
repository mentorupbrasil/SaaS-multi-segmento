import type { SegmentTemplate } from "./types";

export const barbearia: SegmentTemplate = {
  id: "barbearia",
  label: "Barbearia",
  slug: "barbearia",
  icon: "Scissors",
  tagline: "Agenda, clientes e caixa da sua barbearia em um so lugar.",
  modules: ["clients", "scheduling", "services", "financial", "team"],
  terms: {
    customer: "Cliente",
    customer_plural: "Clientes",
    professional: "Barbeiro",
    professional_plural: "Barbeiros",
    service: "Servico",
    service_plural: "Servicos",
    appointment: "Agendamento",
    appointment_plural: "Agenda",
  },
  customerFields: [
    { key: "preferencia_corte", label: "Preferencia de corte", type: "text", placeholder: "Ex.: maquina 2, tesoura" },
  ],
  defaultServices: [
    { name: "Corte", price: 40, durationMin: 30 },
    { name: "Barba", price: 30, durationMin: 20 },
    { name: "Corte + Barba", price: 60, durationMin: 45 },
  ],
  seo: {
    title: "Sistema para Barbearia | Agenda online e gestao completa",
    description:
      "Software para barbearia com agenda online, controle de clientes, servicos, comissoes e financeiro. Teste gratis.",
    keywords: ["sistema para barbearia", "agenda barbearia", "software barbearia", "app barbearia"],
    headline: "O sistema completo para a sua barbearia",
    subheadline:
      "Agenda online, cadastro de clientes, controle de servicos e caixa. Tudo pensado para barbearias.",
  },
};
