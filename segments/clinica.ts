import type { SegmentTemplate } from "./types";

export const clinica: SegmentTemplate = {
  id: "clinica",
  label: "Clinica",
  slug: "clinica",
  icon: "Stethoscope",
  tagline: "Agenda, prontuario e financeiro para a sua clinica.",
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
    records: "Prontuario",
  },
  customerFields: [
    { key: "data_nascimento", label: "Data de nascimento", type: "date" },
    { key: "convenio", label: "Convenio", type: "text", placeholder: "Ex.: Unimed" },
    { key: "cpf", label: "CPF", type: "text" },
  ],
  defaultServices: [
    { name: "Consulta", price: 250, durationMin: 30 },
    { name: "Retorno", price: 0, durationMin: 20 },
    { name: "Avaliacao", price: 180, durationMin: 40 },
  ],
  seo: {
    title: "Sistema para Clinica | Agenda, prontuario e financeiro",
    description:
      "Software para clinicas com agenda de consultas, prontuario eletronico, convenios e financeiro. Teste gratis.",
    keywords: ["sistema para clinica", "agenda medica", "prontuario eletronico", "software clinica"],
    headline: "Gestao completa para a sua clinica",
    subheadline:
      "Agenda de consultas, prontuario do paciente, convenios e controle financeiro em uma plataforma.",
  },
};
