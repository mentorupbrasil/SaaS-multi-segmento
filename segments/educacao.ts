import type { SegmentTemplate } from "./types";

export const escola: SegmentTemplate = {
  id: "escola",
  label: "Escola / Curso",
  slug: "escola-curso",
  icon: "GraduationCap",
  category: "educacao",
  tagline: "Alunos, turmas e mensalidades.",
  modules: ["clients", "scheduling", "services", "financial", "team"],
  terms: {
    customer: "Aluno",
    customer_plural: "Alunos",
    professional: "Professor",
    professional_plural: "Professores",
    service: "Curso",
    service_plural: "Cursos",
    appointment: "Aula",
    appointment_plural: "Aulas",
  },
  customerFields: [
    { key: "responsavel", label: "Responsavel", type: "text" },
    { key: "turma", label: "Turma", type: "text" },
  ],
  defaultServices: [
    { name: "Mensalidade curso", price: 200, durationMin: 0 },
    { name: "Matricula", price: 100, durationMin: 0 },
  ],
  benefits: [
    "Cadastro de alunos e turmas",
    "Grade de aulas e professores",
    "Controle de mensalidades",
    "Financeiro e inadimplencia",
  ],
  seo: {
    title: "Sistema para Escola e Cursos | Alunos, turmas e mensalidades",
    description:
      "Software para escolas e cursos livres com cadastro de alunos, turmas, grade de aulas e financeiro.",
    keywords: ["sistema para escola", "software curso", "gestao escolar"],
    headline: "Gestao completa para a sua escola ou curso",
    subheadline: "Alunos, turmas, grade de aulas e controle de mensalidades.",
  },
};
