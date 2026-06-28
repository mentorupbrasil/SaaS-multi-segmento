import type { SegmentTemplate } from "./types";

// Sub-nichos de Organizações (parte 1).

const memberFields = [
  { key: "grupo", label: "Grupo / Ministério", type: "text" as const },
  { key: "departamento", label: "Departamento", type: "text" as const },
  { key: "data_ingresso", label: "Data de ingresso", type: "date" as const },
  { key: "endereco", label: "Endereço", type: "text" as const },
];

const baseModules = ["clients", "scheduling", "services", "financial", "team", "work_orders", "records"] as const;

const baseTerms = {
  customer: "Membro",
  customer_plural: "Membros",
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

export const igreja: SegmentTemplate = {
  id: "igreja",
  label: "Igreja",
  slug: "igreja",
  icon: "Church",
  category: "organizacoes",
  tagline: "Membros, ministérios, eventos e contribuições.",
  modules: [...baseModules, "inventory"],
  terms: {
    ...baseTerms,
    inventory: "Patrimônio",
  },
  customerFields: memberFields,
  defaultServices: [
    { name: "Contribuição mensal", price: 0, durationMin: 0 },
    { name: "Evento especial", price: 0, durationMin: 0 },
    { name: "Curso / discipulado", price: 0, durationMin: 0 },
  ],
  benefits: [
    "Cadastro de membros com grupos, ministérios e departamentos",
    "Escalas de voluntários e líderes por ministério",
    "Eventos, cultos e pequenos grupos com check-in",
    "Contribuições, doações e prestação de contas",
    "Comunicação com membros e acompanhamento de visitantes",
  ],
  faq: [
    { q: "Gerencio ministérios e células?", a: "Sim. Você organiza grupos, líderes, participantes e frequência por departamento." },
    { q: "Controlo contribuições e doações?", a: "Sim. Registre entradas, campanhas e histórico por membro com relatórios financeiros." },
  ],
  seo: {
    title: "Sistema para Igreja | Membros, ministérios e contribuições",
    description: "Software para igreja com gestão de membros, ministérios, eventos, escalas, doações e financeiro transparente.",
    keywords: ["sistema para igreja", "software igreja", "gestão membros igreja"],
    headline: "O sistema da sua igreja",
    subheadline: "Membros, ministérios, eventos, escalas e contribuições.",
  },
};

export const comunidadeReligiosa: SegmentTemplate = {
  id: "comunidade-religiosa",
  label: "Comunidade Religiosa",
  slug: "comunidade-religiosa",
  icon: "HeartHandshake",
  category: "organizacoes",
  tagline: "Participantes, grupos e atividades comunitárias.",
  modules: [...baseModules],
  terms: {
    ...baseTerms,
    customer: "Participante",
    customer_plural: "Participantes",
  },
  customerFields: memberFields,
  defaultServices: [
    { name: "Encontro semanal", price: 0, durationMin: 0 },
    { name: "Retiro / evento", price: 0, durationMin: 0 },
    { name: "Formação", price: 0, durationMin: 0 },
  ],
  benefits: [
    "Cadastro de participantes com histórico de participação",
    "Grupos, comunidades e departamentos com líderes",
    "Agenda de encontros, retiros e formações",
    "Eventos com inscrições e lista de presença",
    "Financeiro com doações e prestação de contas",
  ],
  faq: [
    { q: "Organizo grupos e comunidades?", a: "Sim. Cada grupo tem líderes, participantes, atividades e controle de frequência." },
    { q: "Comunico com os participantes?", a: "Sim. Comunicados, lembretes e campanhas integrados (WhatsApp e e-mail a caminho)." },
  ],
  seo: {
    title: "Sistema para Comunidade Religiosa | Grupos e participantes",
    description: "Software para comunidade religiosa com participantes, grupos, eventos, agenda e gestão financeira.",
    keywords: ["sistema comunidade religiosa", "software comunidade", "gestão participantes"],
    headline: "O sistema da sua comunidade religiosa",
    subheadline: "Participantes, grupos, eventos, agenda e doações.",
  },
};

export const ministerio: SegmentTemplate = {
  id: "ministerio",
  label: "Ministério",
  slug: "ministerio",
  icon: "BookOpen",
  category: "organizacoes",
  tagline: "Equipes, escalas e atividades do ministério.",
  modules: [...baseModules],
  terms: {
    ...baseTerms,
    customer: "Participante",
    customer_plural: "Participantes",
    professional: "Líder",
    professional_plural: "Líderes",
    work_order: "Atividade",
    work_order_plural: "Atividades",
  },
  customerFields: memberFields,
  defaultServices: [
    { name: "Reunião de equipe", price: 0, durationMin: 60 },
    { name: "Ação / evangelismo", price: 0, durationMin: 0 },
    { name: "Treinamento", price: 0, durationMin: 120 },
  ],
  benefits: [
    "Cadastro de participantes e equipes do ministério",
    "Escalas de voluntários com funções e disponibilidade",
    "Agenda de reuniões, treinamentos e ações",
    "Eventos com inscrições e check-in",
    "Relatórios de participação e produtividade",
  ],
  faq: [
    { q: "Monto escalas de voluntários?", a: "Sim. Defina funções, disponibilidade e histórico de participação por pessoa." },
    { q: "Acompanho atividades do ministério?", a: "Sim. Cada atividade tem responsáveis, participantes e registro de ocorrências." },
  ],
  seo: {
    title: "Sistema para Ministério | Escalas e equipes",
    description: "Software para ministério com equipes, escalas, eventos, participantes e gestão de atividades.",
    keywords: ["sistema ministério", "software ministério", "escalas voluntários"],
    headline: "O sistema do seu ministério",
    subheadline: "Equipes, escalas, eventos e participantes.",
  },
};

export const associacao: SegmentTemplate = {
  id: "associacao",
  label: "Associação",
  slug: "associacao",
  icon: "Users",
  category: "organizacoes",
  tagline: "Associados, mensalidades e assembleias.",
  modules: [...baseModules],
  terms: {
    ...baseTerms,
    customer: "Associado",
    customer_plural: "Associados",
    work_order: "Assembleia",
    work_order_plural: "Assembleias",
  },
  customerFields: [
    { key: "matricula", label: "Nº de matrícula", type: "text" as const },
    { key: "categoria", label: "Categoria", type: "select" as const, options: ["Titular", "Dependente", "Honorário", "Estudante"] },
    { key: "data_adesao", label: "Data de adesão", type: "date" as const },
    { key: "endereco", label: "Endereço", type: "text" as const },
  ],
  defaultServices: [
    { name: "Mensalidade", price: 50, durationMin: 0 },
    { name: "Taxa de inscrição", price: 100, durationMin: 0 },
    { name: "Evento associativo", price: 0, durationMin: 0 },
  ],
  benefits: [
    "Cadastro de associados com categorias e histórico",
    "Mensalidades, inadimplência e cobrança recorrente",
    "Assembleias com lista de presença e votações",
    "Comunicados e documentação oficial",
    "Financeiro com prestação de contas",
  ],
  faq: [
    { q: "Controlo mensalidades dos associados?", a: "Sim. Mensalidades, inadimplência e histórico de pagamentos por associado." },
    { q: "Registro assembleias e votações?", a: "Sim. Assembleias com participantes, atas e documentação (votações digitais a caminho)." },
  ],
  seo: {
    title: "Sistema para Associação | Associados e mensalidades",
    description: "Software para associação com associados, mensalidades, assembleias, documentos e financeiro.",
    keywords: ["sistema associação", "software associação", "gestão associados"],
    headline: "O sistema da sua associação",
    subheadline: "Associados, mensalidades, assembleias e documentação.",
  },
};

export const ong: SegmentTemplate = {
  id: "ong",
  label: "ONG",
  slug: "ong",
  icon: "HandHeart",
  category: "organizacoes",
  tagline: "Beneficiários, projetos e prestação de contas.",
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
    { key: "responsavel", label: "Responsável técnico", type: "text" as const },
  ],
  defaultServices: [
    { name: "Atendimento social", price: 0, durationMin: 60 },
    { name: "Projeto comunitário", price: 0, durationMin: 0 },
    { name: "Ação pontual", price: 0, durationMin: 0 },
  ],
  benefits: [
    "Cadastro de beneficiários com histórico de atendimentos",
    "Projetos sociais com metas, equipe e indicadores",
    "Voluntários com escalas e funções",
    "Doações, recursos recebidos e prestação de contas",
    "Relatórios de impacto social",
  ],
  faq: [
    { q: "Gerencio projetos sociais?", a: "Sim. Cada projeto tem objetivos, metas, equipe, recursos e indicadores de resultado." },
    { q: "Faço prestação de contas?", a: "Sim. Financeiro transparente com entradas, saídas e relatórios por projeto e campanha." },
  ],
  seo: {
    title: "Sistema para ONG | Projetos e beneficiários",
    description: "Software para ONG com beneficiários, projetos sociais, voluntários, doações e prestação de contas.",
    keywords: ["sistema ONG", "software ONG", "gestão projetos sociais"],
    headline: "O sistema da sua ONG",
    subheadline: "Beneficiários, projetos, voluntários, doações e prestação de contas.",
  },
};

