import type { SegmentTemplate } from "./types";

// Sub-nichos de Comercio (parte 1).

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

export const lojaRoupas: SegmentTemplate = {
  id: "loja-roupas",
  label: "Loja de Roupas",
  slug: "loja-de-roupas",
  icon: "Shirt",
  category: "comercio",
  tagline: "PDV, variações de tamanho/cor e estoque.",
  modules: [...baseModules],
  terms: baseTerms,
  customerFields: [
    { key: "tamanho", label: "Tamanho preferido", type: "text" },
    { key: "data_nascimento", label: "Data de nascimento", type: "date" },
  ],
  defaultServices: [
    { name: "Camiseta básica", price: 59, durationMin: 0 },
    { name: "Calça jeans", price: 149, durationMin: 0 },
    { name: "Vestido", price: 189, durationMin: 0 },
  ],
  benefits: [
    "PDV rápido com leitura de código de barras",
    "Produtos com variações de cor e tamanho",
    "Controle de estoque por loja",
    "Trocas, devoluções e fidelidade",
    "Financeiro com comissão por vendedor",
  ],
  faq: [
    { q: "Controlo tamanho e cor no estoque?", a: "Sim. Você cadastra variações por produto e acompanha o estoque de cada combinação." },
    { q: "Tem PDV com código de barras?", a: "Sim. O caixa é pensado para venda rápida com leitura de código de barras (integração a caminho)." },
  ],
  seo: {
    title: "Sistema para Loja de Roupas | PDV, estoque e variações",
    description: "Software para loja de roupas com PDV, variações de tamanho e cor, estoque, trocas e financeiro.",
    keywords: ["sistema para loja de roupas", "pdv moda", "controle de estoque roupas"],
    headline: "O sistema da sua loja de roupas",
    subheadline: "PDV, variações de tamanho e cor, estoque, trocas e comissão de vendedores.",
  },
};

export const lojaCalcados: SegmentTemplate = {
  id: "loja-calcados",
  label: "Loja de Calçados",
  slug: "loja-de-calcados",
  icon: "Footprints",
  category: "comercio",
  tagline: "PDV, numeração e controle de estoque.",
  modules: [...baseModules],
  terms: baseTerms,
  customerFields: [
    { key: "numeracao", label: "Numeração preferida", type: "text" },
  ],
  defaultServices: [
    { name: "Tênis casual", price: 199, durationMin: 0 },
    { name: "Sandália", price: 89, durationMin: 0 },
    { name: "Sapato social", price: 249, durationMin: 0 },
  ],
  benefits: [
    "PDV com variações por numeração e cor",
    "Controle de estoque mínimo por modelo",
    "Trocas e devoluções no caixa",
    "Comissão por vendedor",
    "Relatórios de produtos mais vendidos",
  ],
  faq: [
    { q: "Controlo a numeração no estoque?", a: "Sim. Cada produto pode ter variações por numeração, com estoque separado." },
    { q: "Faço trocas no caixa?", a: "Sim. O PDV registra trocas e devoluções com histórico do cliente." },
  ],
  seo: {
    title: "Sistema para Loja de Calçados | PDV e estoque por numeração",
    description: "Software para loja de calçados com PDV, variações por numeração, estoque, trocas e financeiro.",
    keywords: ["sistema para loja de calçados", "pdv calçados", "estoque numeração"],
    headline: "O sistema da sua loja de calçados",
    subheadline: "PDV, numeração, estoque, trocas e comissão de vendedores.",
  },
};

