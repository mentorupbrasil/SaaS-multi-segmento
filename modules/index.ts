import type { ModuleDef, ModuleId } from "./types";

// Registro central de modulos. Adicionar um modulo novo = adicionar uma entrada aqui.
export const MODULES: Record<ModuleId, ModuleDef> = {
  clients: {
    id: "clients",
    name: "Clientes (CRM)",
    description: "Cadastro de clientes, contatos e historico.",
    nav: [
      {
        href: "/clientes",
        labelKey: "customer_plural",
        fallback: "Clientes",
        icon: "Users",
      },
    ],
  },
  scheduling: {
    id: "scheduling",
    name: "Agendamento",
    description: "Agenda online, horarios e status de atendimento.",
    nav: [
      {
        href: "/agenda",
        labelKey: "appointment_plural",
        fallback: "Agenda",
        icon: "Calendar",
      },
    ],
  },
  services: {
    id: "services",
    name: "Servicos e Precos",
    description: "Catalogo de servicos, precos e duracao.",
    nav: [
      {
        href: "/servicos",
        labelKey: "service_plural",
        fallback: "Servicos",
        icon: "Tag",
      },
    ],
  },
  financial: {
    id: "financial",
    name: "Financeiro",
    description: "Caixa, contas a pagar e receber, fluxo de caixa.",
    nav: [
      {
        href: "/financeiro",
        labelKey: "financial",
        fallback: "Financeiro",
        icon: "Wallet",
      },
    ],
  },
  team: {
    id: "team",
    name: "Equipe e Permissoes",
    description: "Membros da equipe, papeis e permissoes.",
    nav: [
      {
        href: "/equipe",
        labelKey: "team",
        fallback: "Equipe",
        icon: "UserCog",
      },
    ],
  },
  // ---- Modulos avancados (a arquitetura ja suporta; UI completa nas proximas fases) ----
  inventory: {
    id: "inventory",
    name: "Estoque",
    description: "Entrada, saida, inventario e alerta de estoque minimo.",
    comingSoon: true,
    nav: [
      {
        href: "/estoque",
        labelKey: "inventory",
        fallback: "Estoque",
        icon: "Package",
      },
    ],
  },
  work_orders: {
    id: "work_orders",
    name: "Ordens de Servico",
    description: "Abertura, acompanhamento e fechamento de OS.",
    comingSoon: true,
    nav: [
      {
        href: "/ordens-de-servico",
        labelKey: "work_order_plural",
        fallback: "Ordens de Servico",
        icon: "ClipboardList",
      },
    ],
  },
  records: {
    id: "records",
    name: "Prontuario",
    description: "Prontuario e historico do paciente.",
    comingSoon: true,
    nav: [
      {
        href: "/prontuario",
        labelKey: "records",
        fallback: "Prontuario",
        icon: "FileText",
      },
    ],
  },
};

export function getModule(id: ModuleId): ModuleDef {
  return MODULES[id];
}

export const ALL_MODULES: ModuleDef[] = Object.values(MODULES);
