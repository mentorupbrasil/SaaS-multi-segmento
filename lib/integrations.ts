// Integrações da plataforma (página /integracoes).

export type IntegrationStatus = "available" | "soon";

export interface Integration {
  name: string;
  icon: string;
  category: string;
  description: string;
  status: IntegrationStatus;
  /** Disponível no produto, mas liberado conforme o plano (ex.: Profissional+). */
  planGated?: boolean;
}

export const INTEGRATIONS: Integration[] = [
  {
    name: "WhatsApp",
    icon: "MessageCircle",
    category: "Comunicação",
    description: "Envie lembretes, confirmações e mensagens automáticas para os seus clientes.",
    status: "available",
    planGated: true,
  },
  {
    name: "PIX",
    icon: "Wallet",
    category: "Pagamentos",
    description: "Receba por PIX e concilie os pagamentos direto no financeiro.",
    status: "available",
    planGated: true,
  },
  {
    name: "Cartão e pagamentos online",
    icon: "CreditCard",
    category: "Pagamentos",
    description: "Aceite cartão e pagamentos online com baixa automática no caixa.",
    status: "soon",
  },
  {
    name: "Google Agenda",
    icon: "Calendar",
    category: "Produtividade",
    description: "Sincronize os seus agendamentos com o Google Agenda.",
    status: "soon",
  },
  {
    name: "Instagram e Facebook",
    icon: "Sparkles",
    category: "Marketing",
    description: "Receba agendamentos a partir das suas redes sociais.",
    status: "soon",
  },
  {
    name: "Emissão de nota fiscal",
    icon: "FileText",
    category: "Fiscal",
    description: "Emita notas fiscais de serviço integradas à sua operação.",
    status: "soon",
  },
];
