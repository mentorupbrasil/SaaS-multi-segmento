// Catalogo de capacidades por categoria de segmento.
// status: "available" = ja funciona no sistema | "soon" = no roadmap (em construcao).
import type { SegmentCategory } from "@/segments/types";

export type CapStatus = "available" | "soon";

export interface CapItem {
  label: string;
  status: CapStatus;
}

export interface CapGroup {
  id: string;
  title: string;
  icon: string;
  items: CapItem[];
}

export interface IntegrationRef {
  label: string;
  icon: string;
}

export interface SegmentExtras {
  intro: string;
  groups: CapGroup[];
  premium: CapGroup[];
  dashboards: string[];
  integrations: IntegrationRef[];
  differentials: string[];
}

const a = (label: string): CapItem => ({ label, status: "available" });
const s = (label: string): CapItem => ({ label, status: "soon" });

const BELEZA: SegmentExtras = {
  intro:
    "Um conjunto premium de funcionalidades para profissionais e negócios de beleza e estética — do autônomo às redes e franquias.",
  groups: [
    {
      id: "agenda",
      title: "Agenda inteligente",
      icon: "Calendar",
      items: [
        a("Agenda por profissional"),
        a("Bloqueio de horários"),
        a("Reagendamento fácil"),
        s("Agenda por sala / cabine"),
        s("Agendamento online (link do cliente)"),
        s("Confirmação automática"),
        s("Lista de espera"),
        s("Recorrência de horários"),
      ],
    },
    {
      id: "crm",
      title: "Clientes (CRM)",
      icon: "Users",
      items: [
        a("Histórico completo de atendimentos"),
        a("Preferências e observações"),
        a("Anamnese e alergias"),
        a("Campos próprios do segmento"),
        s("Fotos antes/depois"),
        s("Documentos e consentimentos digitais"),
      ],
    },
    {
      id: "servicos",
      title: "Serviços",
      icon: "Tag",
      items: [
        a("Cadastro ilimitado"),
        a("Tempo de execução e valor"),
        a("Profissional habilitado"),
        s("Materiais utilizados por serviço"),
        s("Comissão por serviço"),
        s("Pacotes, combos e assinaturas"),
      ],
    },
    {
      id: "financeiro",
      title: "Financeiro",
      icon: "Wallet",
      items: [
        a("Caixa diário"),
        a("Contas a pagar e a receber"),
        a("Fluxo de caixa"),
        a("Controle de inadimplência"),
        s("PIX e cartão integrados"),
        s("Parcelamento e carnê"),
        s("Cashback e vale-presente"),
      ],
    },
    {
      id: "comissao",
      title: "Comissão",
      icon: "Percent",
      items: [
        s("Comissão por serviço"),
        s("Comissão por produto"),
        s("Comissão variável e metas"),
        s("Ranking de profissionais"),
        s("Fechamento automático"),
      ],
    },
    {
      id: "estoque",
      title: "Estoque",
      icon: "Boxes",
      items: [
        s("Entrada e saída"),
        s("Inventário e estoque mínimo"),
        s("Validade e lote"),
        s("Baixa por atendimento"),
        s("Compras e fornecedores"),
      ],
    },
    {
      id: "vendas",
      title: "Vendas e PDV",
      icon: "ShoppingCart",
      items: [
        s("Venda de produtos e kits"),
        s("Combos e pacotes"),
        s("Vale-presente"),
        s("Assinaturas"),
        s("PDV completo"),
      ],
    },
    {
      id: "marketing",
      title: "Marketing e fidelização",
      icon: "Megaphone",
      items: [
        s("WhatsApp, SMS e e-mail"),
        s("Campanhas automáticas"),
        s("Aniversariantes e clientes inativos"),
        s("Cupons e programa de fidelidade"),
        s("Indicação de clientes"),
      ],
    },
    {
      id: "profissionais",
      title: "Profissionais",
      icon: "UserCog",
      items: [
        a("Agenda individual"),
        a("Papéis e permissões"),
        s("Escala, jornada e folgas"),
        s("Metas individuais"),
        s("Produtividade"),
      ],
    },
    {
      id: "unidades",
      title: "Múltiplas unidades",
      icon: "Building2",
      items: [
        s("Franquias e filiais"),
        s("Controle centralizado"),
        s("Comparativo entre unidades"),
        s("Transferência de estoque"),
      ],
    },
  ],
  premium: [
    {
      id: "ia",
      title: "Inteligência artificial",
      icon: "Bot",
      items: [
        s("Sugestão automática de horários"),
        s("Previsão de faltas (no-show)"),
        s("Sugestão de serviços e produtos"),
        s("Chatbot e atendimento automático"),
      ],
    },
    {
      id: "app-cliente",
      title: "Aplicativo do cliente",
      icon: "Smartphone",
      items: [
        s("Agendar, cancelar e reagendar"),
        s("Histórico e carteira"),
        s("Cashback e pontos"),
        s("Avaliação e chat"),
      ],
    },
    {
      id: "area-prof",
      title: "Área do profissional",
      icon: "GanttChartSquare",
      items: [
        s("Agenda e clientes"),
        s("Comissão e metas"),
        s("Fotos e relatórios"),
      ],
    },
    {
      id: "fotos",
      title: "Fotos e evolução",
      icon: "Camera",
      items: [
        s("Antes e depois"),
        s("Comparação e álbuns"),
        s("Linha do tempo de evolução"),
      ],
    },
    {
      id: "assinaturas",
      title: "Assinaturas",
      icon: "Repeat",
      items: [
        s("Plano mensal e anual"),
        s("Renovação automática"),
        s("Cobrança recorrente"),
      ],
    },
    {
      id: "documentos",
      title: "Documentos",
      icon: "FileSignature",
      items: [
        s("Assinatura digital"),
        s("Termos de consentimento (LGPD)"),
        s("Contratos"),
      ],
    },
  ],
  dashboards: [
    "Faturamento diário e mensal",
    "Ticket médio",
    "Clientes novos e recorrentes",
    "Taxa de retorno e no-show",
    "Ocupação da agenda",
    "Serviços e produtos mais vendidos",
    "Profissionais mais produtivos",
    "Comissão, lucro e margem",
    "Clientes inativos",
    "NPS (satisfação)",
  ],
  integrations: [
    { label: "WhatsApp", icon: "MessageCircle" },
    { label: "Instagram", icon: "Sparkles" },
    { label: "Google Agenda", icon: "Calendar" },
    { label: "Google Maps", icon: "Globe" },
    { label: "PIX", icon: "Wallet" },
    { label: "Cartão e maquininhas", icon: "CreditCard" },
    { label: "NF-e / NFS-e", icon: "FileText" },
    { label: "Contabilidade / ERP", icon: "Layers" },
  ],
  differentials: [
    "Agenda com IA que otimiza os horários automaticamente",
    "Confirmação por WhatsApp com respostas inteligentes",
    "Reconhecimento facial do cliente no check-in",
    "Análise de rentabilidade por profissional, serviço e cabine",
    "Previsão de faturamento dos próximos dias",
    "Business Intelligence (BI) em tempo real",
    "Programa de fidelidade e CRM com marketing automático",
    "Estoque vinculado ao consumo por procedimento",
    "Prontuário estético digital com fotos e documentos assinados",
    "Gestão de franquias e múltiplas unidades",
    "Aplicativo próprio para clientes e profissionais",
  ],
};

