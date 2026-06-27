// Funcionalidades gerais da plataforma (usadas no mega-menu e na pagina /funcionalidades).

export type FeatureStatus = "available" | "soon";

export interface FeatureItem {
  id: string;
  name: string;
  icon: string;
  short: string;
  description: string;
  status: FeatureStatus;
}

export interface FeatureGroup {
  id: string;
  label: string;
  description: string;
  items: FeatureItem[];
}

export const FEATURE_GROUPS: FeatureGroup[] = [
  {
    id: "gestao",
    label: "Gestão do dia a dia",
    description: "O essencial para organizar clientes, agenda e dinheiro.",
    items: [
      {
        id: "clientes",
        name: "Clientes e CRM",
        icon: "Users",
        short: "Cadastro completo e histórico.",
        description:
          "Cadastro completo com histórico de atendimentos, observações e campos específicos do seu segmento. Tudo em um só lugar.",
        status: "available",
      },
      {
        id: "agenda",
        name: "Agenda inteligente",
        icon: "Calendar",
        short: "Horários e status em tempo real.",
        description:
          "Agendamentos por profissional, status de atendimento e visão clara do dia, da semana e do mês.",
        status: "available",
      },
      {
        id: "servicos",
        name: "Serviços e preços",
        icon: "Tag",
        short: "Catálogo com valores e duração.",
        description:
          "Cadastre serviços com preço e tempo de duração. Já vem com sugestões prontas para o seu segmento.",
        status: "available",
      },
      {
        id: "financeiro",
        name: "Financeiro e caixa",
        icon: "Wallet",
        short: "Entradas, saídas e fluxo de caixa.",
        description:
          "Contas a pagar e a receber, controle de caixa e relatórios de faturamento para entender a saúde do negócio.",
        status: "available",
      },
      {
        id: "equipe",
        name: "Equipe e permissões",
        icon: "UserCog",
        short: "Acessos por papel e função.",
        description:
          "Adicione profissionais com diferentes níveis de acesso. Cada um vê apenas o que precisa.",
        status: "available",
      },
    ],
  },
  {
    id: "operacao",
    label: "Operação",
    description: "Recursos que acompanham o crescimento do negócio.",
    items: [
      {
        id: "relatorios",
        name: "Relatórios e painel",
        icon: "LayoutDashboard",
        short: "Indicadores do seu negócio.",
        description:
          "Painel com os números que importam: faturamento, atendimentos, clientes e desempenho da equipe.",
        status: "available",
      },
      {
        id: "ordens",
        name: "Ordens de serviço",
        icon: "ClipboardList",
        short: "Acompanhe cada serviço.",
        description:
          "Abra, acompanhe e finalize ordens de serviço com itens, status e histórico — ideal para oficinas e assistências.",
        status: "available",
      },
      {
        id: "estoque",
        name: "Estoque e produtos",
        icon: "Package",
        short: "Controle de produtos e peças.",
        description:
          "Controle de entrada e saída de produtos, alertas de estoque baixo e custo por item.",
        status: "soon",
      },
      {
        id: "vendas",
        name: "Vendas e PDV",
        icon: "CreditCard",
        short: "Venda de produtos e pacotes.",
        description:
          "Frente de caixa para vender produtos, pacotes e serviços avulsos com poucos cliques.",
        status: "soon",
      },
    ],
  },
  {
    id: "tecnologia",
    label: "Inteligência e tecnologia",
    description: "O que coloca o seu negócio à frente.",
    items: [
      {
        id: "ia",
        name: "Inteligência artificial",
        icon: "Sparkles",
        short: "Sugestões e insights automáticos.",
        description:
          "Resumos do dia, sugestões de horários e insights sobre clientes que ajudam a tomar decisões melhores.",
        status: "soon",
      },
      {
        id: "automacoes",
        name: "Automações",
        icon: "Zap",
        short: "Lembretes e mensagens automáticas.",
        description:
          "Lembretes de agendamento, mensagens de aniversário e confirmações automáticas por WhatsApp.",
        status: "soon",
      },
      {
        id: "app",
        name: "Aplicativo",
        icon: "Smartphone",
        short: "Seu negócio no bolso.",
        description:
          "Acesse a agenda, os clientes e o caixa pelo celular, a qualquer hora e de qualquer lugar.",
        status: "soon",
      },
      {
        id: "integracoes",
        name: "Integrações",
        icon: "Layers",
        short: "Conecte com as ferramentas que usa.",
        description:
          "WhatsApp, PIX, pagamentos online, Google Agenda e mais. Conecte o que você já usa no dia a dia.",
        status: "soon",
      },
    ],
  },
];

export const ALL_FEATURES: FeatureItem[] = FEATURE_GROUPS.flatMap((g) => g.items);
