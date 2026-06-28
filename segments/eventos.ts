import type { SegmentTemplate } from "./types";

// Sub-nichos de Eventos (parte 1).

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

export const cerimonialista: SegmentTemplate = {
  id: "cerimonialista",
  label: "Cerimonialista",
  slug: "cerimonialista",
  icon: "CalendarHeart",
  category: "eventos",
  tagline: "Casamentos, cronograma e fornecedores.",
  modules: [...baseModules],
  terms: {
    ...baseTerms,
    appointment: "Reunião",
    appointment_plural: "Agenda",
    work_order: "Evento",
    work_order_plural: "Eventos",
  },
  customerFields: eventFields,
  defaultServices: [
    { name: "Assessoria completa (casamento)", price: 8000, durationMin: 0 },
    { name: "Cerimônia e recepção (dia)", price: 3500, durationMin: 0 },
    { name: "Consultoria pontual", price: 500, durationMin: 60 },
  ],
  benefits: [
    "Gestão completa do casamento do primeiro contato ao pós-evento",
    "Cronograma do casal com checklist e fornecedores",
    "Orçamentos com aprovação e conversão em contrato",
    "Agenda de reuniões, degustações e ensaios",
    "Financeiro com custos e pagamentos por evento",
  ],
  faq: [
    { q: "Controlo vários casamentos ao mesmo tempo?", a: "Sim. Cada evento tem status, cronograma, fornecedores e checklist próprios." },
    { q: "Tenho checklist do casamento?", a: "Sim. Você monta checklists por evento com prazos e responsáveis." },
  ],
  seo: {
    title: "Sistema para Cerimonialista | Casamentos e cronograma",
    description: "Software para cerimonialista com gestão de casamentos, cronograma, fornecedores, orçamentos e financeiro.",
    keywords: ["sistema cerimonialista", "software casamento", "gestão eventos casamento"],
    headline: "O sistema do cerimonialista",
    subheadline: "Casamentos, cronograma, fornecedores, orçamentos e contratos.",
  },
};

export const organizadoraEventos: SegmentTemplate = {
  id: "organizadora-eventos",
  label: "Organizadora de Eventos",
  slug: "organizadora-de-eventos",
  icon: "PartyPopper",
  category: "eventos",
  tagline: "Eventos, orçamentos e equipes.",
  modules: [...baseModules],
  terms: {
    ...baseTerms,
    appointment: "Reunião",
    appointment_plural: "Agenda",
    work_order: "Evento",
    work_order_plural: "Eventos",
  },
  customerFields: eventFields,
  defaultServices: [
    { name: "Organização completa", price: 5000, durationMin: 0 },
    { name: "Coordenação no dia", price: 2000, durationMin: 0 },
    { name: "Consultoria de evento", price: 400, durationMin: 60 },
  ],
  benefits: [
    "Vários eventos simultâneos com status e cronograma",
    "Orçamentos personalizados com aprovação online",
    "Fornecedores e equipes por evento",
    "Checklist e cronograma do dia",
    "Financeiro com custos e lucro por evento",
  ],
  faq: [
    { q: "Gerencio vários eventos ao mesmo tempo?", a: "Sim. Cada evento fica isolado com agenda, fornecedores e financeiro próprios." },
    { q: "Faço orçamentos e contratos?", a: "Sim. Você cria propostas, converte em contrato e acompanha pagamentos." },
  ],
  seo: {
    title: "Sistema para Organizadora de Eventos | Orçamentos e cronograma",
    description: "Software para organizadora de eventos com gestão de eventos, orçamentos, contratos, fornecedores e financeiro.",
    keywords: ["sistema organizadora eventos", "software eventos", "gestão eventos"],
    headline: "O sistema da organizadora de eventos",
    subheadline: "Eventos, orçamentos, contratos, fornecedores e equipes.",
  },
};

export const empresaEventos: SegmentTemplate = {
  id: "empresa-eventos",
  label: "Empresa de Eventos",
  slug: "empresa-de-eventos",
  icon: "Briefcase",
  category: "eventos",
  tagline: "Produção, equipes e múltiplos eventos.",
  modules: [...baseModules, "inventory"],
  terms: {
    ...baseTerms,
    work_order: "Evento",
    work_order_plural: "Eventos",
    inventory: "Materiais / Patrimônio",
  },
  customerFields: eventFields,
  defaultServices: [
    { name: "Produção de evento", price: 15000, durationMin: 0 },
    { name: "Locação de estrutura", price: 3000, durationMin: 0 },
    { name: "Coordenação operacional", price: 2500, durationMin: 0 },
  ],
  benefits: [
    "Produção completa com equipes e freelancers",
    "Materiais e patrimônio com reserva por evento",
    "Fornecedores e contratos centralizados",
    "Cronograma de montagem e desmontagem",
    "BI com lucratividade por evento — a caminho",
  ],
  faq: [
    { q: "Controlo materiais e equipamentos?", a: "Sim. Você reserva mobiliário e equipamentos por evento com controle de estoque." },
    { q: "Gerencio equipe e freelancers?", a: "Sim. Escalas, funções e pagamentos ficam organizados por evento." },
  ],
  seo: {
    title: "Sistema para Empresa de Eventos | Produção e equipes",
    description: "Software para empresa de eventos com produção, equipes, materiais, fornecedores e financeiro.",
    keywords: ["sistema empresa eventos", "software produção eventos", "erp eventos"],
    headline: "O ERP da sua empresa de eventos",
    subheadline: "Produção, equipes, materiais, fornecedores e financeiro integrados.",
  },
};