// Conjunto generico para os demais segmentos (ate serem detalhados como Beleza).
const DEFAULT_EXTRAS: SegmentExtras = {
  intro:
    "Funcionalidades para organizar a operação do seu negócio, com novos recursos chegando continuamente.",
  groups: [
    {
      id: "agenda",
      title: "Agenda",
      icon: "Calendar",
      items: [a("Agenda por profissional"), a("Bloqueio de horários"), a("Reagendamento"), s("Agendamento online")],
    },
    {
      id: "crm",
      title: "Clientes (CRM)",
      icon: "Users",
      items: [a("Histórico completo"), a("Campos do segmento"), a("Observações"), s("Fotos e documentos")],
    },
    {
      id: "financeiro",
      title: "Financeiro",
      icon: "Wallet",
      items: [a("Caixa"), a("Contas a pagar e receber"), a("Fluxo de caixa"), s("Pagamentos integrados")],
    },
  ],
  premium: [
    { id: "ia", title: "Inteligência artificial", icon: "Bot", items: [s("Insights e sugestões"), s("Previsões")] },
    { id: "app", title: "Aplicativo", icon: "Smartphone", items: [s("Acesso pelo celular")] },
  ],
  dashboards: ["Faturamento", "Atendimentos", "Clientes novos e recorrentes", "Ticket médio"],
  integrations: [
    { label: "WhatsApp", icon: "MessageCircle" },
    { label: "PIX", icon: "Wallet" },
    { label: "Cartão", icon: "CreditCard" },
  ],
  differentials: [
    "Plataforma que se adapta ao seu segmento",
    "Dados isolados e seguros",
    "Acesso de qualquer lugar",
  ],
};

const BY_CATEGORY: Partial<Record<SegmentCategory, SegmentExtras>> = {
  beleza: BELEZA,
};

export function getSegmentExtras(category: SegmentCategory): SegmentExtras {
  return BY_CATEGORY[category] ?? DEFAULT_EXTRAS;
}
