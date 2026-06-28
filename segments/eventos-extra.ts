import type { SegmentTemplate } from "./types";

// Sub-nichos de Eventos (parte 2).

const baseTerms = {
  customer: "Cliente",
  customer_plural: "Clientes",
  professional: "Profissional",
  professional_plural: "Equipe",
  service: "Serviço",
  service_plural: "Serviços",
};

const eventFields = [
  { key: "tipo_evento", label: "Tipo de evento", type: "select" as const, options: ["Casamento", "Aniversário", "Corporativo", "Formatura", "Outro"] },
  { key: "data_evento", label: "Data do evento", type: "date" as const },
  { key: "convidados", label: "Nº de convidados", type: "number" as const },
  { key: "local", label: "Local", type: "text" as const },
];

const baseModules = ["clients", "scheduling", "services", "financial", "team", "work_orders"] as const;

export const djSonorizacao: SegmentTemplate = {
  id: "dj-sonorizacao",
  label: "DJ e Sonorização",
  slug: "dj-sonorizacao",
  icon: "Music",
  category: "eventos",
  tagline: "Agenda, equipamentos e eventos.",
  modules: [...baseModules, "inventory"],
  terms: {
    ...baseTerms,
    appointment: "Evento",
    appointment_plural: "Agenda",
    work_order: "Evento",
    work_order_plural: "Eventos",
    inventory: "Equipamentos",
  },
  customerFields: eventFields,
  defaultServices: [
    { name: "DJ + sonorização (4h)", price: 1800, durationMin: 0 },
    { name: "DJ + som + luz", price: 2800, durationMin: 0 },
    { name: "Som ambiente", price: 800, durationMin: 0 },
  ],
  benefits: [
    "Agenda de eventos com bloqueio de datas",
    "Reserva de equipamentos por evento",
    "Orçamentos com pacotes e adicionais",
    "Equipe de DJ e técnicos",
    "Financeiro por evento",
  ],
  faq: [
    { q: "Reservo equipamentos?", a: "Sim. Caixas, mesas e acessórios ficam reservados para a data do evento." },
    { q: "Faço pacotes DJ + som + luz?", a: "Sim. Você monta pacotes com serviços e equipamentos no orçamento." },
  ],
  seo: {
    title: "Sistema para DJ e Sonorização | Agenda e equipamentos",
    description: "Software para DJ e sonorização com agenda, equipamentos, orçamentos e financeiro.",
    keywords: ["sistema dj eventos", "software sonorização", "gestão dj"],
    headline: "O sistema do DJ e sonorização",
    subheadline: "Agenda, equipamentos, pacotes e financeiro.",
  },
};

export const iluminacao: SegmentTemplate = {
  id: "iluminacao",
  label: "Iluminação",
  slug: "iluminacao-eventos",
  icon: "Lightbulb",
  category: "eventos",
  tagline: "Projetos, equipamentos e montagem.",
  modules: [...baseModules, "inventory"],
  terms: {
    ...baseTerms,
    work_order: "Evento",
    work_order_plural: "Eventos",
    inventory: "Equipamentos",
  },
  customerFields: eventFields,
  defaultServices: [
    { name: "Projeto de iluminação", price: 1500, durationMin: 0 },
    { name: "Locação + operação (evento)", price: 3500, durationMin: 0 },
    { name: "Cenografia luminosa", price: 5000, durationMin: 0 },
  ],
  benefits: [
    "Orçamentos com equipamentos e operação",
    "Reserva de equipamentos por evento",
    "Cronograma de montagem e desmontagem",
    "Equipe de técnicos e operadores",
    "Financeiro com custos por evento",
  ],
  faq: [
    { q: "Controlo equipamentos de luz?", a: "Sim. Cada refletor, moving e acessório fica reservado no estoque para o evento." },
    { q: "Incluo operação no orçamento?", a: "Sim. Você separa locação, operação e projeto no orçamento." },
  ],
  seo: {
    title: "Sistema para Iluminação de Eventos | Equipamentos e projetos",
    description: "Software para iluminação de eventos com projetos, equipamentos, montagem e financeiro.",
    keywords: ["sistema iluminação eventos", "software iluminador", "locação luz eventos"],
    headline: "O sistema de iluminação de eventos",
    subheadline: "Projetos, equipamentos, montagem e financeiro.",
  },
};

