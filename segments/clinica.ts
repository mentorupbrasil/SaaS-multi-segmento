import type { SegmentTemplate } from "./types";

export const clinica: SegmentTemplate = {
  id: "clinica",
  label: "Clínica",
  slug: "clinica",
  icon: "Stethoscope",
  category: "saude",
  tagline: "Agenda, prontuário e financeiro para a sua clínica.",
  modules: ["clients", "scheduling", "services", "records", "financial", "team"],
  terms: {
    customer: "Paciente",
    customer_plural: "Pacientes",
    professional: "Profissional",
    professional_plural: "Profissionais",
    service: "Procedimento",
    service_plural: "Procedimentos",
    appointment: "Consulta",
    appointment_plural: "Consultas",
    records: "Prontuário",
  },
  customerFields: [
    { key: "data_nascimento", label: "Data de nascimento", type: "date" },
    { key: "convenio", label: "Convênio", type: "text", placeholder: "Ex.: Unimed" },
    { key: "cpf", label: "CPF", type: "text" },
  ],
  defaultServices: [
    { name: "Consulta", price: 250, durationMin: 30 },
    { name: "Retorno", price: 0, durationMin: 20 },
    { name: "Avaliação", price: 180, durationMin: 40 },
  ],
  benefits: [
    "Agenda de consultas por profissional, com confirmação",
    "Prontuário do paciente com histórico completo",
    "Controle de convênios e atendimentos particulares",
    "Financeiro com contas a pagar e a receber",
  ],
  faq: [
    { q: "O prontuário fica seguro?", a: "Sim. O acesso é restrito por usuário e cada paciente tem o histórico de consultas e anotações organizado." },
    { q: "Consigo separar convênio de particular?", a: "Sim. Você registra o convênio de cada paciente e acompanha o faturamento separadamente." },
  ],
  seo: {
    title: "Sistema para Clínica | Agenda, prontuário e financeiro",
    description:
      "Software para clínicas com agenda de consultas, prontuário eletrônico, convênios e financeiro. Assine e comece hoje.",
    keywords: ["sistema para clínica", "agenda médica", "prontuário eletrônico", "software clínica"],
    headline: "Gestão completa para a sua clínica",
    subheadline:
      "Agenda de consultas, prontuário do paciente, convênios e controle financeiro em uma plataforma.",
  },
};
