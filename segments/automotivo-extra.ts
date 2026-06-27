import type { SegmentTemplate } from "./types";

export const lavaRapido: SegmentTemplate = {
  id: "lava-rapido",
  label: "Lava-rápido / Estética Automotiva",
  slug: "lava-rapido",
  icon: "Car",
  category: "automotivo",
  tagline: "Agenda de serviços e controle de veículos.",
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
    { key: "veiculo", label: "Veículo", type: "text" },
    { key: "placa", label: "Placa", type: "text" },
  ],
  defaultServices: [
    { name: "Lavagem simples", price: 40, durationMin: 30 },
    { name: "Lavagem completa", price: 80, durationMin: 60 },
    { name: "Polimento", price: 250, durationMin: 180 },
  ],
  benefits: [
    "Agenda de serviços por box, sem fila",
    "Cadastro de veículos de cada cliente",
    "Pacotes e programa de fidelidade",
    "Caixa diário e relatórios de faturamento",
  ],
  faq: [
    { q: "Consigo trabalhar com pacotes de lavagem?", a: "Sim. Você cria pacotes (ex.: 4 lavagens) e acompanha o uso de cada cliente." },
    { q: "Dá para organizar por box?", a: "Sim. A agenda permite distribuir os serviços por box e profissional." },
  ],
  seo: {
    title: "Sistema para Lava-rápido e Estética Automotiva",
    description:
      "Software para lava-rápido e estética automotiva com agenda, veículos, pacotes e financeiro.",
    keywords: ["sistema para lava rápido", "software estética automotiva", "agenda lava rápido"],
    headline: "O sistema do seu lava-rápido",
    subheadline: "Agenda de serviços, veículos, pacotes de fidelidade e controle financeiro.",
  },
};
