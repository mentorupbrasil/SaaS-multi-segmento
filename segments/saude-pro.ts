import type { SegmentTemplate } from "./types";

// Sub-nichos adicionais de Saude & Bem-estar.

export const consultorioMedico: SegmentTemplate = {
  id: "consultorio-medico",
  label: "Consultório Médico",
  slug: "consultorio-medico",
  icon: "HeartPulse",
  category: "saude",
  tagline: "Agenda, prontuário e teleconsulta.",
  modules: ["clients", "scheduling", "services", "records", "financial", "team"],
  terms: {
    customer: "Paciente",
    customer_plural: "Pacientes",
    professional: "Médico",
    professional_plural: "Médicos",
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
    { name: "Consulta", price: 300, durationMin: 30 },
    { name: "Retorno", price: 0, durationMin: 20 },
    { name: "Teleconsulta", price: 250, durationMin: 30 },
  ],
  benefits: [
    "Agenda de consultas com confirmação automática",
    "Prontuário eletrônico com histórico, prescrições e exames",
    "Convênios e atendimentos particulares organizados",
    "Receitas, atestados e documentos com assinatura eletrônica",
    "Teleconsulta integrada à agenda",
  ],
  faq: [
    { q: "Tenho prontuário eletrônico?", a: "Sim. Cada paciente tem evolução, prescrições, exames e anexos, com acesso restrito por usuário." },
    { q: "Emito receitas e atestados?", a: "Sim. Você gera receitas, atestados e declarações a partir do atendimento (assinatura eletrônica a caminho)." },
  ],
  seo: {
    title: "Sistema para Consultório Médico | Prontuário e agenda",
    description:
      "Software para consultório médico com agenda, prontuário eletrônico, convênios, teleconsulta e financeiro.",
    keywords: ["sistema para consultório médico", "prontuário eletrônico", "agenda médica", "telemedicina"],
    headline: "Gestão completa do seu consultório médico",
    subheadline: "Agenda, prontuário eletrônico, convênios, teleconsulta e financeiro em um só lugar.",
  },
};

export const fisioterapia: SegmentTemplate = {
  id: "fisioterapia",
  label: "Fisioterapia",
  slug: "fisioterapia",
  icon: "PersonStanding",
  category: "saude",
  tagline: "Sessões, evolução e plano terapêutico.",
  modules: ["clients", "scheduling", "services", "records", "financial", "team"],
  terms: {
    customer: "Paciente",
    customer_plural: "Pacientes",
    professional: "Fisioterapeuta",
    professional_plural: "Fisioterapeutas",
    service: "Sessão",
    service_plural: "Sessões",
    appointment: "Sessão",
    appointment_plural: "Agenda",
    records: "Evolução",
  },
  customerFields: [
    { key: "data_nascimento", label: "Data de nascimento", type: "date" },
    { key: "convenio", label: "Convênio", type: "text" },
    { key: "queixa", label: "Queixa principal", type: "text" },
  ],
  defaultServices: [
    { name: "Avaliação", price: 180, durationMin: 50 },
    { name: "Sessão", price: 120, durationMin: 50 },
    { name: "Pacote 10 sessões", price: 1000, durationMin: 50 },
  ],
  benefits: [
    "Agenda de sessões com confirmação e recorrência",
    "Plano terapêutico e evolução por sessão",
    "Pacotes de sessões com controle de vencimento",
    "Escalas de avaliação e exercícios",
    "Financeiro com convênios e particulares",
  ],
  faq: [
    { q: "Controlo pacotes de sessões?", a: "Sim. Você cadastra pacotes, acompanha as sessões realizadas e o que falta para cada paciente." },
    { q: "Registro a evolução do tratamento?", a: "Sim. Cada sessão tem a evolução do paciente, com o plano terapêutico organizado." },
  ],
  seo: {
    title: "Sistema para Fisioterapia | Sessões, evolução e financeiro",
    description:
      "Software para fisioterapeutas e clínicas de fisioterapia com agenda, plano terapêutico, evolução, pacotes e financeiro.",
    keywords: ["sistema para fisioterapia", "evolução fisioterapia", "agenda fisioterapeuta"],
    headline: "O sistema da sua clínica de fisioterapia",
    subheadline: "Agenda de sessões, plano terapêutico, evolução e financeiro em um só lugar.",
  },
};

