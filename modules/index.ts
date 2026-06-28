import type { ModuleDef, ModuleId } from "./types";

export const MODULES: Record<ModuleId, ModuleDef> = {
  clients: {
    id: "clients",
    name: "Clientes (CRM)",
    description: "Cadastro completo com contatos, histórico de atendimentos e campos do seu segmento.",
    nav: [{ href: "/clientes", labelKey: "customer_plural", fallback: "Clientes", icon: "Users" }],
  },
  scheduling: {
    id: "scheduling",
    name: "Agendamento",
    description: "Agenda online por profissional, com horários, status e confirmação de atendimento.",
    nav: [
      { href: "/agenda", labelKey: "appointment_plural", fallback: "Agenda", icon: "Calendar" },
      { href: "/agenda/calendario", labelKey: "calendar", fallback: "Calendário", icon: "CalendarCheck" },
      { href: "/pacotes", labelKey: "package_plural", fallback: "Pacotes", icon: "Package" },
    ],
  },
  services: {
    id: "services",
    name: "Serviços e Preços",
    description: "Catálogo de serviços com preço e duração.",
    nav: [{ href: "/servicos", labelKey: "service_plural", fallback: "Serviços", icon: "Tag" }],
  },
  financial: {
    id: "financial",
    name: "Financeiro",
    description: "Caixa, contas a pagar e receber, fluxo de caixa.",
    nav: [
      { href: "/financeiro", labelKey: "financial", fallback: "Financeiro", icon: "Wallet" },
      { href: "/caixa", labelKey: "cash_register", fallback: "Caixa", icon: "CreditCard" },
      { href: "/relatorios", labelKey: "reports", fallback: "Relatórios", icon: "BarChart3" },
    ],
  },
  team: {
    id: "team",
    name: "Equipe e Permissões",
    description: "Membros da equipe com papéis e níveis de acesso.",
    nav: [{ href: "/equipe", labelKey: "team", fallback: "Equipe", icon: "UserCog" }],
  },
  inventory: {
    id: "inventory",
    name: "Estoque",
    description: "Entrada, saída, inventário e alerta de estoque mínimo.",
    nav: [{ href: "/estoque", labelKey: "inventory", fallback: "Estoque", icon: "Package" }],
  },
  work_orders: {
    id: "work_orders",
    name: "Ordens de Serviço",
    description: "Abertura, acompanhamento e fechamento de OS com itens e peças.",
    nav: [
      {
        href: "/ordens-de-servico",
        labelKey: "work_order_plural",
        fallback: "Ordens de Serviço",
        icon: "ClipboardList",
      },
      { href: "/comissoes", labelKey: "commission_plural", fallback: "Comissões", icon: "Percent" },
    ],
  },
  records: {
    id: "records",
    name: "Prontuário",
    description: "Prontuário e histórico detalhado por cliente.",
    nav: [{ href: "/prontuario", labelKey: "records", fallback: "Prontuário", icon: "FileText" }],
  },
  quotes: {
    id: "quotes",
    name: "Orçamentos",
    description: "Propostas com itens e conversão em ordem de serviço ou venda.",
    nav: [{ href: "/orcamentos", labelKey: "quote_plural", fallback: "Orçamentos", icon: "Receipt" }],
  },
  suppliers: {
    id: "suppliers",
    name: "Fornecedores",
    description: "Cadastro de fornecedores e histórico de compras.",
    nav: [{ href: "/fornecedores", labelKey: "supplier_plural", fallback: "Fornecedores", icon: "Truck" }],
  },
  vehicles: {
    id: "vehicles",
    name: "Veículos",
    description: "Cadastro de veículos vinculados ao cliente com histórico.",
    nav: [{ href: "/veiculos", labelKey: "vehicle_plural", fallback: "Veículos", icon: "Car" }],
  },
  pets: {
    id: "pets",
    name: "Pets",
    description: "Cadastro de pets vinculados ao tutor.",
    nav: [
      { href: "/pets", labelKey: "pet_plural", fallback: "Pets", icon: "PawPrint" },
      { href: "/vacinas", labelKey: "vaccination_plural", fallback: "Vacinas", icon: "Syringe" },
    ],
  },
  pdv: {
    id: "pdv",
    name: "PDV / Vendas",
    description: "Ponto de venda com comanda, mesa e balcão.",
    nav: [{ href: "/pdv", labelKey: "pdv", fallback: "PDV", icon: "ShoppingCart" }],
  },
  rooms: {
    id: "rooms",
    name: "Quartos",
    description: "Cadastro de quartos, tipos e status.",
    nav: [{ href: "/quartos", labelKey: "room_plural", fallback: "Quartos", icon: "Bed" }],
  },
  reservations: {
    id: "reservations",
    name: "Reservas",
    description: "Reservas, check-in e check-out.",
    nav: [{ href: "/reservas", labelKey: "reservation_plural", fallback: "Reservas", icon: "CalendarCheck" }],
  },
  events: {
    id: "events",
    name: "Eventos",
    description: "Gestão de eventos, cronograma e produção.",
    nav: [{ href: "/eventos", labelKey: "event_plural", fallback: "Eventos", icon: "PartyPopper" }],
  },
  donations: {
    id: "donations",
    name: "Doações",
    description: "Registro de doações e entradas.",
    nav: [{ href: "/doacoes", labelKey: "donation_plural", fallback: "Doações", icon: "Heart" }],
  },
  groups: {
    id: "groups",
    name: "Grupos",
    description: "Ministérios, departamentos e equipes.",
    nav: [{ href: "/grupos", labelKey: "group_plural", fallback: "Grupos", icon: "UsersRound" }],
  },
  education: {
    id: "education",
    name: "Educação",
    description: "Turmas, matrículas e controle de frequência.",
    nav: [
      { href: "/turmas", labelKey: "class_plural", fallback: "Turmas", icon: "GraduationCap" },
      { href: "/matriculas", labelKey: "enrollment_plural", fallback: "Matrículas", icon: "UserPlus" },
      { href: "/frequencia", labelKey: "attendance", fallback: "Frequência", icon: "ClipboardCheck" },
    ],
  },
  housekeeping: {
    id: "housekeeping",
    name: "Governança",
    description: "Checklist de limpeza e status dos quartos.",
    nav: [{ href: "/governanca", labelKey: "housekeeping", fallback: "Governança", icon: "Sparkles" }],
  },
  kitchen: {
    id: "kitchen",
    name: "Cozinha",
    description: "Painel de produção e pedidos da cozinha (KDS).",
    nav: [{ href: "/cozinha", labelKey: "kitchen", fallback: "Cozinha", icon: "ChefHat" }],
  },
};

export function getModule(id: ModuleId): ModuleDef {
  return MODULES[id];
}

export const ALL_MODULES: ModuleDef[] = Object.values(MODULES);