export const locacaoEstruturas: SegmentTemplate = {
  id: "locacao-estruturas",
  label: "Locação de Estruturas",
  slug: "locacao-de-estruturas",
  icon: "Tent",
  category: "eventos",
  tagline: "Tendas, palcos e reservas.",
  modules: [...baseModules, "inventory"],
  terms: {
    ...baseTerms,
    work_order: "Locação",
    work_order_plural: "Locações",
    inventory: "Estruturas / Estoque",
  },
  customerFields: eventFields,
  defaultServices: [
    { name: "Tenda 10x10", price: 2500, durationMin: 0 },
    { name: "Palco modular", price: 4000, durationMin: 0 },
    { name: "Montagem e desmontagem", price: 800, durationMin: 0 },
  ],
  benefits: [
    "Reserva de estruturas por data e evento",
    "Orçamentos com montagem e desmontagem",
    "Controle de patrimônio e manutenção",
    "Agenda de entregas e retiradas",
    "Financeiro por locação",
  ],
  faq: [
    { q: "Reservo estruturas por data?", a: "Sim. Tendas, palcos e estruturas ficam reservados no calendário." },
    { q: "Controlo manutenção?", a: "Sim. Cada item tem histórico de uso e manutenção (a caminho)." },
  ],
  seo: {
    title: "Sistema para Locação de Estruturas | Tendas e palcos",
    description: "Software para locação de estruturas com reservas, patrimônio, montagem e financeiro.",
    keywords: ["sistema locação estruturas", "software tendas eventos", "locação palco"],
    headline: "O sistema de locação de estruturas",
    subheadline: "Tendas, palcos, reservas, patrimônio e financeiro.",
  },
};

export const aluguelMobiliario: SegmentTemplate = {
  id: "aluguel-mobiliario",
  label: "Aluguel de Mobiliário",
  slug: "aluguel-de-mobiliario",
  icon: "Armchair",
  category: "eventos",
  tagline: "Mesas, cadeiras e reservas.",
  modules: [...baseModules, "inventory"],
  terms: {
    ...baseTerms,
    work_order: "Locação",
    work_order_plural: "Locações",
    inventory: "Mobiliário / Estoque",
  },
  customerFields: eventFields,
  defaultServices: [
    { name: "Mesa redonda + 10 cadeiras", price: 350, durationMin: 0 },
    { name: "Lounges (conjunto)", price: 800, durationMin: 0 },
    { name: "Entrega e retirada", price: 200, durationMin: 0 },
  ],
  benefits: [
    "Catálogo de mobiliário com reserva por evento",
    "Orçamentos por quantidade e tipo",
    "Controle de estoque e inventário",
    "Agenda de entregas e montagem",
    "Financeiro por locação",
  ],
  faq: [
    { q: "Orço por quantidade de mesas?", a: "Sim. Você monta o orçamento com itens, quantidades e entrega." },
    { q: "Vejo o que está disponível?", a: "Sim. O estoque mostra o que está livre ou reservado para cada data." },
  ],
  seo: {
    title: "Sistema para Aluguel de Mobiliário | Reservas e estoque",
    description: "Software para aluguel de mobiliário com catálogo, reservas, entregas, estoque e financeiro.",
    keywords: ["sistema aluguel mobiliário", "locação mesas cadeiras", "software mobiliário eventos"],
    headline: "O sistema de aluguel de mobiliário",
    subheadline: "Catálogo, reservas, entregas, estoque e financeiro.",
  },
};

export const assessoriaCasamentos: SegmentTemplate = {
  id: "assessoria-casamentos",
  label: "Assessoria de Casamentos",
  slug: "assessoria-de-casamentos",
  icon: "HeartHandshake",
  category: "eventos",
  tagline: "Planejamento, fornecedores e checklist.",
  modules: [...baseModules],
  terms: {
    ...baseTerms,
    appointment: "Reunião",
    appointment_plural: "Agenda",
    work_order: "Casamento",
    work_order_plural: "Casamentos",
  },
  customerFields: [
    ...eventFields,
    { key: "noivos", label: "Nomes dos noivos", type: "text" as const },
  ],
  defaultServices: [
    { name: "Assessoria completa", price: 6000, durationMin: 0 },
    { name: "Assessoria do dia", price: 2500, durationMin: 0 },
    { name: "Consultoria (5h)", price: 800, durationMin: 0 },
  ],
  benefits: [
    "Checklist completo do casamento",
    "Cronograma do casal e do dia",
    "Fornecedores vinculados ao evento",
    "Lista de convidados e RSVP — a caminho",
    "Orçamentos e contratos com os noivos",
  ],
  faq: [
    { q: "Tenho checklist do casamento?", a: "Sim. Checklists personalizados com prazos e responsáveis." },
    { q: "Organizo fornecedores?", a: "Sim. Cada fornecedor fica vinculado ao casamento com contrato e pagamento." },
  ],
  seo: {
    title: "Sistema para Assessoria de Casamentos | Checklist e fornecedores",
    description: "Software para assessoria de casamentos com checklist, cronograma, fornecedores, orçamentos e contratos.",
    keywords: ["sistema assessoria casamento", "software wedding planner", "checklist casamento"],
    headline: "O sistema da assessoria de casamentos",
    subheadline: "Checklist, cronograma, fornecedores, orçamentos e contratos.",
  },
};

