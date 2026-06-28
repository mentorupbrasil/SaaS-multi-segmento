import type { SegmentTemplate } from "./types";

// Sub-nichos de Comercio (parte 2).

const baseTerms = {
  customer: "Cliente",
  customer_plural: "Clientes",
  professional: "Vendedor",
  professional_plural: "Vendedores",
  service: "Produto",
  service_plural: "Produtos",
  inventory: "Estoque",
};

const baseModules = ["clients", "services", "inventory", "financial", "team"] as const;
const noScheduling = { excludeModules: ["scheduling"] as const };

export const lojaUtilidades: SegmentTemplate = {
  id: "loja-utilidades",
  label: "Utilidades Domésticas",
  slug: "utilidades-domesticas",
  icon: "Home",
  category: "comercio",
  tagline: "PDV, categorias e estoque.",
  modules: [...baseModules],
  terms: baseTerms,
  customerFields: [
    { key: "categoria_interesse", label: "Categoria de interesse", type: "text", placeholder: "Ex.: cozinha, banheiro" },
  ],
  defaultServices: [
    { name: "Panela antiaderente", price: 89, durationMin: 0 },
    { name: "Jogo de copos", price: 45, durationMin: 0 },
    { name: "Organizador", price: 35, durationMin: 0 },
  ],
  benefits: [
    "PDV rápido com categorias",
    "Controle de estoque com estoque mínimo",
    "Promoções e combos",
    "Caixa e fechamento diário",
    "Relatórios de produtos parados",
  ],
  faq: [
    { q: "Organizo por categorias?", a: "Sim. Você cadastra categorias para agilizar o PDV e os relatórios." },
    { q: "Vejo produtos parados?", a: "Sim. Os relatórios ajudam a identificar produtos com baixo giro (curva ABC a caminho)." },
  ],
  seo: {
    title: "Sistema para Loja de Utilidades Domésticas | PDV e estoque",
    description: "Software para loja de utilidades domésticas com PDV, categorias, estoque e financeiro.",
    keywords: ["sistema utilidades domésticas", "pdv utilidades", "estoque loja"],
    headline: "O sistema da sua loja de utilidades",
    subheadline: "PDV, categorias, estoque e relatórios de vendas.",
  },
};

export const lojaFerragens: SegmentTemplate = {
  id: "loja-ferragens",
  label: "Loja de Ferragens",
  slug: "loja-de-ferragens",
  icon: "Hammer",
  category: "comercio",
  tagline: "PDV, peças, peso e estoque.",
  modules: [...baseModules],
  ...noScheduling,
  terms: baseTerms,
  customerFields: [
    { key: "tipo_obra", label: "Tipo de obra", type: "select", options: ["Reforma", "Construção", "Manutenção"] },
    { key: "cnpj", label: "CNPJ (PJ)", type: "text" },
  ],
  defaultServices: [
    { name: "Parafuso (cx)", price: 12, durationMin: 0 },
    { name: "Tinta 18L", price: 189, durationMin: 0 },
    { name: "Ferramenta manual", price: 79, durationMin: 0 },
  ],
  benefits: [
    "PDV com venda por unidade e por peso — a caminho",
    "Categorias por departamento (ferramentas, tintas, elétrica)",
    "Controle de estoque com inventário",
    "Orçamentos para obras e reformas",
    "Financeiro com parcelamento",
  ],
  faq: [
    { q: "Vendo por unidade e por peso?", a: "Sim. Você cadastra produtos por unidade; integração com balança a caminho." },
    { q: "Faço orçamentos?", a: "Sim. Você monta orçamentos para clientes de obra e converte em venda." },
  ],
  seo: {
    title: "Sistema para Loja de Ferragens | PDV e estoque",
    description: "Software para loja de ferragens com PDV, categorias, orçamentos, estoque e financeiro.",
    keywords: ["sistema para ferragens", "pdv ferragens", "estoque ferramentas"],
    headline: "O sistema da sua loja de ferragens",
    subheadline: "PDV, categorias, orçamentos, estoque e financeiro.",
  },
};

