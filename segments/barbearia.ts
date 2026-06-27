import type { SegmentTemplate } from "./types";

export const barbearia: SegmentTemplate = {
  id: "barbearia",
  label: "Barbearia",
  slug: "barbearia",
  icon: "Scissors",
  category: "beleza",
  tagline: "Agenda, clientes e caixa da sua barbearia em um só lugar.",
  modules: ["clients", "scheduling", "services", "financial", "team", "inventory"],
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
    { key: "data_nascimento", label: "Data de nascimento", type: "date" },
    { key: "preferencia_corte", label: "Preferência de corte", type: "text", placeholder: "Ex.: máquina 2, tesoura" },
  ],
  defaultServices: [
    { name: "Corte", price: 40, durationMin: 30 },
    { name: "Barba", price: 30, durationMin: 20 },
    { name: "Corte + Barba", price: 60, durationMin: 45 },
    { name: "Pezinho", price: 20, durationMin: 15 },
    { name: "Sobrancelha", price: 15, durationMin: 10 },
  ],
  benefits: [
    "Agenda online por barbeiro com confirmação automática que reduz faltas",
    "Histórico de cortes, fotos e preferências de cada cliente",
    "Comissão por barbeiro calculada automaticamente",
    "Venda de pomadas e produtos com baixa no estoque",
    "Caixa diário e relatório de faturamento em tempo real",
  ],
  faq: [
    { q: "Consigo controlar a comissão de cada barbeiro?", a: "Sim. Cada atendimento fica vinculado ao barbeiro, com cálculo automático de comissão por serviço e por produto vendido." },
    { q: "Meus clientes conseguem agendar sozinhos?", a: "O agendamento interno já está pronto. O link público de autoagendamento está disponível a partir do plano Profissional." },
    { q: "Dá para vender produtos (pomada, óleo)?", a: "Sim. Você cadastra os produtos, vende no caixa e o estoque baixa automaticamente." },
  ],
  seo: {
    title: "Sistema para Barbearia | Agenda online e gestão completa",
    description:
      "Software para barbearia com agenda online, controle de clientes, serviços, comissões, estoque e financeiro. Planos a partir de R$ 39,90/mês.",
    keywords: ["sistema para barbearia", "agenda barbearia", "software barbearia", "app barbearia"],
    headline: "O sistema completo para a sua barbearia",
    subheadline:
      "Agenda online, cadastro de clientes, comissão por barbeiro, venda de produtos e caixa. Tudo pensado para barbearias.",
  },
};