export const produtoraEventos: SegmentTemplate = {
  id: "produtora-eventos",
  label: "Produtora de Eventos",
  slug: "produtora-de-eventos",
  icon: "Clapperboard",
  category: "eventos",
  tagline: "Produção, equipes e cronograma.",
  modules: [...baseModules, "inventory"],
  terms: {
    ...baseTerms,
    work_order: "Produção",
    work_order_plural: "Produções",
    inventory: "Equipamentos / Materiais",
  },
  customerFields: eventFields,
  defaultServices: [
    { name: "Produção executiva", price: 12000, durationMin: 0 },
    { name: "Produção técnica", price: 8000, durationMin: 0 },
    { name: "Coordenação geral", price: 4000, durationMin: 0 },
  ],
  benefits: [
    "Produção completa com cronograma detalhado",
    "Equipes, freelancers e fornecedores",
    "Materiais e equipamentos por produção",
    "Orçamentos e contratos integrados",
    "Controle de custos e lucro por evento",
  ],
  faq: [
    { q: "Gerencio produções grandes?", a: "Sim. Cronograma, equipes, fornecedores e financeiro ficam centralizados por produção." },
    { q: "Controlo custos?", a: "Sim. Você acompanha receitas, despesas e margem de cada produção." },
  ],
  seo: {
    title: "Sistema para Produtora de Eventos | Produção e equipes",
    description: "Software para produtora de eventos com produção, cronograma, equipes, fornecedores e financeiro.",
    keywords: ["sistema produtora eventos", "software produção eventos", "erp produtora"],
    headline: "O sistema da produtora de eventos",
    subheadline: "Produção, cronograma, equipes, fornecedores e financeiro.",
  },
};

export const formatura: SegmentTemplate = {
  id: "formatura",
  label: "Empresa de Formatura",
  slug: "empresa-de-formatura",
  icon: "GraduationCap",
  category: "eventos",
  tagline: "Turmas, convites e evento.",
  modules: [...baseModules],
  terms: {
    ...baseTerms,
    customer: "Formando / Turma",
    customer_plural: "Formandos / Turmas",
    work_order: "Formatura",
    work_order_plural: "Formaturas",
  },
  customerFields: [
    { key: "curso", label: "Curso", type: "text" as const },
    { key: "instituicao", label: "Instituição", type: "text" as const },
    { key: "turma", label: "Ano / turma", type: "text" as const },
    { key: "convidados", label: "Nº de convidados", type: "number" as const },
  ],
  defaultServices: [
    { name: "Pacote formatura completo", price: 350, durationMin: 0 },
    { name: "Baile de formatura", price: 0, durationMin: 0 },
    { name: "Colação de grau", price: 0, durationMin: 0 },
  ],
  benefits: [
    "Gestão por turma e formandos",
    "Pacotes com parcelamento coletivo",
    "Convites e lista de convidados — a caminho",
    "Fornecedores e cronograma do baile",
    "Financeiro por turma e por formando",
  ],
  faq: [
    { q: "Controlo por turma?", a: "Sim. Cada turma tem formandos, pacotes, pagamentos e evento organizados." },
    { q: "Parcelamento por formando?", a: "Sim. Você acompanha mensalidades e inadimplência de cada formando." },
  ],
  seo: {
    title: "Sistema para Empresa de Formatura | Turmas e eventos",
    description: "Software para empresa de formatura com turmas, formandos, pacotes, convites e financeiro.",
    keywords: ["sistema formatura", "software empresa formatura", "gestão baile formatura"],
    headline: "O sistema da empresa de formatura",
    subheadline: "Turmas, formandos, pacotes, convites e financeiro.",
  },
};

export const eventosCorporativos: SegmentTemplate = {
  id: "eventos-corporativos",
  label: "Eventos Corporativos",
  slug: "eventos-corporativos",
  icon: "Briefcase",
  category: "eventos",
  tagline: "Inscrições, credenciamento e patrocínios.",
  modules: [...baseModules],
  terms: {
    ...baseTerms,
    customer: "Empresa / Cliente",
    customer_plural: "Empresas / Clientes",
    work_order: "Evento",
    work_order_plural: "Eventos",
  },
  customerFields: [
    { key: "empresa", label: "Empresa", type: "text" as const },
    { key: "participantes", label: "Nº de participantes", type: "number" as const },
    { key: "tipo", label: "Tipo", type: "select" as const, options: ["Convenção", "Workshop", "Lançamento", "Congressos"] },
  ],
  defaultServices: [
    { name: "Produção de convenção", price: 25000, durationMin: 0 },
    { name: "Workshop corporativo", price: 5000, durationMin: 0 },
    { name: "Credenciamento e badges", price: 1500, durationMin: 0 },
  ],
  benefits: [
    "Inscrições e credenciamento de participantes",
    "Lista de participantes e certificados — a caminho",
    "Palestrantes e patrocinadores organizados",
    "Cronograma e salas do evento",
    "Financeiro com centros de custo por cliente",
  ],
  faq: [
    { q: "Faço credenciamento?", a: "Sim. Inscrições e check-in de participantes com QR Code (a caminho)." },
    { q: "Controlo patrocinadores?", a: "Sim. Cada patrocinador fica vinculado ao evento com contrato e entregas." },
  ],
  seo: {
    title: "Sistema para Eventos Corporativos | Inscrições e credenciamento",
    description: "Software para eventos corporativos com inscrições, credenciamento, palestrantes, patrocinadores e financeiro.",
    keywords: ["sistema eventos corporativos", "software convenção", "credenciamento eventos"],
    headline: "O sistema de eventos corporativos",
    subheadline: "Inscrições, credenciamento, palestrantes, patrocinadores e financeiro.",
  },
};