export const casaFestas: SegmentTemplate = {
  id: "casa-festas",
  label: "Casa de Festas",
  slug: "casa-de-festas",
  icon: "Building2",
  category: "eventos",
  tagline: "Reservas, pacotes e agenda do salão.",
  modules: ["clients", "scheduling", "services", "financial", "team"],
  terms: {
    ...baseTerms,
    appointment: "Reserva",
    appointment_plural: "Reservas",
    service: "Pacote",
    service_plural: "Pacotes",
  },
  customerFields: eventFields,
  defaultServices: [
    { name: "Pacote festa infantil (50 conv.)", price: 3500, durationMin: 0 },
    { name: "Pacote festa adulto (80 conv.)", price: 5500, durationMin: 0 },
    { name: "Locação do salão (sem pacote)", price: 2000, durationMin: 0 },
  ],
  benefits: [
    "Agenda do salão com bloqueio de datas",
    "Pacotes com convidados e serviços inclusos",
    "Orçamentos e contratos digitais",
    "Controle de pagamentos e parcelas",
    "Checklist do dia do evento",
  ],
  faq: [
    { q: "Bloqueio datas no calendário?", a: "Sim. Cada reserva bloqueia a data e você vê a ocupação da agenda." },
    { q: "Monto pacotes por nº de convidados?", a: "Sim. Você cadastra pacotes com faixa de convidados e serviços inclusos." },
  ],
  seo: {
    title: "Sistema para Casa de Festas | Reservas e pacotes",
    description: "Software para casa de festas com reservas, pacotes, agenda, contratos e financeiro.",
    keywords: ["sistema casa de festas", "reservas salão festas", "software festa infantil"],
    headline: "O sistema da sua casa de festas",
    subheadline: "Reservas, pacotes, agenda, contratos e pagamentos.",
  },
};

export const buffet: SegmentTemplate = {
  id: "buffet",
  label: "Buffet",
  slug: "buffet-eventos",
  icon: "Utensils",
  category: "eventos",
  tagline: "Cardápio, produção e eventos.",
  modules: [...baseModules, "inventory"],
  terms: {
    ...baseTerms,
    work_order: "Evento",
    work_order_plural: "Eventos",
    inventory: "Insumos / Estoque",
  },
  customerFields: eventFields,
  defaultServices: [
    { name: "Buffet completo (por convidado)", price: 85, durationMin: 0 },
    { name: "Coquetel (por convidado)", price: 65, durationMin: 0 },
    { name: "Degustação", price: 0, durationMin: 90 },
  ],
  benefits: [
    "Cardápio por evento com ficha técnica",
    "Cálculo por número de convidados",
    "Estoque de insumos e produção",
    "Agenda de degustações e eventos",
    "Equipe de cozinha e custos por evento",
  ],
  faq: [
    { q: "Calculo por convidado?", a: "Sim. O orçamento considera o cardápio e a quantidade de convidados automaticamente." },
    { q: "Tenho ficha técnica?", a: "Sim. Cada item do cardápio tem ingredientes e custo (baixa automática a caminho)." },
  ],
  seo: {
    title: "Sistema para Buffet | Cardápio e produção",
    description: "Software para buffet de eventos com cardápio, ficha técnica, produção, estoque e financeiro.",
    keywords: ["sistema buffet eventos", "software buffet", "cardápio eventos"],
    headline: "O sistema do seu buffet",
    subheadline: "Cardápio, ficha técnica, produção, eventos e financeiro.",
  },
};

