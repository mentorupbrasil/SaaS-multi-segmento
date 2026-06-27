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
    { key: "responsavel", label: "Responsável", type: "text" },
    { key: "turma", label: "Turma", type: "text" },
  ],
  defaultServices: [
    { name: "Mensalidade do curso", price: 200, durationMin: 0 },
    { name: "Matrícula", price: 100, durationMin: 0 },
  ],
  benefits: [
    "Cadastro de alunos, responsáveis e turmas",
    "Grade de aulas por professor",
    "Controle de mensalidades e matrículas",
    "Financeiro com acompanhamento de inadimplência",
  ],
  faq: [
    { q: "Consigo organizar alunos por turma?", a: "Sim. Você cria as turmas e vincula os alunos, com a grade de aulas de cada uma." },
    { q: "Dá para acompanhar mensalidades?", a: "Sim. O financeiro mostra as mensalidades pagas e em aberto de cada aluno." },
  ],
  seo: {
    title: "Sistema para Escola e Cursos | Alunos, turmas e mensalidades",
    description:
      "Software para escolas e cursos livres com cadastro de alunos, turmas, grade de aulas e financeiro.",
    keywords: ["sistema para escola", "software curso", "gestão escolar"],
    headline: "Gestão completa para a sua escola ou curso",
    subheadline: "Alunos, turmas, grade de aulas e controle de mensalidades.",
  },
};
