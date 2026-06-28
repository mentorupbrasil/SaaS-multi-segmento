import type { SegmentTemplate } from "./types";

// Sub-nichos de Organizações (parte 2).

const memberFields = [
  { key: "grupo", label: "Grupo / Área", type: "text" as const },
  { key: "departamento", label: "Departamento", type: "text" as const },
  { key: "data_ingresso", label: "Data de ingresso", type: "date" as const },
  { key: "endereco", label: "Endereço", type: "text" as const },
];

const baseModules = ["clients", "scheduling", "services", "financial", "team", "work_orders", "records"] as const;

const baseTerms = {
  customer: "Participante",
  customer_plural: "Participantes",
  professional: "Voluntário",
  professional_plural: "Voluntários",
  service: "Atividade",
  service_plural: "Atividades",
  appointment: "Reunião",
  appointment_plural: "Agenda",
  work_order: "Evento",
  work_order_plural: "Eventos",
  records: "Documentos",
};

export const institutoSocial: SegmentTemplate = {
  id: "instituto-social",
  label: "Instituto Social",
  slug: "instituto-social",
  icon: "HeartPulse",
  category: "organizacoes",
  tagline: "Projetos, atendimentos e indicadores de impacto.",
  modules: [...baseModules],
  terms: {
    ...baseTerms,
    customer: "Beneficiário",
    customer_plural: "Beneficiários",
    work_order: "Projeto",
    work_order_plural: "Projetos",
  },
  customerFields: [
    { key: "projeto", label: "Projeto vinculado", type: "text" as const },
    { key: "situacao", label: "Situação", type: "select" as const, options: ["Ativo", "Encerrado", "Em acompanhamento"] },
    { key: "endereco", label: "Endereço", type: "text" as const },
  ],
  defaultServices: [
    { name: "Atendimento social", price: 0, durationMin: 60 },
    { name: "Programa educacional", price: 0, durationMin: 0 },
    { name: "Oficina / curso", price: 0, durationMin: 120 },
  ],
  benefits: [
    "Cadastro de beneficiários com histórico de atendimentos",
    "Projetos com metas, cronograma e indicadores sociais",
    "Voluntários, equipes e escalas por programa",
    "Recursos recebidos e prestação de contas",
    "Relatórios de impacto e resultados alcançados",
  ],
  faq: [
    { q: "Acompanho indicadores de impacto?", a: "Sim. Metas, resultados e dashboards por projeto e programa social." },
    { q: "Registro atendimentos individuais?", a: "Sim. Histórico completo de atendimentos por beneficiário com observações e anexos." },
  ],
  seo: {
    title: "Sistema para Instituto Social | Projetos e atendimentos",
    description: "Software para instituto social com beneficiários, projetos, atendimentos, voluntários e indicadores de impacto.",
    keywords: ["sistema instituto social", "software instituto", "gestão projetos sociais"],
    headline: "O sistema do seu instituto social",
    subheadline: "Beneficiários, projetos, atendimentos e indicadores de impacto.",
  },
};

export const osfl: SegmentTemplate = {
  id: "organizacao-sem-fins-lucrativos",
  label: "Organização sem Fins Lucrativos",
  slug: "organizacao-sem-fins-lucrativos",
  icon: "Building2",
  category: "organizacoes",
  tagline: "Gestão administrativa, financeira e operacional.",
  modules: [...baseModules, "inventory"],
  terms: {
    ...baseTerms,
    customer: "Participante",
    customer_plural: "Participantes",
    work_order: "Projeto",
    work_order_plural: "Projetos",
    inventory: "Patrimônio",
  },
  customerFields: memberFields,
  defaultServices: [
    { name: "Programa institucional", price: 0, durationMin: 0 },
    { name: "Campanha de arrecadação", price: 0, durationMin: 0 },
    { name: "Evento beneficente", price: 0, durationMin: 0 },
  ],
  benefits: [
    "Cadastro de participantes, voluntários e beneficiários",
    "Financeiro transparente com prestação de contas",
    "Projetos, eventos e atividades organizadas",
    "Doações, contribuições e campanhas específicas",
    "Patrimônio, documentos e governança integrados",
  ],
  faq: [
    { q: "Atende diferentes tipos de OSFL?", a: "Sim. Adaptável a igrejas, ONGs, associações e fundações com nomenclatura personalizada." },
    { q: "Tenho relatórios para prestação de contas?", a: "Sim. Entradas, saídas, centros de custo e relatórios por projeto e campanha." },
  ],
  seo: {
    title: "Sistema para OSFL | Gestão sem fins lucrativos",
    description: "Software para organização sem fins lucrativos com membros, projetos, doações, financeiro e prestação de contas.",
    keywords: ["sistema OSFL", "software sem fins lucrativos", "gestão ONG"],
    headline: "O sistema da sua organização sem fins lucrativos",
    subheadline: "Membros, projetos, doações, financeiro e prestação de contas.",
  },
};

