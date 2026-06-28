import type { SegmentTemplate } from "./types";

export const lavaRapido: SegmentTemplate = {
  id: "lava-rapido",
  label: "Lava Jato",
  slug: "lava-jato",
  icon: "Waves",
  category: "automotivo",
  tagline: "Agenda por box, planos e fidelidade.",
  modules: ["clients", "scheduling", "services", "financial", "team"],
  terms: {
    customer: "Cliente",
    customer_plural: "Clientes",
    professional: "Lavador",
    professional_plural: "Lavadores",
    service: "Serviço",
    service_plural: "Serviços",
    appointment: "Agendamento",
    appointment_plural: "Agenda",
  },
  customerFields: [
    { key: "veiculo", label: "Veículo", type: "text" },
    { key: "placa", label: "Placa", type: "text" },
  ],
  defaultServices: [
    { name: "Lavagem simples", price: 40, durationMin: 30 },
    { name: "Lavagem completa", price: 80, durationMin: 60 },
    { name: "Plano mensal (4 lavagens)", price: 140, durationMin: 0 },
  ],
  benefits: [
    "Agenda de serviços por box, sem fila",
    "Planos mensais e assinaturas de lavagem",
    "Cadastro de veículos de cada cliente",
    "Pacotes e programa de fidelidade",
    "Caixa diário e relatórios de faturamento",
  ],
  faq: [
    { q: "Consigo trabalhar com planos mensais?", a: "Sim. Você cria planos e pacotes (ex.: 4 lavagens/mês) e acompanha o uso de cada cliente." },
    { q: "Dá para organizar por box?", a: "Sim. A agenda permite distribuir os serviços por box e lavador." },
  ],
  seo: {
    title: "Sistema para Lava Jato | Agenda, planos e fidelidade",
    description:
      "Software para lava jato com agenda por box, planos mensais, assinaturas, veículos, fidelidade e financeiro.",
    keywords: ["sistema para lava jato", "agenda lava jato", "plano mensal lavagem"],
    headline: "O sistema do seu lava jato",
    subheadline: "Agenda por box, planos mensais, fidelidade e controle financeiro.",
  },
};