export const decoracaoEventos: SegmentTemplate = {
  id: "decoracao-eventos",
  label: "Decoração de Eventos",
  slug: "decoracao-de-eventos",
  icon: "Sparkles",
  category: "eventos",
  tagline: "Projetos, materiais e montagem.",
  modules: [...baseModules, "inventory"],
  terms: {
    ...baseTerms,
    work_order: "Evento",
    work_order_plural: "Eventos",
    inventory: "Decoração / Estoque",
  },
  customerFields: eventFields,
  defaultServices: [
    { name: "Decoração completa", price: 6000, durationMin: 0 },
    { name: "Decoração mesa principal", price: 1500, durationMin: 0 },
    { name: "Projeto 3D / consultoria", price: 800, durationMin: 0 },
  ],
  benefits: [
    "Orçamentos com itens de decoração e adicionais",
    "Reserva de materiais e patrimônio por evento",
    "Cronograma de montagem e desmontagem",
    "Fotos de referência e aprovação do cliente",
    "Financeiro com custos por evento",
  ],
  faq: [
    { q: "Reservo materiais por evento?", a: "Sim. Cada item de decoração fica reservado no estoque para a data do evento." },
    { q: "Cliente aprova o projeto?", a: "Sim. Você envia proposta e registra aprovação (portal do cliente a caminho)." },
  ],
  seo: {
    title: "Sistema para Decoração de Eventos | Projetos e materiais",
    description: "Software para decoração de eventos com orçamentos, materiais, montagem, reservas e financeiro.",
    keywords: ["sistema decoração eventos", "software decorador eventos", "gestão decoração"],
    headline: "O sistema da decoração de eventos",
    subheadline: "Projetos, materiais, montagem, reservas e financeiro.",
  },
};

export const fotografia: SegmentTemplate = {
  id: "fotografia-eventos",
  label: "Fotografia",
  slug: "fotografia-eventos",
  icon: "Camera",
  category: "eventos",
  tagline: "Agenda, pacotes e entrega.",
  modules: ["clients", "scheduling", "services", "financial", "team"],
  terms: {
    ...baseTerms,
    appointment: "Sessão / Evento",
    appointment_plural: "Agenda",
    service: "Pacote",
    service_plural: "Pacotes",
  },
  customerFields: eventFields,
  defaultServices: [
    { name: "Casamento (cobertura completa)", price: 4500, durationMin: 0 },
    { name: "Ensaio pré-wedding", price: 800, durationMin: 120 },
    { name: "Evento corporativo (4h)", price: 1800, durationMin: 0 },
  ],
  benefits: [
    "Agenda de eventos e ensaios",
    "Pacotes com entrega de fotos e prazos",
    "Galeria online para aprovação — a caminho",
    "Contratos e pagamentos por evento",
    "Equipe de fotógrafos e assistentes",
  ],
  faq: [
    { q: "Controlo entrega de fotos?", a: "Sim. Cada pacote tem prazo de entrega e status no cronograma do evento." },
    { q: "Agendo ensaios e eventos?", a: "Sim. A agenda organiza coberturas, ensaios e bloqueio de datas." },
  ],
  seo: {
    title: "Sistema para Fotografia de Eventos | Agenda e pacotes",
    description: "Software para fotógrafo de eventos com agenda, pacotes, entrega, galeria e financeiro.",
    keywords: ["sistema fotografia eventos", "software fotógrafo casamento", "gestão fotografia"],
    headline: "O sistema do fotógrafo de eventos",
    subheadline: "Agenda, pacotes, entrega, galeria e contratos.",
  },
};

export const filmagem: SegmentTemplate = {
  id: "filmagem",
  label: "Filmagem",
  slug: "filmagem-eventos",
  icon: "Video",
  category: "eventos",
  tagline: "Agenda, pacotes e pós-produção.",
  modules: ["clients", "scheduling", "services", "financial", "team"],
  terms: {
    ...baseTerms,
    appointment: "Gravação",
    appointment_plural: "Agenda",
    service: "Pacote",
    service_plural: "Pacotes",
  },
  customerFields: eventFields,
  defaultServices: [
    { name: "Filmagem casamento (completa)", price: 5500, durationMin: 0 },
    { name: "Highlight (3–5 min)", price: 1200, durationMin: 0 },
    { name: "Evento corporativo", price: 2500, durationMin: 0 },
  ],
  benefits: [
    "Agenda de gravações e eventos",
    "Pacotes com entrega e pós-produção",
    "Cronograma do dia da gravação",
    "Contratos e parcelamentos",
    "Equipe de câmera e edição",
  ],
  faq: [
    { q: "Controlo prazos de entrega?", a: "Sim. Cada pacote tem prazo de entrega do vídeo final no cronograma." },
    { q: "Agendo equipe?", a: "Sim. Você escala câmeras, assistentes e editor por evento." },
  ],
  seo: {
    title: "Sistema para Filmagem de Eventos | Agenda e pacotes",
    description: "Software para filmagem de eventos com agenda, pacotes, pós-produção, entrega e financeiro.",
    keywords: ["sistema filmagem eventos", "software videomaker casamento", "gestão filmagem"],
    headline: "O sistema da filmagem de eventos",
    subheadline: "Agenda, pacotes, pós-produção, entrega e contratos.",
  },
};
