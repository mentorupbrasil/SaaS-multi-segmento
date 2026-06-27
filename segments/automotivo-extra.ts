import type { SegmentTemplate } from "./types";

export const lavaRapido: SegmentTemplate = {
  id: "lava-rapido",
  label: "Lava-rapido / Estetica Automotiva",
  slug: "lava-rapido",
  icon: "Car",
  category: "automotivo",
  tagline: "Agenda de servicos e controle de veiculos.",
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
    { key: "veiculo", label: "Veiculo", type: "text" },
    { key: "placa", label: "Placa", type: "text" },
  ],
  defaultServices: [
    { name: "Lavagem simples", price: 40, durationMin: 30 },
    { name: "Lavagem completa", price: 80, durationMin: 60 },
    { name: "Polimento", price: 250, durationMin: 180 },
  ],
  benefits: [
    "Agenda de servicos por box",
    "Cadastro de veiculos do cliente",
    "Pacotes e fidelidade",
    "Caixa e relatorios",
  ],
  seo: {
    title: "Sistema para Lava-rapido e Estetica Automotiva",
    description:
      "Software para lava-rapido e estetica automotiva com agenda, veiculos, pacotes e financeiro.",
    keywords: ["sistema para lava rapido", "software estetica automotiva", "agenda lava rapido"],
    headline: "O sistema do seu lava-rapido",
    subheadline: "Agenda de servicos, veiculos, pacotes de fidelidade e controle financeiro.",
  },
};
