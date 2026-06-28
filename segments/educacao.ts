import type { SegmentTemplate } from "./types";

const baseModules = ["clients", "scheduling", "services", "financial", "team"] as const;

const alunoTerms = {
  customer: "Aluno",
  customer_plural: "Alunos",
  professional: "Professor",
  professional_plural: "Professores",
  service: "Curso",
  service_plural: "Cursos",
  appointment: "Aula",
  appointment_plural: "Aulas",
};

export const escola: SegmentTemplate = {
  id: "escola",
  label: "Escola / Curso",
  slug: "escola-curso",
  icon: "GraduationCap",
  category: "educacao",
  tagline: "Alunos, turmas e mensalidades.",
  modules: [...baseModules],
  terms: alunoTerms,
  specialties: [
    { id: "fundamental", label: "Ensino fundamental" },
    { id: "medio", label: "Ensino médio" },
    { id: "curso-livre", label: "Curso livre / profissionalizante" },
    { id: "pre-vestibular", label: "Pré-vestibular / reforço" },
  ],
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

export const cursoLivre: SegmentTemplate = {
  id: "curso-livre",
  label: "Curso Livre",
  slug: "curso-livre",
  icon: "PlayCircle",
  category: "educacao",
  tagline: "Turmas abertas, matrículas e mensalidades.",
  modules: [...baseModules],
  terms: alunoTerms,
  customerFields: [
    { key: "modalidade", label: "Modalidade", type: "select", options: ["Presencial", "Online", "Híbrido"] },
    { key: "turma", label: "Turma", type: "text" },
  ],
  defaultServices: [
    { name: "Matrícula", price: 80, durationMin: 0 },
    { name: "Mensalidade", price: 150, durationMin: 0 },
  ],
  benefits: [
    "Cadastro de alunos e turmas abertas",
    "Grade de aulas por instrutor",
    "Controle de matrículas e mensalidades",
    "Financeiro com inadimplência",
  ],
  faq: [
    { q: "Atendo cursos presenciais e online?", a: "Sim. Você registra a modalidade de cada turma e aluno." },
    { q: "Consigo controlar vagas por turma?", a: "Sim. Cada turma tem limite de alunos e status de matrícula." },
  ],
  seo: {
    title: "Sistema para Curso Livre | Turmas e matrículas",
    description: "Software para cursos livres com turmas, matrículas, grade de aulas e financeiro.",
    keywords: ["sistema curso livre", "software curso profissionalizante", "gestão turmas"],
    headline: "Gestão para o seu curso livre",
    subheadline: "Turmas, matrículas, grade de aulas e mensalidades.",
  },
};

export const escolaInfantil: SegmentTemplate = {
  id: "escola-infantil",
  label: "Escola Infantil",
  slug: "escola-infantil",
  icon: "Users",
  category: "educacao",
  tagline: "Crianças, responsáveis e mensalidades.",
  modules: [...baseModules, "records"],
  terms: {
    ...alunoTerms,
    customer: "Aluno",
    professional: "Educador",
    professional_plural: "Educadores",
    records: "Observações",
  },
  customerFields: [
    { key: "responsavel", label: "Responsável", type: "text" },
    { key: "turma", label: "Turma / sala", type: "text" },
    { key: "alergias", label: "Alergias / restrições", type: "text" },
  ],
  defaultServices: [
    { name: "Mensalidade", price: 850, durationMin: 0 },
    { name: "Matrícula", price: 300, durationMin: 0 },
  ],
  benefits: [
    "Cadastro de crianças e responsáveis",
    "Turmas por faixa etária",
    "Registro de observações e ocorrências",
    "Controle de mensalidades e matrículas",
  ],
  faq: [
    { q: "Registro alergias e restrições?", a: "Sim. Cada aluno tem campos para alergias, restrições alimentares e observações." },
    { q: "Consigo vincular mais de um responsável?", a: "Sim. Você cadastra o responsável principal e contatos alternativos." },
  ],
  seo: {
    title: "Sistema para Escola Infantil | Crianças e mensalidades",
    description: "Software para escola infantil com cadastro de alunos, responsáveis, turmas e financeiro.",
    keywords: ["sistema escola infantil", "software creche", "gestão escola infantil"],
    headline: "Gestão para a sua escola infantil",
    subheadline: "Crianças, responsáveis, turmas e controle de mensalidades.",
  },
};

export const escolaTecnica: SegmentTemplate = {
  id: "escola-tecnica",
  label: "Escola Técnica",
  slug: "escola-tecnica",
  icon: "HardHat",
  category: "educacao",
  tagline: "Turmas técnicas, estágios e mensalidades.",
  modules: [...baseModules],
  terms: {
    ...alunoTerms,
    service: "Curso técnico",
    service_plural: "Cursos técnicos",
  },
  customerFields: [
    { key: "curso", label: "Curso técnico", type: "text" },
    { key: "periodo", label: "Período", type: "select", options: ["Manhã", "Tarde", "Noite"] },
    { key: "estagio", label: "Empresa de estágio", type: "text" },
  ],
  defaultServices: [
    { name: "Mensalidade", price: 450, durationMin: 0 },
    { name: "Matrícula", price: 200, durationMin: 0 },
  ],
  benefits: [
    "Cadastro de alunos por curso técnico",
    "Turmas por período e módulo",
    "Controle de estágios e empresas parceiras",
    "Financeiro com mensalidades e bolsas",
  ],
  faq: [
    { q: "Organizo alunos por curso técnico?", a: "Sim. Cada aluno fica vinculado ao curso, turma e período." },
    { q: "Registro estágios?", a: "Sim. Você cadastra a empresa de estágio e acompanha o vínculo de cada aluno." },
  ],
  seo: {
    title: "Sistema para Escola Técnica | Turmas e estágios",
    description: "Software para escola técnica com alunos, turmas, estágios, mensalidades e financeiro.",
    keywords: ["sistema escola técnica", "software ETEC", "gestão curso técnico"],
    headline: "Gestão para a sua escola técnica",
    subheadline: "Alunos, turmas, estágios e controle de mensalidades.",
  },
};

export const universidade: SegmentTemplate = {
  id: "universidade",
  label: "Universidade / Faculdade",
  slug: "universidade",
  icon: "Landmark",
  category: "educacao",
  tagline: "Graduação, pós e mensalidades.",
  modules: [...baseModules],
  terms: {
    ...alunoTerms,
    customer: "Acadêmico",
    customer_plural: "Acadêmicos",
    service: "Disciplina",
    service_plural: "Disciplinas",
  },
  customerFields: [
    { key: "curso", label: "Curso", type: "text" },
    { key: "semestre", label: "Semestre", type: "text" },
    { key: "matricula", label: "Matrícula acadêmica", type: "text" },
  ],
  defaultServices: [
    { name: "Mensalidade graduação", price: 1200, durationMin: 0 },
    { name: "Matrícula semestral", price: 500, durationMin: 0 },
  ],
  benefits: [
    "Cadastro de acadêmicos por curso e semestre",
    "Grade de aulas por professor",
    "Controle de mensalidades e bolsas",
    "Financeiro com inadimplência por turma",
  ],
  faq: [
    { q: "Atendo graduação e pós?", a: "Sim. Você cadastra cursos de graduação, especialização e mestrado." },
    { q: "Consigo acompanhar inadimplência?", a: "Sim. O financeiro mostra mensalidades em aberto por acadêmico e turma." },
  ],
  seo: {
    title: "Sistema para Universidade | Acadêmicos e mensalidades",
    description: "Software para universidade e faculdade com acadêmicos, turmas, grade de aulas e financeiro.",
    keywords: ["sistema universidade", "software faculdade", "gestão acadêmica"],
    headline: "Gestão acadêmica para a sua instituição",
    subheadline: "Acadêmicos, turmas, grade de aulas e mensalidades.",
  },
};

export const cursinho: SegmentTemplate = {
  id: "cursinho",
  label: "Cursinho / Pré-vestibular",
  slug: "cursinho",
  icon: "Target",
  category: "educacao",
  tagline: "Simulados, turmas e mensalidades.",
  modules: [...baseModules],
  terms: {
    ...alunoTerms,
    service: "Módulo",
    service_plural: "Módulos",
    appointment: "Aula / Simulado",
    appointment_plural: "Aulas / Simulados",
  },
  customerFields: [
    { key: "vestibular_alvo", label: "Vestibular alvo", type: "text", placeholder: "Ex.: ENEM, Fuvest" },
    { key: "turma", label: "Turma", type: "text" },
  ],
  defaultServices: [
    { name: "Mensalidade extensivo", price: 350, durationMin: 0 },
    { name: "Simulado avulso", price: 45, durationMin: 300 },
  ],
  benefits: [
    "Cadastro de alunos por turma e modalidade",
    "Agenda de aulas e simulados",
    "Controle de mensalidades e pacotes",
    "Financeiro com inadimplência",
  ],
  faq: [
    { q: "Organizo simulados na agenda?", a: "Sim. Você agenda simulados e aulas por turma e professor." },
    { q: "Atendo extensivo e semiextensivo?", a: "Sim. Cada turma tem modalidade e grade de horários própria." },
  ],
  seo: {
    title: "Sistema para Cursinho | Turmas e simulados",
    description: "Software para cursinho e pré-vestibular com turmas, simulados, mensalidades e financeiro.",
    keywords: ["sistema cursinho", "software pré-vestibular", "gestão cursinho"],
    headline: "Gestão para o seu cursinho",
    subheadline: "Turmas, simulados, mensalidades e controle de alunos.",
  },
};

export const idiomas: SegmentTemplate = {
  id: "idiomas",
  label: "Escola de Idiomas",
  slug: "escola-de-idiomas",
  icon: "Languages",
  category: "educacao",
  tagline: "Turmas, níveis e mensalidades.",
  modules: [...baseModules],
  terms: {
    ...alunoTerms,
    service: "Idioma",
    service_plural: "Idiomas",
  },
  customerFields: [
    { key: "idioma", label: "Idioma", type: "select", options: ["Inglês", "Espanhol", "Francês", "Alemão", "Outro"] },
    { key: "nivel", label: "Nível", type: "select", options: ["Básico", "Intermediário", "Avançado"] },
  ],
  defaultServices: [
    { name: "Mensalidade", price: 280, durationMin: 0 },
    { name: "Matrícula", price: 100, durationMin: 0 },
  ],
  benefits: [
    "Cadastro de alunos por idioma e nível",
    "Turmas com grade de aulas",
    "Controle de mensalidades e rematrículas",
    "Financeiro com inadimplência",
  ],
  faq: [
    { q: "Organizo turmas por idioma e nível?", a: "Sim. Cada turma tem idioma, nível e horário definidos." },
    { q: "Consigo acompanhar rematrículas?", a: "Sim. O sistema mostra alunos ativos e pendentes de rematrícula." },
  ],
  seo: {
    title: "Sistema para Escola de Idiomas | Turmas e níveis",
    description: "Software para escola de idiomas com turmas, níveis, mensalidades e financeiro.",
    keywords: ["sistema escola de idiomas", "software curso de inglês", "gestão idiomas"],
    headline: "Gestão para a sua escola de idiomas",
    subheadline: "Turmas, níveis, mensalidades e controle de alunos.",
  },
};

export const musicaEscola: SegmentTemplate = {
  id: "musica-escola",
  label: "Escola de Música",
  slug: "escola-de-musica",
  icon: "Music",
  category: "educacao",
  tagline: "Instrumentos, aulas e mensalidades.",
  modules: [...baseModules],
  terms: {
    ...alunoTerms,
    professional: "Professor de música",
    professional_plural: "Professores de música",
    service: "Instrumento",
    service_plural: "Instrumentos",
  },
  customerFields: [
    { key: "instrumento", label: "Instrumento", type: "select", options: ["Violão", "Piano", "Bateria", "Canto", "Outro"] },
    { key: "nivel", label: "Nível", type: "select", options: ["Iniciante", "Intermediário", "Avançado"] },
  ],
  defaultServices: [
    { name: "Aula individual (mensal)", price: 320, durationMin: 60 },
    { name: "Matrícula", price: 80, durationMin: 0 },
  ],
  benefits: [
    "Cadastro de alunos por instrumento",
    "Agenda de aulas individuais e em grupo",
    "Controle de mensalidades e pacotes",
    "Financeiro com inadimplência",
  ],
  faq: [
    { q: "Agendo aulas por instrumento?", a: "Sim. Cada aluno tem instrumento, professor e horário fixo na agenda." },
    { q: "Atendo aulas em grupo?", a: "Sim. Você cria turmas por instrumento com grade compartilhada." },
  ],
  seo: {
    title: "Sistema para Escola de Música | Aulas e mensalidades",
    description: "Software para escola de música com alunos, instrumentos, agenda de aulas e financeiro.",
    keywords: ["sistema escola de música", "software conservatório", "gestão aulas de música"],
    headline: "Gestão para a sua escola de música",
    subheadline: "Alunos, instrumentos, agenda de aulas e mensalidades.",
  },
};

export const reforcoEscolar: SegmentTemplate = {
  id: "reforco-escolar",
  label: "Reforço Escolar",
  slug: "reforco-escolar",
  icon: "BookOpen",
  category: "educacao",
  tagline: "Matérias, horários e mensalidades.",
  modules: [...baseModules],
  terms: {
    ...alunoTerms,
    service: "Matéria",
    service_plural: "Matérias",
  },
  customerFields: [
    { key: "serie", label: "Série / ano", type: "text" },
    { key: "materias", label: "Matérias", type: "text", placeholder: "Ex.: Matemática, Português" },
    { key: "responsavel", label: "Responsável", type: "text" },
  ],
  defaultServices: [
    { name: "Pacote mensal (2x/semana)", price: 400, durationMin: 0 },
    { name: "Aula avulsa", price: 60, durationMin: 60 },
  ],
  benefits: [
    "Cadastro de alunos por série e matéria",
    "Agenda de reforço por professor",
    "Controle de pacotes e aulas avulsas",
    "Financeiro com mensalidades",
  ],
  faq: [
    { q: "Organizo alunos por matéria?", a: "Sim. Cada aluno tem as matérias de reforço e horários definidos." },
    { q: "Vendo pacotes e aulas avulsas?", a: "Sim. Você cadastra pacotes mensais e aulas avulsas no financeiro." },
  ],
  seo: {
    title: "Sistema para Reforço Escolar | Matérias e horários",
    description: "Software para reforço escolar com alunos, matérias, agenda de aulas e financeiro.",
    keywords: ["sistema reforço escolar", "software aulas particulares", "gestão reforço"],
    headline: "Gestão para o seu reforço escolar",
    subheadline: "Alunos, matérias, horários e controle de mensalidades.",
  },
};