export const lojaCosmeticos: SegmentTemplate = {
  id: "loja-cosmeticos",
  label: "Loja de Cosméticos",
  slug: "loja-de-cosmeticos",
  icon: "Sparkles",
  category: "comercio",
  tagline: "PDV, validade, fidelidade e estoque.",
  modules: [...baseModules],
  terms: baseTerms,
  customerFields: [
    { key: "preferencias", label: "Preferências / tipo de pele", type: "text" },
    { key: "data_nascimento", label: "Data de nascimento", type: "date" },
  ],
  defaultServices: [
    { name: "Base líquida", price: 89, durationMin: 0 },
    { name: "Batom", price: 45, durationMin: 0 },
    { name: "Kit skincare", price: 129, durationMin: 0 },
  ],
  benefits: [
    "PDV rápido com combos e kits",
    "Controle de validade e lotes",
    "Programa de fidelidade e cashback — a caminho",
    "Estoque com alerta de ruptura",
    "Campanhas para aniversariantes",
  ],
  faq: [
    { q: "Controlo validade dos produtos?", a: "Sim. Você acompanha lotes e validade, com alertas de produtos próximos do vencimento (a caminho)." },
    { q: "Tem fidelidade?", a: "O programa de fidelidade e cashback está no roadmap; hoje você já tem o histórico de compras de cada cliente." },
  ],
  seo: {
    title: "Sistema para Loja de Cosméticos | PDV, validade e fidelidade",
    description: "Software para loja de cosméticos com PDV, controle de validade, estoque, fidelidade e financeiro.",
    keywords: ["sistema para loja de cosméticos", "pdv cosméticos", "estoque validade"],
    headline: "O sistema da sua loja de cosméticos",
    subheadline: "PDV, validade, estoque, fidelidade e campanhas para clientes.",
  },
};

export const lojaInformatica: SegmentTemplate = {
  id: "loja-informatica",
  label: "Loja de Informática",
  slug: "loja-de-informatica",
  icon: "Laptop",
  category: "comercio",
  tagline: "PDV, garantias e controle de peças.",
  modules: [...baseModules],
  terms: baseTerms,
  customerFields: [
    { key: "empresa", label: "Empresa", type: "text" },
  ],
  defaultServices: [
    { name: "Notebook", price: 3299, durationMin: 0 },
    { name: "Mouse sem fio", price: 89, durationMin: 0 },
    { name: "Teclado mecânico", price: 249, durationMin: 0 },
  ],
  benefits: [
    "PDV com SKU, NCM e código de barras",
    "Controle de garantia por produto vendido",
    "Estoque com entrada e saída automática",
    "Orçamentos com conversão em venda",
    "Financeiro com parcelamento",
  ],
  faq: [
    { q: "Cadastro produtos com SKU e NCM?", a: "Sim. Você cadastra SKU, NCM e código de barras para cada produto." },
    { q: "Controlo garantias?", a: "Sim. Cada venda registra a garantia do produto no histórico do cliente." },
  ],
  seo: {
    title: "Sistema para Loja de Informática | PDV, SKU e garantias",
    description: "Software para loja de informática com PDV, SKU, NCM, garantias, estoque e financeiro.",
    keywords: ["sistema para loja de informática", "pdv informática", "controle de estoque TI"],
    headline: "O sistema da sua loja de informática",
    subheadline: "PDV, SKU, garantias, estoque e financeiro com parcelamento.",
  },
};

export const lojaCelulares: SegmentTemplate = {
  id: "loja-celulares",
  label: "Loja de Celulares",
  slug: "loja-de-celulares",
  icon: "Smartphone",
  category: "comercio",
  tagline: "PDV, IMEI, acessórios e garantia.",
  modules: [...baseModules],
  terms: baseTerms,
  customerFields: [
    { key: "cpf", label: "CPF", type: "text" },
  ],
  defaultServices: [
    { name: "Smartphone", price: 1899, durationMin: 0 },
    { name: "Capinha", price: 39, durationMin: 0 },
    { name: "Película", price: 29, durationMin: 0 },
  ],
  benefits: [
    "PDV com aparelhos e acessórios",
    "Controle de IMEI e garantia — a caminho",
    "Combos de aparelho + acessórios",
    "Estoque com alerta de ruptura",
    "Financeiro com parcelamento e comissão",
  ],
  faq: [
    { q: "Vendo aparelhos e acessórios juntos?", a: "Sim. Você monta combos e vende aparelhos com capinhas, películas e carregadores no mesmo PDV." },
    { q: "Controlo o estoque de acessórios?", a: "Sim. Cada produto tem estoque com entrada, saída e alerta de estoque mínimo." },
  ],
  seo: {
    title: "Sistema para Loja de Celulares | PDV, acessórios e estoque",
    description: "Software para loja de celulares com PDV, aparelhos, acessórios, garantia, estoque e financeiro.",
    keywords: ["sistema para loja de celulares", "pdv celulares", "estoque smartphones"],
    headline: "O sistema da sua loja de celulares",
    subheadline: "PDV, aparelhos, acessórios, garantia, estoque e parcelamento.",
  },
};

