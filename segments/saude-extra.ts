import type { SegmentTemplate } from "./types";

export const odontologia: SegmentTemplate = {
  id: "odontologia",
  label: "Consultorio Odontologico",
  slug: "odontologia",
  icon: "Smile",
  category: "saude",
  tagline: "Agenda, prontuario odontologico e financeiro.",
  modules: ["clients", "scheduling", "services", "records", "financial", "team"],
  terms: {
    customer: "Paciente",
    customer_plural: "Pacientes",
    professional: "Dentista",
    professional_plural: "Dentistas",
    service: "Procedimento",
    service_plural: "Procedimentos",
    appointment: "Consulta",
    appointment_plural: "Consultas",
    records: "Prontuario",
  },
  customerFields: [
    { key: "data_nascimento", label: "Data de nascimento", type: "date" },
    { key: "convenio", label: "Convenio", type: "text" },
  ],
  defaultServices: [
    { name: "Avaliacao", price: 0, durationMin: 30 },
    { name: "Limpeza", price: 150, durationMin: 40 },
    { name: "Restauracao", price: 250, durationMin: 60 },
  ],
  benefits: [
    "Agenda de consultas por dentista",
    "Prontuario odontologico do paciente",
    "Controle de convenios",
    "Financeiro e planos de tratamento",
  ],
  seo: {
    title: "Sistema para Consultorio Odontologico | Agenda e prontuario",
    description:
      "Software para dentistas com agenda, prontuario odontologico, convenios e financeiro. Teste gratis.",
    keywords: ["sistema para dentista", "software odontologico", "prontuario odontologico"],
    headline: "Gestao completa para o seu consultorio odontologico",
    subheadline: "Agenda, prontuario, convenios e financeiro em uma so plataforma.",
  },
};

export const psicologia: SegmentTemplate = {
  id: "psicologia",
  label: "Psicologo / Terapeuta",
  slug: "psicologia",
  icon: "Brain",
  category: "saude",
  tagline: "Agenda de sessoes e evolucao do paciente.",
  modules: ["clients", "scheduling", "services", "records", "financial"],
  terms: {
    customer: "Paciente",
    customer_plural: "Pacientes",
    professional: "Psicologo",
    professional_plural: "Psicologos",
    service: "Sessao",
    service_plural: "Sessoes",
    appointment: "Sessao",
    appointment_plural: "Agenda",
    records: "Evolucao",
  },
  defaultServices: [
    { name: "Sessao individual", price: 150, durationMin: 50 },
    { name: "Sessao casal", price: 220, durationMin: 60 },
  ],
  benefits: [
    "Agenda de sessoes com lembretes",
    "Registro de evolucao sigiloso",
    "Controle de pacotes e recorrencia",
    "Financeiro simples e organizado",
  ],
  seo: {
    title: "Sistema para Psicologos | Agenda e evolucao do paciente",
    description:
      "Software para psicologos e terapeutas com agenda de sessoes, registro de evolucao e financeiro.",
    keywords: ["sistema para psicologo", "agenda psicologia", "software terapeuta"],
    headline: "O sistema do seu consultorio de psicologia",
    subheadline: "Agenda de sessoes, registro de evolucao e controle financeiro com sigilo.",
  },
};

export const personal: SegmentTemplate = {
  id: "personal",
  label: "Personal Trainer",
  slug: "personal-trainer",
  icon: "Activity",
  category: "saude",
  tagline: "Agenda de treinos e acompanhamento de alunos.",
  modules: ["clients", "scheduling", "services", "financial"],
  terms: {
    customer: "Aluno",
    customer_plural: "Alunos",
    professional: "Personal",
    professional_plural: "Personais",
    service: "Plano",
    service_plural: "Planos",
    appointment: "Treino",
    appointment_plural: "Agenda",
  },
  defaultServices: [
    { name: "Aula avulsa", price: 80, durationMin: 60 },
    { name: "Plano mensal 3x", price: 400, durationMin: 60 },
  ],
  benefits: [
    "Agenda de treinos por aluno",
    "Controle de planos e mensalidades",
    "Acompanhamento de evolucao",
    "Financeiro com cobrancas recorrentes",
  ],
  seo: {
    title: "Sistema para Personal Trainer | Agenda e alunos",
    description:
      "Software para personal trainer com agenda de treinos, planos, alunos e financeiro.",
    keywords: ["sistema para personal trainer", "agenda personal", "app personal trainer"],
    headline: "O sistema do personal trainer moderno",
    subheadline: "Agenda de treinos, planos, alunos e controle financeiro.",
  },
};

export const academia: SegmentTemplate = {
  id: "academia",
  label: "Academia",
  slug: "academia",
  icon: "Dumbbell",
  category: "saude",
  tagline: "Alunos, mensalidades e presenca.",
  modules: ["clients", "scheduling", "services", "financial", "team"],
  terms: {
    customer: "Aluno",
    customer_plural: "Alunos",
    professional: "Instrutor",
    professional_plural: "Instrutores",
    service: "Plano",
    service_plural: "Planos",
    appointment: "Aula",
    appointment_plural: "Aulas",
  },
  defaultServices: [
    { name: "Plano mensal", price: 99, durationMin: 0 },
    { name: "Plano trimestral", price: 270, durationMin: 0 },
    { name: "Plano anual", price: 899, durationMin: 0 },
  ],
  benefits: [
    "Cadastro de alunos e planos",
    "Controle de mensalidades e inadimplencia",
    "Grade de aulas e instrutores",
    "Relatorios de faturamento",
  ],
  seo: {
    title: "Sistema para Academia | Alunos, mensalidades e aulas",
    description:
      "Software para academia com cadastro de alunos, planos, mensalidades, aulas e financeiro.",
    keywords: ["sistema para academia", "software academia", "gestao de academia"],
    headline: "Gestao completa para a sua academia",
    subheadline: "Alunos, planos, mensalidades, grade de aulas e financeiro.",
  },
};