export const nutricionista: SegmentTemplate = {
  id: "nutricionista",
  label: "Nutricionista",
  slug: "nutricionista",
  icon: "Apple",
  category: "saude",
  tagline: "Consultas, avaliação e plano alimentar.",
  modules: ["clients", "scheduling", "services", "records", "financial"],
  terms: {
    customer: "Paciente",
    customer_plural: "Pacientes",
    professional: "Nutricionista",
    professional_plural: "Nutricionistas",
    service: "Consulta",
    service_plural: "Consultas",
    appointment: "Consulta",
    appointment_plural: "Agenda",
    records: "Evolução",
  },
  customerFields: [
    { key: "data_nascimento", label: "Data de nascimento", type: "date" },
    { key: "objetivo", label: "Objetivo", type: "text", placeholder: "Ex.: emagrecimento" },
    { key: "restricoes", label: "Restrições alimentares", type: "text" },
  ],
  defaultServices: [
    { name: "Primeira consulta", price: 250, durationMin: 60 },
    { name: "Retorno", price: 150, durationMin: 40 },
    { name: "Plano alimentar", price: 200, durationMin: 0 },
  ],
  benefits: [
    "Agenda de consultas com lembretes",
    "Avaliação antropométrica e evolução corporal",
    "Plano alimentar e diário alimentar do paciente",
    "Acompanhamento de objetivos ao longo do tempo",
    "Financeiro com pacotes e cobrança recorrente",
  ],
  faq: [
    { q: "Registro a avaliação antropométrica?", a: "Sim. Você acompanha medidas e a evolução corporal de cada paciente entre as consultas." },
    { q: "Tem plano alimentar?", a: "Sim. Você organiza o plano alimentar e o histórico de cada paciente no prontuário." },
  ],
  seo: {
    title: "Sistema para Nutricionista | Avaliação e plano alimentar",
    description:
      "Software para nutricionistas com agenda, avaliação antropométrica, evolução, plano alimentar e financeiro.",
    keywords: ["sistema para nutricionista", "plano alimentar", "avaliação antropométrica"],
    headline: "O sistema do consultório de nutrição",
    subheadline: "Agenda, avaliação, evolução corporal, plano alimentar e financeiro.",
  },
};

export const terapeuta: SegmentTemplate = {
  id: "terapeuta",
  label: "Terapeuta",
  slug: "terapeuta",
  icon: "HandHeart",
  category: "saude",
  tagline: "Sessões, evolução e pacotes.",
  modules: ["clients", "scheduling", "services", "records", "financial"],
  terms: {
    customer: "Cliente",
    customer_plural: "Clientes",
    professional: "Terapeuta",
    professional_plural: "Terapeutas",
    service: "Sessão",
    service_plural: "Sessões",
    appointment: "Sessão",
    appointment_plural: "Agenda",
    records: "Evolução",
  },
  customerFields: [
    { key: "data_nascimento", label: "Data de nascimento", type: "date" },
    { key: "objetivo", label: "Objetivo do acompanhamento", type: "text" },
  ],
  defaultServices: [
    { name: "Sessão individual", price: 140, durationMin: 60 },
    { name: "Pacote 4 sessões", price: 500, durationMin: 60 },
    { name: "Avaliação inicial", price: 120, durationMin: 50 },
  ],
  benefits: [
    "Agenda de sessões com recorrência e lembretes",
    "Registro de evolução sigiloso por sessão",
    "Pacotes de sessões com controle de vencimento",
    "Financeiro simples e organizado",
    "Comunicação com o cliente por WhatsApp — a caminho",
  ],
  faq: [
    { q: "As anotações ficam sigilosas?", a: "Sim. A evolução fica protegida e acessível apenas ao profissional responsável." },
    { q: "Atende sessões recorrentes?", a: "Sim. Você define a recorrência e o sistema mantém os horários reservados." },
  ],
  seo: {
    title: "Sistema para Terapeuta | Agenda, sessões e evolução",
    description:
      "Software para terapeutas (ocupacional, integrativo e similares) com agenda, evolução, pacotes de sessões e financeiro.",
    keywords: ["sistema para terapeuta", "agenda terapia", "evolução terapêutica"],
    headline: "O sistema do seu consultório de terapia",
    subheadline: "Agenda de sessões, evolução, pacotes e controle financeiro com sigilo.",
  },
};