export const lojaEletronicos: SegmentTemplate = {
  id: "loja-eletronicos",
  label: "Loja de Eletrônicos",
  slug: "loja-de-eletronicos",
  icon: "Cpu",
  category: "comercio",
  tagline: "PDV, categorias e controle de estoque.",
  modules: [...baseModules],
  terms: baseTerms,
  defaultServices: [
    { name: "Smart TV 55\"", price: 2499, durationMin: 0 },
    { name: "Caixa de som Bluetooth", price: 299, durationMin: 0 },
    { name: "Fone de ouvido", price: 199, durationMin: 0 },
  ],
  benefits: [
    "PDV com categorias, marcas e variações",
    "Controle de estoque por loja",
    "Orçamentos com aprovação do cliente",
    "Garantia e histórico de compras",
    "Relatórios de margem e curva ABC — a caminho",
  ],
  faq: [
    { q: "Organizo por categorias e marcas?", a: "Sim. Você cadastra categorias, marcas e variações para agilizar o PDV e os relatórios." },
    { q: "Faço orçamentos?", a: "Sim. Você gera orçamentos e converte em venda quando o cliente aprova." },
  ],
  seo: {
    title: "Sistema para Loja de Eletrônicos | PDV e estoque",
    description: "Software para loja de eletrônicos com PDV, categorias, marcas, estoque, orçamentos e financeiro.",
    keywords: ["sistema para loja de eletrônicos", "pdv eletrônicos", "controle de estoque"],
    headline: "O sistema da sua loja de eletrônicos",
    subheadline: "PDV, categorias, marcas, estoque, orçamentos e financeiro.",
  },
};

export const lojaMoveis: SegmentTemplate = {
  id: "loja-moveis",
  label: "Loja de Móveis",
  slug: "loja-de-moveis",
  icon: "Armchair",
  category: "comercio",
  tagline: "Orçamentos, entrega e estoque.",
  modules: [...baseModules, "work_orders"],
  terms: {
    ...baseTerms,
    work_order: "Pedido",
    work_order_plural: "Pedidos",
  },
  customerFields: [
    { key: "endereco", label: "Endereço de entrega", type: "text" },
  ],
  defaultServices: [
    { name: "Sofá 3 lugares", price: 2499, durationMin: 0 },
    { name: "Mesa de jantar", price: 1299, durationMin: 0 },
    { name: "Cama box casal", price: 1899, durationMin: 0 },
  ],
  benefits: [
    "Orçamentos com conversão em pedido",
    "Controle de entrega e montagem — a caminho",
    "Estoque com dimensões e peso",
    "Venda por vendedor com comissão",
    "Financeiro com parcelamento",
  ],
  faq: [
    { q: "Faço orçamento antes da venda?", a: "Sim. Você gera orçamentos e converte em pedido quando o cliente aprova." },
    { q: "Controlo entregas?", a: "Os pedidos organizam a venda com status de separação e entrega (expedição a caminho)." },
  ],
  seo: {
    title: "Sistema para Loja de Móveis | Orçamentos, pedidos e estoque",
    description: "Software para loja de móveis com orçamentos, pedidos, entrega, estoque e financeiro.",
    keywords: ["sistema para loja de móveis", "orçamento móveis", "pdv móveis"],
    headline: "O sistema da sua loja de móveis",
    subheadline: "Orçamentos, pedidos, entrega, estoque e financeiro com parcelamento.",
  },
};

