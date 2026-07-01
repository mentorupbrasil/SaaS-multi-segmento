// Integrações da plataforma — página /integracoes e vitrine na home.

export type IntegrationGroupId =
  | "comunicacao"
  | "pagamentos"
  | "produtividade"
  | "fiscal"
  | "hospedagem"
  | "marketing";

export interface IntegrationGroup {
  id: IntegrationGroupId;
  label: string;
  icon: string;
}

export interface Integration {
  id: string;
  name: string;
  icon: string;
  group: IntegrationGroupId;
  category: string;
  description: string;
  /** Texto curto do plano mínimo (ex.: "Profissional+"). */
  planLabel: string;
  highlights: string[];
}

export const INTEGRATION_GROUPS: IntegrationGroup[] = [
  { id: "comunicacao", label: "Comunicação", icon: "MessageCircle" },
  { id: "pagamentos", label: "Pagamentos", icon: "CreditCard" },
  { id: "produtividade", label: "Produtividade", icon: "Calendar" },
  { id: "fiscal", label: "Fiscal", icon: "FileText" },
  { id: "hospedagem", label: "Hospedagem", icon: "Globe" },
  { id: "marketing", label: "Marketing", icon: "Sparkles" },
];

export const INTEGRATIONS: Integration[] = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: "MessageCircle",
    group: "comunicacao",
    category: "Comunicação",
    description:
      "Lembretes, confirmações e mensagens automáticas para reduzir faltas e manter o cliente informado.",
    planLabel: "Profissional+",
    highlights: ["Confirmação de agendamento", "Lembretes automáticos", "Ativação em Conexões"],
  },
  {
    id: "pix",
    name: "PIX",
    icon: "Wallet",
    group: "pagamentos",
    category: "Pagamentos",
    description:
      "Receba PIX dos seus clientes e registre no financeiro com conciliação integrada ao caixa.",
    planLabel: "Profissional+",
    highlights: ["Baixa no financeiro", "Chave ou provedor", "Painel Conexões"],
  },
  {
    id: "mercadopago",
    name: "Mercado Pago",
    icon: "CreditCard",
    group: "pagamentos",
    category: "Pagamentos",
    description:
      "Cobranças online, links de pagamento e webhook para atualizar o status automaticamente.",
    planLabel: "Profissional+",
    highlights: ["Cartão e boleto", "Webhook configurável", "Conciliação no caixa"],
  },
  {
    id: "asaas",
    name: "Asaas",
    icon: "Receipt",
    group: "pagamentos",
    category: "Pagamentos",
    description:
      "Assinatura do GestorPro com PIX, boleto ou cartão. Renovação mensal automática e notificações.",
    planLabel: "Todos os planos",
    highlights: ["PIX, boleto e cartão", "Cobrança recorrente", "Webhook de confirmação"],
  },
  {
    id: "google_calendar",
    name: "Google Agenda",
    icon: "Calendar",
    group: "produtividade",
    category: "Produtividade",
    description:
      "Sincronize agendamentos do painel com o Google Calendar da equipe em tempo real.",
    planLabel: "Profissional+",
    highlights: ["Sync bidirecional", "Por profissional", "OAuth Google"],
  },
  {
    id: "public_booking",
    name: "Agendamento online",
    icon: "Share2",
    group: "produtividade",
    category: "Produtividade",
    description:
      "Link público para o cliente agendar sozinho — /agendar/seu-slug, sem precisar ligar ou mandar mensagem.",
    planLabel: "Profissional+",
    highlights: ["Link personalizado", "Horários em tempo real", "Captação 24h"],
  },
  {
    id: "nfe",
    name: "NF-e / NFC-e",
    icon: "FileText",
    group: "fiscal",
    category: "Fiscal",
    description:
      "Emissão fiscal integrada com certificado A1, configuração em Fiscal e envio à SEFAZ.",
    planLabel: "Profissional+",
    highlights: ["Certificado A1", "NF-e e NFC-e", "Painel Fiscal"],
  },
  {
    id: "channel_manager",
    name: "Channel Manager",
    icon: "Globe",
    group: "hospedagem",
    category: "Hospedagem",
    description:
      "Sincronize tarifas e disponibilidade com OTAs como Booking e Airbnb a partir do módulo de tarifas.",
    planLabel: "Premium+",
    highlights: ["OTAs conectadas", "Tarifas centralizadas", "Menos overbooking"],
  },
  {
    id: "instagram",
    name: "Instagram e Facebook",
    icon: "Sparkles",
    group: "marketing",
    category: "Marketing",
    description:
      "Receba leads e agendamentos vindos das redes sociais direto no funil do GestorPro.",
    planLabel: "Profissional+",
    highlights: ["Captação social", "Agenda unificada", "Conexões no painel"],
  },
  {
    id: "export",
    name: "Exportação de dados",
    icon: "Printer",
    group: "produtividade",
    category: "Produtividade",
    description:
      "Exporte clientes, financeiro, agenda e outros módulos em CSV ou Excel para análise externa.",
    planLabel: "Profissional+",
    highlights: ["CSV e Excel", "Por módulo ativo", "Backup operacional"],
  },
];

export function getIntegrationTotal(): number {
  return INTEGRATIONS.length;
}

export function filterIntegrations(query: string, groupId?: IntegrationGroupId): Integration[] {
  const q = query.trim().toLowerCase();
  let list = INTEGRATIONS;
  if (groupId) {
    list = list.filter((i) => i.group === groupId);
  }
  if (!q) return list;
  return list.filter(
    (i) =>
      i.name.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q) ||
      i.highlights.some((h) => h.toLowerCase().includes(q)),
  );
}