export const fundacao: SegmentTemplate = {
  id: "fundacao",
  label: "Fundação",
  slug: "fundacao",
  icon: "Landmark",
  category: "organizacoes",
  tagline: "Projetos, patrimônio e governança.",
  modules: [...baseModules, "inventory"],
  terms: {
    ...baseTerms,
    customer: "Beneficiário",
    customer_plural: "Beneficiários",
    work_order: "Projeto",
    work_order_plural: "Projetos",
    inventory: "Patrimônio",
  },
  customerFields: memberFields,
  defaultServices: [
    { name: "Programa social", price: 0, durationMin: 0 },
    { name: "Bolsa / auxílio", price: 0, durationMin: 0 },
    { name: "Evento institucional", price: 0, durationMin: 0 },
  ],
  benefits: [
    "Gestão de programas e projetos com metas e indicadores",
    "Cadastro de beneficiários e parceiros",
    "Patrimônio, bens e inventário institucional",
    "Doações, campanhas e prestação de contas",
    "Documentos, atas e relatórios de governança",
  ],
  faq: [
    { q: "Controlo patrimônio da fundação?", a: "Sim. Bens, equipamentos, salas e inventário com responsáveis e manutenção." },
    { q: "Relatórios para conselho e doadores?", a: "Sim. Dashboards financeiros, indicadores de impacto e prestação de contas por projeto." },
  ],
  seo: {
    title: "Sistema para Fundação | Projetos e patrimônio",
    description: "Software para fundação com projetos, beneficiários, patrimônio, doações, documentos e governança.",
    keywords: ["sistema fundação", "software fundação", "gestão fundação"],
    headline: "O sistema da sua fundação",
    subheadline: "Projetos, patrimônio, doações, documentos e governança.",
  },
};