export const centroComunitario: SegmentTemplate = {
  id: "centro-comunitario",
  label: "Centro Comunitário",
  slug: "centro-comunitario",
  icon: "Home",
  category: "organizacoes",
  tagline: "Atividades, espaços e comunidade.",
  modules: [...baseModules, "inventory"],
  terms: {
    ...baseTerms,
    appointment: "Reserva",
    appointment_plural: "Reservas",
    inventory: "Espaços / Patrimônio",
  },
  customerFields: memberFields,
  defaultServices: [
    { name: "Oficina comunitária", price: 0, durationMin: 120 },
    { name: "Reserva de espaço", price: 0, durationMin: 60 },
    { name: "Evento comunitário", price: 0, durationMin: 0 },
  ],
  benefits: [
    "Cadastro de participantes e grupos da comunidade",
    "Reserva de salas, equipamentos e espaços",
    "Agenda de oficinas, cursos e eventos",
    "Voluntários com escalas e funções",
    "Financeiro com doações e custos por atividade",
  ],
  faq: [
    { q: "Reservo salas e equipamentos?", a: "Sim. Agenda com reservas de espaços, responsáveis e lembretes automáticos." },
    { q: "Organizo oficinas e cursos?", a: "Sim. Inscrições, lista de participantes e check-in por atividade." },
  ],
  seo: {
    title: "Sistema para Centro Comunitário | Atividades e espaços",
    description: "Software para centro comunitário com participantes, reservas de espaços, eventos, voluntários e financeiro.",
    keywords: ["sistema centro comunitário", "software comunidade", "gestão centro comunitário"],
    headline: "O sistema do seu centro comunitário",
    subheadline: "Participantes, reservas, eventos, voluntários e doações.",
  },
};

export const projetosSociais: SegmentTemplate = {
  id: "projetos-sociais",
  label: "Projetos Sociais",
  slug: "projetos-sociais",
  icon: "Target",
  category: "organizacoes",
  tagline: "Metas, equipe e indicadores de impacto.",
  modules: [...baseModules],
  terms: {
    ...baseTerms,
    customer: "Beneficiário",
    customer_plural: "Beneficiários",
    work_order: "Projeto",
    work_order_plural: "Projetos",
  },
  customerFields: [
    { key: "projeto", label: "Projeto", type: "text" as const },
    { key: "meta", label: "Meta vinculada", type: "text" as const },
    { key: "situacao", label: "Situação", type: "select" as const, options: ["Ativo", "Concluído", "Pausado"] },
  ],
  defaultServices: [
    { name: "Projeto social", price: 0, durationMin: 0 },
    { name: "Atendimento", price: 0, durationMin: 60 },
    { name: "Ação comunitária", price: 0, durationMin: 0 },
  ],
  benefits: [
    "Cadastro de projetos com objetivos, metas e cronograma",
    "Beneficiários e histórico de atendimentos",
    "Equipe, voluntários e recursos por projeto",
    "Indicadores de impacto e resultados alcançados",
    "Prestação de contas e relatórios para doadores",
  ],
  faq: [
    { q: "Acompanho metas e indicadores?", a: "Sim. Cada projeto tem metas, cronograma, equipe e indicadores de resultado." },
    { q: "Relaciono recursos ao projeto?", a: "Sim. Doações, despesas e recursos recebidos vinculados por projeto e campanha." },
  ],
  seo: {
    title: "Sistema para Projetos Sociais | Metas e impacto",
    description: "Software para projetos sociais com beneficiários, metas, equipe, recursos, indicadores e prestação de contas.",
    keywords: ["sistema projetos sociais", "software impacto social", "gestão projetos"],
    headline: "O sistema dos seus projetos sociais",
    subheadline: "Metas, beneficiários, equipe, recursos e indicadores de impacto.",
  },
};

export const gruposMovimentos: SegmentTemplate = {
  id: "grupos-movimentos",
  label: "Grupos e Movimentos",
  slug: "grupos-movimentos",
  icon: "UsersRound",
  category: "organizacoes",
  tagline: "Participantes, atividades e engajamento.",
  modules: [...baseModules],
  terms: {
    ...baseTerms,
    professional: "Coordenador",
    professional_plural: "Coordenadores",
    work_order: "Atividade",
    work_order_plural: "Atividades",
  },
  customerFields: memberFields,
  defaultServices: [
    { name: "Encontro do grupo", price: 0, durationMin: 90 },
    { name: "Ação / mobilização", price: 0, durationMin: 0 },
    { name: "Formação", price: 0, durationMin: 120 },
  ],
  benefits: [
    "Cadastro de participantes com grupos e líderes",
    "Agenda de encontros, formações e mobilizações",
    "Frequência e histórico de participação",
    "Comunicados e engajamento dos membros",
    "Financeiro com contribuições e campanhas",
  ],
  faq: [
    { q: "Organizo vários grupos simultaneamente?", a: "Sim. Cada grupo tem líderes, participantes, atividades e frequência próprios." },
    { q: "Acompanho engajamento?", a: "Sim. Frequência, participação em eventos e indicadores de engajamento por grupo." },
  ],
  seo: {
    title: "Sistema para Grupos e Movimentos | Participantes e engajamento",
    description: "Software para grupos e movimentos com participantes, atividades, frequência, comunicação e financeiro.",
    keywords: ["sistema grupos", "software movimentos", "gestão participantes"],
    headline: "O sistema dos seus grupos e movimentos",
    subheadline: "Participantes, atividades, frequência, comunicação e engajamento.",
  },
};
