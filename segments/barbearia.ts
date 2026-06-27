import type { SegmentTemplate } from "./types";

export const barbearia: SegmentTemplate = {
  id: "barbearia",
  label: "Barbearia",
  slug: "barbearia",
  icon: "Scissors",
  category: "beleza",
  tagline: "Agenda, clientes e caixa da sua barbearia em um só lugar.",
  modules: ["clients", "scheduling", "services", "financial", "team"],
  terms: {
    customer: "Cliente",
    customer_plural: "Clientes",
    professional: "Barbeiro",
    professional_plural: "Barbeiros",
    service: "Serviço",
    service_plural: "Serviços",
    appointment: "Agendamento",
    appointment_plural: "Agenda",
  },
  customerFields: [
    { key: "preferencia_corte", label: "Preferência de corte", type: "text", placeholder: "Ex.: máquina 2, tesoura" },
  ],
  defaultServices: [
    { name: "Corte", price: 40, durationMin: 30 },
    { name: "Barba", price: 30, durationMin: 20 },
    { name: "Corte + Barba", price: 60, durationMin: 45 },
  ],
  benefits: [
    "Agenda online por barbeiro que reduz faltas com lembretes",
    "Histórico de cortes e preferências de cada cliente",
    "Controle de comissão por barbeiro de forma automática",
    "Caixa diário e relatório de faturamento em tempo real",
  ],
  faq: [
    { q: "Consigo controlar a comissão de cada barbeiro?", a: "Sim. Cada profissional tem os atendimentos registrados, o que facilita o cálculo da comissão no fim do dia ou do mês." },
    { q: "Meus clientes conseguem agendar sozinhos?", a: "O agendamento interno já está pronto. O link público de autoagendamento está disponível a partir do plano Profissional." },
  ],
  seo: {
    title: "Sistema para Barbearia | Agenda online e gestão completa",
    description:
      "Software para barbearia com agenda online, controle de clientes, serviços, comissões e financeiro. Planos a partir de R$ 39,90/mês.",
    keywords: ["sistema para barbearia", "agenda barbearia", "software barbearia", "app barbearia"],
    headline: "O sistema completo para a sua barbearia",
    subheadline:
      "Agenda online, cadastro de clientes, controle de serviços e caixa. Tudo pensado para barbearias.",
  },
};
