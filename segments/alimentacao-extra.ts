import type { SegmentTemplate } from "./types";

// Sub-nichos de Alimentacao (alem de restaurante).

const baseTerms = {
  customer: "Cliente",
  customer_plural: "Clientes",
  professional: "Funcionário",
  professional_plural: "Equipe",
  service: "Item do cardápio",
  service_plural: "Itens do cardápio",
  inventory: "Estoque",
};

const deliveryFields = [
  { key: "endereco", label: "Endereço de entrega", type: "text" as const, placeholder: "Rua, número, bairro" },
  { key: "referencia", label: "Ponto de referência", type: "text" as const },
  { key: "preferencias", label: "Preferências / restrições", type: "text" as const, placeholder: "Ex.: sem cebola" },
];

export const lanchonete: SegmentTemplate = {
  id: "lanchonete",
  label: "Lanchonete",
  slug: "lanchonete",
  icon: "Sandwich",
  category: "alimentacao",
  tagline: "Pedidos no balcão, comandas e caixa rápido.",
  modules: ["clients", "services", "work_orders", "inventory", "financial", "team"],
  terms: { ...baseTerms, work_order: "Comanda", work_order_plural: "Comandas" },
  customerFields: deliveryFields,
  defaultServices: [
    { name: "X-Salada", price: 22, durationMin: 0 },
    { name: "X-Bacon", price: 26, durationMin: 0 },
    { name: "Misto quente", price: 12, durationMin: 0 },
    { name: "Porção de fritas", price: 25, durationMin: 0 },
    { name: "Refrigerante lata", price: 7, durationMin: 0 },
  ],
  benefits: [
    "Caixa rápido para o balcão, sem fila",
    "Comandas e pedidos para viagem e delivery",
    "Cardápio com preços e adicionais sempre atualizados",
    "Controle de estoque de insumos",
    "Relatórios de vendas e itens mais pedidos",
  ],
  faq: [
    { q: "Serve para venda rápida no balcão?", a: "Sim. O caixa é pensado para agilidade, com itens e adicionais a poucos toques." },
    { q: "Consigo separar pedidos de delivery?", a: "Sim. Os pedidos de balcão, viagem e delivery ficam organizados no mesmo sistema." },
  ],
  seo: {
    title: "Sistema para Lanchonete | PDV, comandas e estoque",
    description:
      "Software para lanchonete com caixa rápido, comandas, cardápio, estoque de insumos, delivery e financeiro.",
    keywords: ["sistema para lanchonete", "pdv lanchonete", "comanda lanchonete"],
    headline: "O sistema da sua lanchonete",
    subheadline: "Caixa rápido, comandas, cardápio, estoque e delivery em um só lugar.",
  },
};

export const pizzaria: SegmentTemplate = {
  id: "pizzaria",
  label: "Pizzaria",
  slug: "pizzaria",
  icon: "Pizza",
  category: "alimentacao",
  tagline: "Pedidos, sabores, delivery e caixa.",
  modules: ["clients", "services", "work_orders", "inventory", "financial", "team"],
  terms: { ...baseTerms, work_order: "Pedido", work_order_plural: "Pedidos" },
  customerFields: deliveryFields,
  defaultServices: [
    { name: "Pizza grande (broto a definir)", price: 55, durationMin: 0 },
    { name: "Pizza média", price: 45, durationMin: 0 },
    { name: "Borda recheada", price: 10, durationMin: 0 },
    { name: "Refrigerante 2L", price: 14, durationMin: 0 },
    { name: "Calzone", price: 48, durationMin: 0 },
  ],
  benefits: [
    "Pedidos de balcão, mesa e delivery em um só lugar",
    "Sabores, bordas e adicionais com preço atualizado",
    "Controle de entregadores e taxa de entrega",
    "Estoque de insumos com ficha técnica por sabor",
    "Caixa, fechamento diário e relatórios de vendas",
  ],
  faq: [
    { q: "Consigo controlar meia a meia e adicionais?", a: "Sim. Você cadastra sabores, bordas e adicionais com preços para montar o pedido rapidamente." },
    { q: "Tem controle de delivery?", a: "Sim. Você organiza os pedidos de entrega, taxa e entregadores (rastreamento a caminho)." },
  ],
  seo: {
    title: "Sistema para Pizzaria | Pedidos, delivery e estoque",
    description:
      "Software para pizzaria com pedidos de balcão, mesa e delivery, sabores e adicionais, estoque com ficha técnica e financeiro.",
    keywords: ["sistema para pizzaria", "pedido pizzaria", "delivery pizzaria", "pdv pizzaria"],
    headline: "O sistema completo da sua pizzaria",
    subheadline: "Pedidos de balcão, mesa e delivery, sabores e adicionais, estoque e caixa.",
  },
};

