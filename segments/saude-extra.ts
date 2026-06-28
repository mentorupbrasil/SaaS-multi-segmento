import type { SegmentTemplate } from "./types";

export const odontologia: SegmentTemplate = {
  id: "odontologia",
  label: "Odontologia",
  slug: "odontologia",
  icon: "Smile",
  category: "saude",
  tagline: "Agenda, prontuário odontológico e financeiro.",
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
    records: "Prontuário",
  },
  customerFields: [
    { key: "data_nascimento", label: "Data de nascimento", type: "date" },
    { key: "convenio", label: "Convênio", type: "text" },
  ],
  specialties: [
    { id: "clinica-geral", label: "Clínica geral" },
    { id: "ortodontia", label: "Ortodontia" },
    { id: "implantes", label: "Implantes" },
    { id: "estetica-dental", label: "Estética dental" },
  ],
  defaultServices: [
    { name: "Avaliação", price: 0, durationMin: 30 },
    { name: "Limpeza", price: 150, durationMin: 40 },
    { name: "Restauração", price: 250, durationMin: 60 },
  ],
  benefits: [
    "Agenda de consultas por dentista, com lembretes",
    "Prontuário odontológico do paciente",
    "Controle de convênios e planos de tratamento",
    "Financeiro com parcelamento de tratamentos",
  ],
  faq: [
    { q: "Consigo registrar o plano de tratamento?", a: "Sim. Você organiza os procedimentos do paciente e acompanha o que já foi realizado e o que falta." },
    { q: "Dá para parcelar tratamentos no financeiro?", a: "Sim. Você lança o tratamento e acompanha as parcelas a receber de cada paciente." },
  ],
  seo: {
    title: "Sistema para Consultório Odontológico | Agenda e prontuário",
    description:
      "Software para dentistas com agenda, prontuário odontológico, convênios e financeiro. Assine e comece hoje.",
    keywords: ["sistema para dentista", "software odontológico", "prontuário odontológico"],
    headline: "Gestão completa para o seu consultório odontológico",
    subheadline: "Agenda, prontuário, convênios e financeiro em uma só plataforma.",
  },
};

export const psicologia: SegmentTemplate = {
  id: "psicologia",
  label: "Psicologia",
  slug: "psicologia",
  icon: "Brain",
  category: "saude",
  tagline: "Agenda de sessões e evolução do paciente.",
  modules: ["clients", "scheduling", "services", "records", "financial"],
  terms: {
    customer: "Paciente",
    customer_plural: "Pacientes",
    professional: "Psicólogo",
    professional_plural: "Psicólogos",
    service: "Sessão",
    service_plural: "Sessões",
    appointment: "Sessão",
    appointment_plural: "Agenda",
    records: "Evolução",
  },
  customerFields: [
    { key: "convenio", label: "Convênio / plano", type: "text" },
    { key: "contato_emergencia", label: "Contato de emergência", type: "text" },
  ],
  defaultServices: [
    { name: "Sessão individual", price: 150, durationMin: 50 },
    { name: "Sessão casal", price: 220, durationMin: 60 },
  ],
  benefits: [
    "Agenda de sessões com lembretes automáticos",
    "Registro de evolução sigiloso e organizado",
    "Controle de pacotes e atendimentos recorrentes",
    "Financeiro simples e organizado",
  ],
  faq: [
    { q: "Os registros de evolução são sigilosos?", a: "Sim. As anotações ficam protegidas e acessíveis apenas ao profissional responsável." },
    { q: "Atende sessões recorrentes?", a: "Sim. Você define a recorrência semanal ou quinzenal e o sistema mantém os horários reservados." },
  ],
  seo: {
    title: "Sistema para Psicólogos | Agenda e evolução do paciente",
    description:
      "Software para psicólogos e terapeutas com agenda de sessões, registro de evolução e financeiro.",
    keywords: ["sistema para psicólogo", "agenda psicologia", "software terapeuta"],
    headline: "O sistema do seu consultório de psicologia",
    subheadline: "Agenda de sessões, registro de evolução e controle financeiro com sigilo.",
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
  customerFields: [
    { key: "objetivo", label: "Objetivo", type: "select", options: ["Emagrecimento", "Hipertrofia", "Condicionamento", "Reabilitação"] },
    { key: "restricoes", label: "Restrições médicas", type: "text" },
  ],
  defaultServices: [
    { name: "Aula avulsa", price: 80, durationMin: 60 },
    { name: "Plano mensal 3x", price: 400, durationMin: 60 },
  ],
  benefits: [
    "Agenda de treinos por aluno, com lembretes",
    "Controle de planos e mensalidades",
    "Acompanhamento da evolução de cada aluno",
    "Financeiro com cobranças recorrentes",
  ],
  faq: [
    { q: "Consigo cobrar mensalidade automática?", a: "Você cadastra o plano de cada aluno e acompanha as mensalidades a receber no financeiro." },
    { q: "Dá para acompanhar a evolução do aluno?", a: "Sim. Você registra observações e a evolução de cada aluno ao longo do tempo." },
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
  tagline: "Alunos, mensalidades e presença.",
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
  customerFields: [
    { key: "plano", label: "Plano atual", type: "text" },
    { key: "data_matricula", label: "Data de matrícula", type: "date" },
  ],
  defaultServices: [
    { name: "Plano mensal", price: 99, durationMin: 0 },
    { name: "Plano trimestral", price: 270, durationMin: 0 },
    { name: "Plano anual", price: 899, durationMin: 0 },
  ],
  benefits: [
    "Cadastro de alunos e planos de matrícula",
    "Controle de mensalidades e inadimplência",
    "Grade de aulas e instrutores",
    "Relatórios de faturamento e retenção",
  ],
  faq: [
    { q: "Consigo controlar a inadimplência?", a: "Sim. O sistema mostra os alunos com mensalidade em aberto para facilitar a cobrança." },
    { q: "Tem grade de aulas?", a: "Sim. Você organiza as aulas por horário e instrutor, e os alunos por turma." },
  ],
  seo: {
    title: "Sistema para Academia | Alunos, mensalidades e aulas",
    description:
      "Software para academia com cadastro de alunos, planos, mensalidades, aulas e financeiro.",
    keywords: ["sistema para academia", "software academia", "gestão de academia"],
    headline: "Gestão completa para a sua academia",
    subheadline: "Alunos, planos, mensalidades, grade de aulas e financeiro.",
  },
};