export const autopecas: SegmentTemplate = {
  id: "autopecas",
  label: "Autopeças",
  slug: "autopecas",
  icon: "Cog",
  category: "comercio",
  tagline: "Busca por veículo, compatibilidade e estoque.",
  modules: [...baseModules],
  terms: baseTerms,
  customerFields: [
    { key: "veiculo", label: "Veículo", type: "text" },
    { key: "placa", label: "Placa", type: "text" },
  ],
  defaultServices: [
    { name: "Filtro de óleo", price: 35, durationMin: 0 },
    { name: "Pastilha de freio", price: 120, durationMin: 0 },
    { name: "Amortecedor", price: 280, durationMin: 0 },
  ],
  benefits: [
    "Cadastro de peças por marca e modelo — a caminho",
    "Busca por compatibilidade de veículo",
    "Controle de garantia por peça vendida",
    "Estoque com baixa automática na venda",
    "Financeiro com comissão por vendedor",
  ],
  faq: [
    { q: "Busco peça por veículo?", a: "A busca por compatibilidade de veículo está no roadmap; hoje você cadastra por marca, modelo e referência." },
    { q: "Controlo garantias?", a: "Sim. Cada venda registra a garantia da peça no histórico do cliente." },
  ],
  seo: {
    title: "Sistema para Autopeças | Estoque e compatibilidade",
    description: "Software para loja de autopeças com PDV, busca por veículo, compatibilidade, estoque e financeiro.",
    keywords: ["sistema para autopeças", "pdv autopeças", "estoque peças automotivas"],
    headline: "O sistema da sua loja de autopeças",
    subheadline: "PDV, compatibilidade por veículo, garantias, estoque e financeiro.",
  },
};

export const farmacia: SegmentTemplate = {
  id: "farmacia",
  label: "Farmácia",
  slug: "farmacia",
  icon: "Pill",
  category: "comercio",
  tagline: "PDV, validade, lotes e convênios.",
  modules: [...baseModules],
  ...noScheduling,
  terms: baseTerms,
  specialties: [
    { id: "genericos", label: "Genéricos e similares" },
    { id: "controlados", label: "Medicamentos controlados" },
    { id: "manipulacao", label: "Manipulação" },
    { id: "perfumaria", label: "Perfumaria e dermocosméticos" },
  ],
  customerFields: [
    { key: "convenio", label: "Convênio", type: "text" },
    { key: "cpf", label: "CPF", type: "text" },
  ],
  defaultServices: [
    { name: "Medicamento (genérico)", price: 0, durationMin: 0 },
    { name: "Medicamento (referência)", price: 0, durationMin: 0 },
    { name: "Produto de higiene", price: 0, durationMin: 0 },
  ],
  benefits: [
    "PDV com controle de validade e lotes",
    "Alertas de produtos próximos do vencimento — a caminho",
    "Convênios e programas de desconto",
    "Histórico de compras do cliente",
    "Estoque com inventário e perdas",
  ],
  faq: [
    { q: "Controlo validade e lotes?", a: "Sim. Você acompanha lotes e validade, com alertas de vencimento (a caminho)." },
    { q: "Atendo convênios?", a: "Sim. Você registra o convênio do cliente e organiza descontos e faturamento." },
  ],
  seo: {
    title: "Sistema para Farmácia | PDV, validade e convênios",
    description: "Software para farmácia com PDV, controle de validade e lotes, convênios, estoque e financeiro.",
    keywords: ["sistema para farmácia", "pdv farmácia", "controle validade medicamentos"],
    headline: "O sistema da sua farmácia",
    subheadline: "PDV, validade, lotes, convênios, estoque e alertas de vencimento.",
  },
};

export const supermercado: SegmentTemplate = {
  id: "supermercado",
  label: "Supermercado",
  slug: "supermercado",
  icon: "ShoppingCart",
  category: "comercio",
  tagline: "PDV rápido, validade e multilojas.",
  modules: [...baseModules],
  ...noScheduling,
  terms: baseTerms,
  customerFields: [
    { key: "cartao_fidelidade", label: "Cartão fidelidade", type: "text" },
    { key: "convenio", label: "Convênio / vale", type: "text" },
  ],
  defaultServices: [
    { name: "Produto pesável (kg)", price: 0, durationMin: 0 },
    { name: "Produto unitário", price: 0, durationMin: 0 },
    { name: "Promoção do dia", price: 0, durationMin: 0 },
  ],
  benefits: [
    "PDV de alta velocidade para o caixa",
    "Controle de validade, lotes e perdas",
    "Produtos pesáveis com balança — a caminho",
    "Promoções por horário — a caminho",
    "Estoque por loja e transferências",
  ],
  faq: [
    { q: "PDV rápido para supermercado?", a: "Sim. O caixa é pensado para alto volume, com código de barras e fechamento por operador." },
    { q: "Controlo validade e perdas?", a: "Sim. Você acompanha validade, lotes e registra perdas e quebras no estoque." },
  ],
  seo: {
    title: "Sistema para Supermercado | PDV, validade e estoque",
    description: "Software para supermercado com PDV rápido, validade, lotes, perdas, estoque multiloja e financeiro.",
    keywords: ["sistema para supermercado", "pdv supermercado", "controle validade"],
    headline: "O sistema do seu supermercado",
    subheadline: "PDV rápido, validade, lotes, perdas, estoque multiloja e financeiro.",
  },
};