export const hamburgueria: SegmentTemplate = {
  id: "hamburgueria",
  label: "Hamburgueria",
  slug: "hamburgueria",
  icon: "Beef",
  category: "alimentacao",
  tagline: "Pedidos, combos, delivery e produção.",
  modules: ["clients", "services", "work_orders", "inventory", "financial", "team"],
  terms: { ...baseTerms, work_order: "Pedido", work_order_plural: "Pedidos" },
  customerFields: deliveryFields,
  defaultServices: [
    { name: "Smash burger", price: 28, durationMin: 0 },
    { name: "Cheese duplo", price: 34, durationMin: 0 },
    { name: "Combo (burger + fritas + bebida)", price: 42, durationMin: 0 },
    { name: "Fritas rústicas", price: 22, durationMin: 0 },
    { name: "Milk shake", price: 18, durationMin: 0 },
  ],
  benefits: [
    "Pedidos de balcão e delivery com combos e adicionais",
    "Painel de produção para a cozinha (KDS) — a caminho",
    "Ficha técnica e estoque de insumos por item",
    "Controle de entregadores e taxa de entrega",
    "Caixa e relatórios de itens mais vendidos",
  ],
  faq: [
    { q: "Consigo montar combos e adicionais?", a: "Sim. Você cadastra combos, pontos da carne e adicionais com preço para o pedido sair rápido." },
    { q: "Dá para acompanhar a produção da cozinha?", a: "O painel de cozinha (KDS) está no roadmap; hoje você já organiza os pedidos por status." },
  ],
  seo: {
    title: "Sistema para Hamburgueria | Pedidos, combos e delivery",
    description:
      "Software para hamburgueria com pedidos, combos, adicionais, delivery, estoque com ficha técnica e financeiro.",
    keywords: ["sistema para hamburgueria", "pdv hamburgueria", "delivery hambúrguer"],
    headline: "O sistema da sua hamburgueria",
    subheadline: "Pedidos, combos, delivery, ficha técnica e caixa em um só lugar.",
  },
};

export const churrascaria: SegmentTemplate = {
  id: "churrascaria",
  label: "Churrascaria",
  slug: "churrascaria",
  icon: "Flame",
  category: "alimentacao",
  tagline: "Mesas, comandas, rodízio e caixa.",
  modules: ["clients", "services", "work_orders", "inventory", "financial", "team"],
  terms: { ...baseTerms, work_order: "Comanda", work_order_plural: "Comandas" },
  customerFields: [
    { key: "preferencias", label: "Preferências", type: "text", placeholder: "Ex.: ponto da carne" },
    { key: "data_nascimento", label: "Data de nascimento", type: "date" },
  ],
  defaultServices: [
    { name: "Rodízio completo", price: 89, durationMin: 0 },
    { name: "Rodízio executivo (almoço)", price: 59, durationMin: 0 },
    { name: "Buffet por quilo", price: 79, durationMin: 0 },
    { name: "Refrigerante", price: 9, durationMin: 0 },
    { name: "Sobremesa", price: 22, durationMin: 0 },
  ],
  benefits: [
    "Comandas por mesa com fechamento no caixa",
    "Controle de rodízio, à la carte e buffet por quilo",
    "Estoque de carnes e insumos com ficha técnica",
    "Vendas por garçom e gorjetas",
    "Relatórios de faturamento e ticket médio",
  ],
  faq: [
    { q: "Funciona para rodízio e por quilo?", a: "Sim. Você cadastra rodízio, à la carte e buffet por quilo do jeito da sua casa." },
    { q: "Controlo as comandas por mesa?", a: "Sim. Cada mesa tem a comanda com o consumo e fecha direto no caixa." },
  ],
  seo: {
    title: "Sistema para Churrascaria | Mesas, comandas e estoque",
    description:
      "Software para churrascaria com comandas por mesa, rodízio e buffet, estoque de carnes, vendas por garçom e financeiro.",
    keywords: ["sistema para churrascaria", "comanda churrascaria", "pdv churrascaria"],
    headline: "O sistema da sua churrascaria",
    subheadline: "Comandas por mesa, rodízio e buffet, estoque de carnes e caixa.",
  },
};

