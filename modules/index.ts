import type { ModuleDef, ModuleId } from "./types";

// Registro central de módulos. Adicionar um módulo novo = adicionar uma entrada aqui.
export const MODULES: Record<ModuleId, ModuleDef> = {
  clients: {
    id: "clients",
    name: "Clientes (CRM)",
    description: "Cadastro completo com contatos, histórico de atendimentos e campos do seu segmento.",
    nav: [
      { href: "/clientes", labelKey: "customer_plural", fallback: "Clientes", icon: "Users" },
    ],
  },
  scheduling: {
    id: "scheduling",
    name: "Agendamento",
    description: "Agenda online por profissional, com horários, status e confirmação de atendimento.",
    nav: [
      { href: "/agenda", labelKey: "appointment_plural", fallback: "Agenda", icon: "Calendar" },
    ],
  },
  services: {
    id: "services",
    name: "Serviços e Preços",
    description: "Catálogo de serviços com preço e duração, pronto para usar na agenda e no caixa.",
    nav: [
      { href: "/servicos", labelKey: "service_plural", fallback: "Serviços", icon: "Tag" },
    ],
  },
  financial: {
    id: "financial",
    name: "Financeiro",
    description: "Caixa, contas a pagar e receber, fluxo de caixa e relatório de faturamento.",
    nav: [
      { href: "/financeiro", labelKey: "financial", fallback: "Financeiro", icon: "Wallet" },
    ],
  },
  team: {
    id: "team",
    name: "Equipe e Permissões",
    description: "Membros da equipe com papéis e níveis de acesso diferentes.",
    nav: [
      { href: "/equipe", labelKey: "team", fallback: "Equipe", icon: "UserCog" },
    ],
  },
  // ---- Módulos avançados (a arquitetura já suporta; UI completa nas próximas fases) ----
  inventory: {
    id: "inventory",
    name: "Estoque",
    description: "Entrada, saída, inventário e alerta de estoque mínimo dos seus produtos.",
    comingSoon: true,
    nav: [
      { href: "/estoque", labelKey: "inventory", fallback: "Estoque", icon: "Package" },
    ],
  },
  work_orders: {
    id: "work_orders",
    name: "Ordens de Serviço",
    description: "Abertura, acompanhamento e fechamento de OS, com itens, mão de obra e histórico.",
    comingSoon: true,
    nav: [
      { href: "/ordens-de-servico", labelKey: "work_order_plural", fallback: "Ordens de Serviço", icon: "ClipboardList" },
    ],
  },
  records: {
    id: "records",
    name: "Prontuário",
    description: "Prontuário e histórico detalhado por cliente, com anotações e evolução.",
    comingSoon: true,
    nav: [
      { href: "/prontuario", labelKey: "records", fallback: "Prontuário", icon: "FileText" },
    ],
  },
};

export function getModule(id: ModuleId): ModuleDef {
  return MODULES[id];
}

export const ALL_MODULES: ModuleDef[] = Object.values(MODULES);
