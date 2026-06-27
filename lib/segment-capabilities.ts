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

const ALIMENTACAO: SegmentExtras = {
  intro:
    "Uma operação completa do pedido ao financeiro — do pequeno estabelecimento às grandes redes de alimentação.",
  groups: [
    {
      id: "pdv",
      title: "PDV (frente de caixa)",
      icon: "CreditCard",
      items: [
        a("Comanda / pedido eletrônico"),
        a("Venda por mesa e balcão"),
        s("Venda rápida (PDV dedicado)"),
        s("Divisão de conta e pagamento parcial"),
        s("PIX, cartão e dinheiro integrados"),
        s("Cashback e vale-presente"),
      ],
    },
    {
      id: "mesas",
      title: "Gestão de mesas",
      icon: "UtensilsCrossed",
      items: [
        s("Mapa do salão e status das mesas"),
        s("Reserva e lista de espera"),
        s("Transferência e junção de mesas"),
        s("Tempo de permanência"),
      ],
    },
    {
      id: "cardapio",
      title: "Cardápio digital",
      icon: "QrCode",
      items: [
        a("Categorias e produtos"),
        a("Preços sempre atualizados"),
        s("QR Code com fotos"),
        s("Adicionais, combos e promoções"),
        s("Disponibilidade em tempo real"),
      ],
    },
    {
      id: "pedidos",
      title: "Pedidos",
      icon: "Receipt",
      items: [
        a("Balcão e mesa"),
        s("Delivery e retirada"),
        s("Garçom via celular / tablet"),
        s("Autoatendimento (totem)"),
        s("Aplicativo próprio"),
      ],
    },
    {
      id: "kds",
      title: "Cozinha (KDS)",
      icon: "ChefHat",
      items: [
        s("Painel de produção e fila de pedidos"),
        s("Tempo de preparo e prioridade"),
        s("Status do pedido"),
        s("Impressão por setor (cozinha, bar, pizzaria)"),
      ],
    },
    {
      id: "delivery",
      title: "Delivery",
      icon: "Bike",
      items: [
        s("Entregadores e controle de rotas"),
        s("Rastreamento em tempo real"),
        s("Taxa de entrega e tempo estimado"),
        s("Histórico e avaliação"),
      ],
    },
    {
      id: "estoque",
      title: "Estoque e ficha técnica",
      icon: "Boxes",
      items: [
        a("Entrada e saída"),
        a("Inventário e estoque mínimo"),
        s("Ficha técnica com custo e rendimento"),
        s("Baixa automática por venda"),
        s("Perdas, validade e produção"),
        s("Compras e fornecedores"),
      ],
    },
    {
      id: "financeiro",
      title: "Financeiro",
      icon: "Wallet",
      items: [
        a("Fluxo de caixa"),
        a("Contas a pagar e a receber"),
        a("Fechamento diário"),
        s("DRE e centros de custo"),
        s("Conciliação bancária"),
        s("CMV (custo da mercadoria vendida)"),
      ],
    },
    {
      id: "crm",
      title: "Clientes (CRM)",
      icon: "Users",
      items: [
        a("Histórico e pedidos anteriores"),
        a("Preferências e observações"),
        s("Fidelidade, cashback e pontuação"),
        s("Cupons e aniversariantes"),
      ],
    },
    {
      id: "funcionarios",
      title: "Funcionários",
      icon: "UserCog",
      items: [
        a("Garçom, cozinha, caixa e gerência"),
        a("Papéis e permissões"),
        s("Escalas e metas"),
        s("Comissão, gorjetas e produtividade"),
      ],
    },
  ],
  premium: [
    {
      id: "autoatendimento",
      title: "Autoatendimento",
      icon: "QrCode",
      items: [s("Totem"), s("Tablet na mesa"), s("QR Code"), s("Pedido pelo celular")],
    },
    {
      id: "ia",
      title: "Inteligência artificial",
      icon: "Bot",
      items: [
        s("Previsão de demanda e de faturamento"),
        s("Sugestão de compras e de promoções"),
        s("Previsão de estoque"),
        s("Análise de desperdício"),
      ],
    },
    {
      id: "marketing",
      title: "Marketing",
      icon: "Megaphone",
      items: [
        s("WhatsApp, SMS e e-mail"),
        s("Cupons automáticos"),
        s("Clientes inativos"),
        s("Promoções por horário e fidelidade"),
      ],
    },
    {
      id: "unidades",
      title: "Múltiplas unidades",
      icon: "Building2",
      items: [
        s("Franquias e comparativo"),
        s("Estoque central e transferências"),
        s("Gestão centralizada"),
      ],
    },
    {
      id: "app-cliente",
      title: "Aplicativo do cliente",
      icon: "Smartphone",
      items: [
        s("Cardápio, pedido e pagamento"),
        s("Rastreamento do pedido"),
        s("Cashback, fidelidade e histórico"),
        s("Avaliações"),
      ],
    },
    {
      id: "delivery-proprio",
      title: "Delivery próprio",
      icon: "Bike",
      items: [
        s("Aplicativo do entregador"),
        s("Rastreamento em tempo real"),
        s("Controle de rotas e entregas"),
      ],
    },
  ],
  dashboards: [
    "Faturamento diário e ticket médio",
    "Lucro, margem e CMV",
    "Pedidos por hora",
    "Tempo médio de preparo e de entrega",
    "Produtos mais vendidos",
    "Ingredientes mais consumidos",
    "Desperdício",
    "Clientes recorrentes",
    "Ocupação das mesas",
    "Vendas por garçom e por unidade",
    "Ranking de produtos",
    "Fluxo de caixa",
  ],
  integrations: [
    { label: "PIX", icon: "Wallet" },
    { label: "Cartões", icon: "CreditCard" },
    { label: "NFC-e / NFS-e", icon: "FileText" },
    { label: "Impressoras térmicas", icon: "Receipt" },
    { label: "Balanças", icon: "Scale" },
    { label: "WhatsApp", icon: "MessageCircle" },
    { label: "Google Maps", icon: "MapPin" },
    { label: "iFood, Uber Eats e Rappi", icon: "Bike" },
    { label: "Contabilidade / ERP", icon: "Layers" },
  ],
  differentials: [
    "Cardápio digital inteligente com QR Code",
    "Painel de cozinha (KDS) totalmente integrado",
    "Autoatendimento por QR Code, tablet e totem",
    "Delivery próprio com rastreamento em tempo real",
    "Controle automático de estoque pelas fichas técnicas",
    "IA para previsão de demanda, compras e desperdício",
    "Gestão completa de mesas e reservas",
    "CRM com fidelidade, cashback e campanhas automáticas",
    "Business Intelligence (BI) em tempo real",
    "Gestão de franquias e múltiplas unidades",
    "Apps próprios para clientes, garçons e entregadores",
    "Controle de custos e CMV para maximizar a lucratividade",
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
  alimentacao: ALIMENTACAO,
};

export function getSegmentExtras(category: SegmentCategory): SegmentExtras {
  return BY_CATEGORY[category] ?? DEFAULT_EXTRAS;
}