export const sushi: SegmentTemplate = {
  id: "sushi",
  label: "Sushi Bar / Japonês",
  slug: "sushi-bar",
  icon: "Fish",
  category: "alimentacao",
  tagline: "Combinados, mesas, delivery e estoque.",
  modules: ["clients", "services", "work_orders", "inventory", "financial", "team"],
  terms: { ...baseTerms, work_order: "Comanda", work_order_plural: "Comandas" },
  customerFields: deliveryFields,
  defaultServices: [
    { name: "Combinado 20 peças", price: 69, durationMin: 0 },
    { name: "Combinado 30 peças", price: 95, durationMin: 0 },
    { name: "Temaki salmão", price: 32, durationMin: 0 },
    { name: "Hot roll (8 un)", price: 28, durationMin: 0 },
    { name: "Yakisoba", price: 38, durationMin: 0 },
  ],
  benefits: [
    "Pedidos de mesa, balcão e delivery em um só caixa",
    "Combinados e itens com preço sempre atualizado",
    "Estoque de insumos (peixe, arroz) com ficha técnica",
    "Controle de entregadores e taxa de entrega",
    "Relatórios de vendas e itens mais pedidos",
  ],
  faq: [
    { q: "Consigo montar combinados?", a: "Sim. Você cadastra combinados e itens avulsos com preços para agilizar o pedido." },
    { q: "Tem controle de delivery?", a: "Sim. Os pedidos de delivery ficam organizados com taxa e entregadores." },
  ],
  seo: {
    title: "Sistema para Sushi Bar e Restaurante Japonês | Pedidos e delivery",
    description:
      "Software para sushi bar e restaurante japonês com pedidos de mesa e delivery, combinados, estoque e financeiro.",
    keywords: ["sistema para sushi", "pdv restaurante japonês", "delivery sushi"],
    headline: "O sistema do seu sushi bar",
    subheadline: "Pedidos de mesa e delivery, combinados, estoque e caixa em um só lugar.",
  },
};

export const acaiteria: SegmentTemplate = {
  id: "acaiteria",
  label: "Açaiteria",
  slug: "acaiteria",
  icon: "Grape",
  category: "alimentacao",
  tagline: "Montagem por tamanho, adicionais e delivery.",
  modules: ["clients", "services", "work_orders", "inventory", "financial", "team"],
  terms: { ...baseTerms, work_order: "Pedido", work_order_plural: "Pedidos" },
  customerFields: deliveryFields,
  defaultServices: [
    { name: "Açaí 300ml", price: 16, durationMin: 0 },
    { name: "Açaí 500ml", price: 22, durationMin: 0 },
    { name: "Açaí 700ml", price: 28, durationMin: 0 },
    { name: "Adicional (granola, leite cond.)", price: 3, durationMin: 0 },
    { name: "Combo casal 1kg", price: 45, durationMin: 0 },
  ],
  benefits: [
    "Montagem por tamanho com adicionais e preço automático",
    "Pedidos de balcão e delivery em um só caixa",
    "Controle de estoque de açaí, frutas e complementos",
    "Promoções por horário e programa de fidelidade — a caminho",
    "Relatórios de vendas e itens mais pedidos",
  ],
  faq: [
    { q: "Consigo cobrar adicionais?", a: "Sim. Você cadastra tamanhos e adicionais com preço para montar o pedido rapidamente." },
    { q: "Funciona para delivery?", a: "Sim. Os pedidos de entrega ficam organizados com taxa e endereço do cliente." },
  ],
  seo: {
    title: "Sistema para Açaiteria | PDV, adicionais e delivery",
    description:
      "Software para açaiteria com montagem por tamanho, adicionais, delivery, estoque e financeiro.",
    keywords: ["sistema para açaiteria", "pdv açaí", "delivery açaí"],
    headline: "O sistema da sua açaiteria",
    subheadline: "Montagem por tamanho, adicionais, delivery, estoque e caixa.",
  },
};