export const mercearia: SegmentTemplate = {
  id: "mercearia",
  label: "Mercearia",
  slug: "mercearia",
  icon: "Store",
  category: "comercio",
  tagline: "PDV, estoque e crediário.",
  modules: [...baseModules],
  ...noScheduling,
  terms: baseTerms,
  customerFields: [
    { key: "crediario", label: "Crediário", type: "select", options: ["Sim", "Não"] },
    { key: "limite", label: "Limite de crédito", type: "number" },
  ],
  defaultServices: [
    { name: "Arroz 5kg", price: 28, durationMin: 0 },
    { name: "Feijão 1kg", price: 9, durationMin: 0 },
    { name: "Refrigerante 2L", price: 12, durationMin: 0 },
  ],
  benefits: [
    "PDV rápido para o balcão",
    "Controle de estoque com estoque mínimo",
    "Crediário e limite por cliente — a caminho",
    "Caixa e fechamento diário",
    "Relatórios de produtos mais vendidos",
  ],
  faq: [
    { q: "Tenho crediário?", a: "O controle de crediário e limite por cliente está no roadmap; hoje você registra vendas e histórico." },
    { q: "Alerta de estoque baixo?", a: "Sim. O sistema avisa quando um produto atinge o estoque mínimo." },
  ],
  seo: {
    title: "Sistema para Mercearia | PDV e estoque",
    description: "Software para mercearia com PDV rápido, estoque, crediário e financeiro.",
    keywords: ["sistema para mercearia", "pdv mercearia", "estoque mercearia"],
    headline: "O sistema da sua mercearia",
    subheadline: "PDV rápido, estoque, crediário e caixa.",
  },
};

export const minimercado: SegmentTemplate = {
  id: "minimercado",
  label: "Minimercado",
  slug: "minimercado",
  icon: "ShoppingBasket",
  category: "comercio",
  tagline: "PDV enxuto, estoque e caixa.",
  modules: [...baseModules],
  ...noScheduling,
  terms: baseTerms,
  customerFields: [
    { key: "bairro", label: "Bairro", type: "text" },
    { key: "frequencia", label: "Frequência de compra", type: "select", options: ["Diária", "Semanal", "Quinzenal", "Mensal"] },
  ],
  defaultServices: [
    { name: "Produto unitário", price: 0, durationMin: 0 },
    { name: "Produto pesável", price: 0, durationMin: 0 },
  ],
  benefits: [
    "PDV simples e rápido",
    "Controle de estoque enxuto",
    "Fechamento de caixa diário",
    "Alerta de ruptura",
    "Relatórios de vendas do dia",
  ],
  faq: [
    { q: "Serve para loja pequena?", a: "Sim. O sistema é pensado para minimercados e lojas de bairro, com PDV e estoque sem complexidade." },
    { q: "Tenho fechamento de caixa?", a: "Sim. Você abre e fecha o caixa com controle por operador." },
  ],
  seo: {
    title: "Sistema para Minimercado | PDV e estoque",
    description: "Software para minimercado com PDV enxuto, estoque, fechamento de caixa e financeiro.",
    keywords: ["sistema para minimercado", "pdv minimercado", "estoque loja de bairro"],
    headline: "O sistema do seu minimercado",
    subheadline: "PDV enxuto, estoque, fechamento de caixa e relatórios.",
  },
};

export const distribuidora: SegmentTemplate = {
  id: "distribuidora",
  label: "Distribuidora",
  slug: "distribuidora",
  icon: "Truck",
  category: "comercio",
  tagline: "Pedidos, separação, entrega e estoque.",
  modules: [...baseModules, "work_orders"],
  ...noScheduling,
  terms: {
    ...baseTerms,
    work_order: "Pedido",
    work_order_plural: "Pedidos",
    professional: "Representante",
    professional_plural: "Representantes",
  },
  customerFields: [
    { key: "cnpj", label: "CNPJ", type: "text" },
    { key: "endereco", label: "Endereço de entrega", type: "text" },
  ],
  defaultServices: [
    { name: "Pedido mínimo (atacado)", price: 0, durationMin: 0 },
    { name: "Taxa de entrega", price: 0, durationMin: 0 },
  ],
  benefits: [
    "Pedidos com separação e expedição — a caminho",
    "Tabela de preços por cliente",
    "Representantes com comissão e rotas — a caminho",
    "Estoque por depósito",
    "Financeiro com boletos e inadimplência",
  ],
  faq: [
    { q: "Preço diferente por cliente?", a: "Sim. Você cadastra tabelas de preço por cliente ou grupo (a caminho)." },
    { q: "Controlo pedidos e entregas?", a: "Sim. Os pedidos organizam separação, romaneio e status de entrega (expedição a caminho)." },
  ],
  seo: {
    title: "Sistema para Distribuidora | Pedidos, entrega e estoque",
    description: "Software para distribuidora com pedidos, tabela de preços, separação, entrega, estoque e financeiro.",
    keywords: ["sistema para distribuidora", "gestão distribuidora", "pedidos atacado"],
    headline: "O sistema da sua distribuidora",
    subheadline: "Pedidos, tabela de preços, separação, entrega, estoque e financeiro.",
  },
};