export const papelaria: SegmentTemplate = {
  id: "papelaria",
  label: "Papelaria",
  slug: "papelaria",
  icon: "PenTool",
  category: "comercio",
  tagline: "PDV rápido, estoque e escolar.",
  modules: [...baseModules],
  terms: baseTerms,
  defaultServices: [
    { name: "Caderno 96 folhas", price: 18, durationMin: 0 },
    { name: "Kit escolar", price: 89, durationMin: 0 },
    { name: "Resma A4", price: 32, durationMin: 0 },
  ],
  benefits: [
    "PDV rápido com código de barras",
    "Kits e combos escolares",
    "Controle de estoque com estoque mínimo",
    "Sazonalidade (volta às aulas) nos relatórios",
    "Caixa e fechamento diário",
  ],
  faq: [
    { q: "Vendo kits escolares?", a: "Sim. Você monta kits e combos com preço fechado para agilizar a venda." },
    { q: "Tenho alerta de estoque baixo?", a: "Sim. O sistema avisa quando um produto atinge o estoque mínimo." },
  ],
  seo: {
    title: "Sistema para Papelaria | PDV e estoque escolar",
    description: "Software para papelaria com PDV rápido, kits escolares, estoque e financeiro.",
    keywords: ["sistema para papelaria", "pdv papelaria", "estoque material escolar"],
    headline: "O sistema da sua papelaria",
    subheadline: "PDV rápido, kits escolares, estoque e caixa.",
  },
};

export const livraria: SegmentTemplate = {
  id: "livraria",
  label: "Livraria",
  slug: "livraria",
  icon: "BookOpen",
  category: "comercio",
  tagline: "PDV, ISBN e controle de estoque.",
  modules: [...baseModules],
  terms: baseTerms,
  customerFields: [
    { key: "preferencias", label: "Gêneros preferidos", type: "text" },
  ],
  defaultServices: [
    { name: "Livro (unidade)", price: 49, durationMin: 0 },
    { name: "Revista", price: 19, durationMin: 0 },
    { name: "Material de escritório", price: 15, durationMin: 0 },
  ],
  benefits: [
    "PDV com ISBN e código de barras",
    "Categorias por gênero e editora",
    "Controle de estoque e reposição",
    "Histórico de compras do cliente",
    "Relatórios de mais vendidos",
  ],
  faq: [
    { q: "Cadastro livros com ISBN?", a: "Sim. Você cadastra ISBN, editora e gênero para organizar o estoque e o PDV." },
    { q: "Vejo o que mais vende?", a: "Sim. Os relatórios mostram os produtos mais vendidos por período." },
  ],
  seo: {
    title: "Sistema para Livraria | PDV, ISBN e estoque",
    description: "Software para livraria com PDV, ISBN, categorias, estoque e financeiro.",
    keywords: ["sistema para livraria", "pdv livraria", "controle de estoque livros"],
    headline: "O sistema da sua livraria",
    subheadline: "PDV, ISBN, categorias, estoque e relatórios de vendas.",
  },
};

export const lojaPresentes: SegmentTemplate = {
  id: "loja-presentes",
  label: "Loja de Presentes",
  slug: "loja-de-presentes",
  icon: "Gift",
  category: "comercio",
  tagline: "PDV, embalagem e fidelidade.",
  modules: [...baseModules],
  terms: baseTerms,
  customerFields: [
    { key: "data_nascimento", label: "Data de nascimento", type: "date" },
    { key: "preferencias", label: "Preferências", type: "text" },
  ],
  defaultServices: [
    { name: "Kit presente", price: 79, durationMin: 0 },
    { name: "Caneca personalizada", price: 45, durationMin: 0 },
    { name: "Vale-presente", price: 100, durationMin: 0 },
  ],
  benefits: [
    "PDV com kits e vale-presente",
    "Campanhas para aniversariantes",
    "Programa de fidelidade — a caminho",
    "Controle de estoque sazonal",
    "Histórico de compras por cliente",
  ],
  faq: [
    { q: "Vendo vale-presente?", a: "Sim. Você cadastra vale-presente e acompanha o saldo na venda (integração completa a caminho)." },
    { q: "Tenho campanha de aniversário?", a: "Com base na data de nascimento do cliente, você organiza campanhas (automação a caminho)." },
  ],
  seo: {
    title: "Sistema para Loja de Presentes | PDV e fidelidade",
    description: "Software para loja de presentes com PDV, kits, vale-presente, estoque e campanhas.",
    keywords: ["sistema para loja de presentes", "pdv presentes", "vale-presente"],
    headline: "O sistema da sua loja de presentes",
    subheadline: "PDV, kits, vale-presente, estoque e campanhas para clientes.",
  },
};