export const cafeteria: SegmentTemplate = {
  id: "cafeteria",
  label: "Cafeteria",
  slug: "cafeteria",
  icon: "Coffee",
  category: "alimentacao",
  tagline: "Balcão, mesas, fidelidade e caixa.",
  modules: ["clients", "services", "work_orders", "inventory", "financial", "team"],
  terms: { ...baseTerms, work_order: "Comanda", work_order_plural: "Comandas" },
  customerFields: [
    { key: "preferencias", label: "Preferências", type: "text", placeholder: "Ex.: leite vegetal" },
    { key: "data_nascimento", label: "Data de nascimento", type: "date" },
  ],
  defaultServices: [
    { name: "Espresso", price: 7, durationMin: 0 },
    { name: "Cappuccino", price: 12, durationMin: 0 },
    { name: "Latte", price: 13, durationMin: 0 },
    { name: "Bolo (fatia)", price: 14, durationMin: 0 },
    { name: "Sanduíche natural", price: 18, durationMin: 0 },
  ],
  benefits: [
    "Caixa rápido para o balcão e comandas para mesas",
    "Cardápio com bebidas, doces e combos",
    "Programa de fidelidade e cashback — a caminho",
    "Controle de estoque de insumos",
    "Relatórios de vendas e itens mais pedidos",
  ],
  faq: [
    { q: "Tem programa de fidelidade?", a: "O programa de fidelidade e cashback está no roadmap; hoje você já tem o histórico de cada cliente." },
    { q: "Serve para balcão e mesa?", a: "Sim. Você atende no balcão com caixa rápido e abre comandas para as mesas." },
  ],
  seo: {
    title: "Sistema para Cafeteria | PDV, comandas e fidelidade",
    description:
      "Software para cafeteria com caixa rápido, comandas, cardápio, estoque e financeiro.",
    keywords: ["sistema para cafeteria", "pdv cafeteria", "comanda cafeteria"],
    headline: "O sistema da sua cafeteria",
    subheadline: "Caixa rápido, comandas, cardápio, estoque e fidelidade.",
  },
};

export const padaria: SegmentTemplate = {
  id: "padaria",
  label: "Padaria",
  slug: "padaria",
  icon: "Croissant",
  category: "alimentacao",
  tagline: "Balcão, produção, estoque e caixa.",
  modules: ["clients", "services", "inventory", "financial", "team"],
  terms: { ...baseTerms },
  customerFields: [
    { key: "preferencias", label: "Observações", type: "text" },
  ],
  defaultServices: [
    { name: "Pão francês (kg)", price: 16, durationMin: 0 },
    { name: "Pão de queijo (kg)", price: 39, durationMin: 0 },
    { name: "Bolo caseiro (fatia)", price: 9, durationMin: 0 },
    { name: "Café (xícara)", price: 5, durationMin: 0 },
    { name: "Salgado assado", price: 8, durationMin: 0 },
  ],
  benefits: [
    "Caixa rápido com venda por peso e por unidade",
    "Controle de produção e estoque de insumos",
    "Ficha técnica com custo e rendimento das receitas",
    "Encomendas de bolos e tortas — a caminho",
    "Relatórios de vendas e itens mais vendidos",
  ],
  faq: [
    { q: "Vendo por peso (kg)?", a: "Sim. Você cadastra itens por unidade ou por peso (integração com balança a caminho)." },
    { q: "Controlo a produção?", a: "Sim. Você acompanha o estoque de insumos e a ficha técnica das receitas." },
  ],
  seo: {
    title: "Sistema para Padaria | PDV, produção e estoque",
    description:
      "Software para padaria com caixa, venda por peso, ficha técnica, produção, estoque e financeiro.",
    keywords: ["sistema para padaria", "pdv padaria", "controle de produção padaria"],
    headline: "O sistema da sua padaria",
    subheadline: "Caixa, venda por peso, ficha técnica, produção e estoque.",
  },
};

export const sorveteria: SegmentTemplate = {
  id: "sorveteria",
  label: "Sorveteria",
  slug: "sorveteria",
  icon: "IceCreamCone",
  category: "alimentacao",
  tagline: "Montagem por tamanho, sabores e caixa.",
  modules: ["clients", "services", "inventory", "financial", "team"],
  terms: { ...baseTerms },
  customerFields: [
    { key: "preferencias", label: "Preferências", type: "text" },
  ],
  defaultServices: [
    { name: "Casquinha 1 bola", price: 9, durationMin: 0 },
    { name: "Copo 2 bolas", price: 15, durationMin: 0 },
    { name: "Milk shake", price: 18, durationMin: 0 },
    { name: "Açaí 500ml", price: 22, durationMin: 0 },
    { name: "Sorvete por peso (100g)", price: 8, durationMin: 0 },
  ],
  benefits: [
    "Venda por bola, por peso e por tamanho",
    "Cardápio de sabores com disponibilidade",
    "Controle de estoque de potes e insumos",
    "Caixa rápido para o balcão",
    "Relatórios de vendas e sabores mais pedidos",
  ],
  faq: [
    { q: "Vendo por peso?", a: "Sim. Você cadastra venda por peso, por bola e por tamanho (integração com balança a caminho)." },
    { q: "Controlo os sabores disponíveis?", a: "Sim. Você marca a disponibilidade de cada sabor no cardápio." },
  ],
  seo: {
    title: "Sistema para Sorveteria | PDV, sabores e estoque",
    description:
      "Software para sorveteria com venda por peso e bola, cardápio de sabores, estoque e financeiro.",
    keywords: ["sistema para sorveteria", "pdv sorveteria", "venda por peso sorvete"],
    headline: "O sistema da sua sorveteria",
    subheadline: "Venda por bola e por peso, sabores, estoque e caixa.",
  },
};