export const atacado: SegmentTemplate = {
  id: "atacado",
  label: "Atacado",
  slug: "atacado",
  icon: "Boxes",
  category: "comercio",
  tagline: "Preço por quantidade, pedidos e estoque.",
  modules: [...baseModules, "work_orders"],
  ...noScheduling,
  terms: {
    ...baseTerms,
    work_order: "Pedido",
    work_order_plural: "Pedidos",
    professional: "Representante",
    professional_plural: "Representantes",
  },
  customerFields: [
    { key: "cnpj", label: "CNPJ", type: "text" },
    { key: "limite", label: "Limite de crédito", type: "text" },
  ],
  defaultServices: [
    { name: "Venda atacado (cx)", price: 0, durationMin: 0 },
    { name: "Venda atacado (fd)", price: 0, durationMin: 0 },
  ],
  benefits: [
    "Preço por quantidade e tabela por cliente",
    "Pedidos em volume com separação",
    "Representantes com comissão",
    "Estoque por depósito e transferências",
    "Financeiro com boletos e cobrança",
  ],
  faq: [
    { q: "Preço muda conforme a quantidade?", a: "Sim. Você define preços por faixa de quantidade e por cliente (a caminho)." },
    { q: "Atendo representantes?", a: "Sim. Cada pedido pode ser vinculado ao representante, com comissão no financeiro." },
  ],
  seo: {
    title: "Sistema para Atacado | Preço por quantidade e pedidos",
    description: "Software para atacado com preço por quantidade, tabela por cliente, pedidos, estoque e financeiro.",
    keywords: ["sistema para atacado", "venda atacado", "tabela de preços cliente"],
    headline: "O sistema do seu atacado",
    subheadline: "Preço por quantidade, pedidos, representantes, estoque e financeiro.",
  },
};

export const depositoMateriais: SegmentTemplate = {
  id: "deposito-materiais",
  label: "Depósito de Materiais",
  slug: "deposito-de-materiais",
  icon: "Warehouse",
  category: "comercio",
  tagline: "Orçamentos, entrega e estoque pesado.",
  modules: [...baseModules, "work_orders"],
  ...noScheduling,
  terms: {
    ...baseTerms,
    work_order: "Pedido",
    work_order_plural: "Pedidos",
  },
  customerFields: [
    { key: "obra", label: "Obra / endereço", type: "text" },
    { key: "cnpj_cpf", label: "CNPJ/CPF", type: "text" },
  ],
  defaultServices: [
    { name: "Cimento (sc)", price: 0, durationMin: 0 },
    { name: "Areia (m³)", price: 0, durationMin: 0 },
    { name: "Tijolo (milheiro)", price: 0, durationMin: 0 },
  ],
  benefits: [
    "Orçamentos para obras com conversão em pedido",
    "Estoque por depósito com inventário",
    "Entrega e romaneio — a caminho",
    "Venda por peso e por unidade",
    "Financeiro por obra e por cliente",
  ],
  faq: [
    { q: "Faço orçamento para obra?", a: "Sim. Você monta orçamentos detalhados e converte em pedido quando o cliente aprova." },
    { q: "Controlo estoque por depósito?", a: "Sim. Você acompanha o estoque por depósito, com transferências entre unidades (a caminho)." },
  ],
  seo: {
    title: "Sistema para Depósito de Materiais | Orçamentos e estoque",
    description: "Software para depósito de materiais de construção com orçamentos, pedidos, entrega, estoque e financeiro.",
    keywords: ["sistema depósito materiais", "orçamento construção", "estoque materiais"],
    headline: "O sistema do seu depósito de materiais",
    subheadline: "Orçamentos, pedidos, entrega, estoque por depósito e financeiro.",
  },
};