export const foodtruck: SegmentTemplate = {
  id: "foodtruck",
  label: "Food Truck",
  slug: "food-truck",
  icon: "Truck",
  category: "alimentacao",
  tagline: "Venda rápida, cardápio enxuto e caixa.",
  modules: ["clients", "services", "inventory", "financial", "team"],
  terms: { ...baseTerms },
  customerFields: [
    { key: "preferencias", label: "Preferências", type: "text" },
  ],
  defaultServices: [
    { name: "Burger artesanal", price: 28, durationMin: 0 },
    { name: "Hot dog completo", price: 18, durationMin: 0 },
    { name: "Porção de fritas", price: 22, durationMin: 0 },
    { name: "Refrigerante lata", price: 7, durationMin: 0 },
    { name: "Combo do dia", price: 35, durationMin: 0 },
  ],
  benefits: [
    "Caixa rápido pelo celular ou tablet, sem fila",
    "Cardápio enxuto com combos do dia",
    "Controle de estoque de insumos da operação",
    "PIX e cartão integrados — a caminho",
    "Relatórios de vendas por evento e por dia",
  ],
  faq: [
    { q: "Funciona pelo celular?", a: "Sim. O sistema é online e você opera o caixa pelo celular ou tablet em qualquer ponto." },
    { q: "Controlo o estoque do dia?", a: "Sim. Você acompanha os insumos e o que foi vendido em cada evento." },
  ],
  seo: {
    title: "Sistema para Food Truck | PDV no celular e estoque",
    description:
      "Software para food truck com caixa rápido no celular, cardápio, estoque e financeiro por evento.",
    keywords: ["sistema para food truck", "pdv food truck", "caixa food truck"],
    headline: "O sistema do seu food truck",
    subheadline: "Caixa rápido no celular, cardápio, estoque e relatórios por evento.",
  },
};

export const delivery: SegmentTemplate = {
  id: "delivery",
  label: "Delivery de Refeições",
  slug: "delivery",
  icon: "Bike",
  category: "alimentacao",
  tagline: "Pedidos, entregadores, rotas e caixa.",
  modules: ["clients", "services", "work_orders", "inventory", "financial", "team"],
  terms: { ...baseTerms, work_order: "Pedido", work_order_plural: "Pedidos" },
  customerFields: deliveryFields,
  defaultServices: [
    { name: "Marmita P", price: 18, durationMin: 0 },
    { name: "Marmita M", price: 24, durationMin: 0 },
    { name: "Marmita G", price: 30, durationMin: 0 },
    { name: "Taxa de entrega", price: 6, durationMin: 0 },
    { name: "Refrigerante", price: 8, durationMin: 0 },
  ],
  benefits: [
    "Pedidos organizados por status, do preparo à entrega",
    "Controle de entregadores, rotas e taxa de entrega",
    "Cadastro de clientes com endereço e histórico",
    "Estoque de insumos com baixa por pedido",
    "Caixa, fechamento diário e relatórios de vendas",
  ],
  faq: [
    { q: "Controlo entregadores e rotas?", a: "Sim. Você organiza os pedidos por entregador e acompanha o status (rastreamento em tempo real a caminho)." },
    { q: "Guardo o endereço dos clientes?", a: "Sim. Cada cliente tem endereço, referência e histórico de pedidos para agilizar o próximo." },
  ],
  seo: {
    title: "Sistema para Delivery de Refeições | Pedidos, entregadores e caixa",
    description:
      "Software para delivery de refeições com pedidos, entregadores, rotas, taxa de entrega, estoque e financeiro.",
    keywords: ["sistema para delivery", "gestão de delivery", "pdv delivery refeições"],
    headline: "O sistema do seu delivery",
    subheadline: "Pedidos por status, entregadores, rotas, estoque e caixa em um só lugar.",
  },
};
