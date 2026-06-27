import type { SegmentTemplate } from "./types";

export const restaurante: SegmentTemplate = {
  id: "restaurante",
  label: "Restaurante",
  slug: "restaurante",
  icon: "Utensils",
  category: "alimentacao",
  tagline: "Cardápio, comandas por mesa, estoque e caixa.",
  modules: ["clients", "services", "work_orders", "inventory", "financial", "team"],
  terms: {
    customer: "Cliente",
    customer_plural: "Clientes",
    professional: "Funcionário",
    professional_plural: "Equipe",
    service: "Item do cardápio",
    service_plural: "Itens do cardápio",
    work_order: "Comanda",
    work_order_plural: "Comandas",
    inventory: "Estoque",
  },
  customerFields: [
    { key: "endereco", label: "Endereço de entrega", type: "text", placeholder: "Rua, número, bairro" },
    { key: "referencia", label: "Ponto de referência", type: "text" },
    { key: "preferencias", label: "Preferências / restrições", type: "text", placeholder: "Ex.: sem cebola" },
  ],
  defaultServices: [
    { name: "Prato executivo", price: 32, durationMin: 0 },
    { name: "Prato à la carte", price: 58, durationMin: 0 },
    { name: "Porção", price: 45, durationMin: 0 },
    { name: "Refrigerante", price: 8, durationMin: 0 },
    { name: "Sobremesa", price: 18, durationMin: 0 },
  ],
  benefits: [
    "Comandas por mesa e pedidos no balcão em um só caixa",
    "Cardápio com preços sempre atualizados",
    "Controle de estoque de insumos com ficha técnica",
    "Caixa, fechamento diário e relatórios de vendas",
    "Pronto para delivery e cardápio digital por QR Code",
  ],
  faq: [
    { q: "Consigo controlar comandas por mesa?", a: "Sim. Cada comanda registra os itens consumidos por mesa e fecha direto no caixa." },
    { q: "Tem controle de estoque de insumos?", a: "Sim. Você acompanha entrada e saída de insumos e recebe alerta de estoque baixo." },
    { q: "Funciona para delivery?", a: "Sim. Você organiza pedidos de balcão, mesa e delivery no mesmo sistema (cardápio digital e integrações a caminho)." },
  ],
  seo: {
    title: "Sistema para Restaurante | Comandas, cardápio e estoque",
    description:
      "Software para restaurante com comandas por mesa, cardápio, PDV, estoque com ficha técnica, delivery e financeiro.",
    keywords: ["sistema para restaurante", "comanda eletrônica", "pdv restaurante", "software restaurante"],
    headline: "O sistema completo do seu restaurante",
    subheadline: "Comandas por mesa, cardápio, estoque com ficha técnica, delivery e caixa em um só lugar.",
  },
};

export const petshop: SegmentTemplate = {
  id: "petshop",
  label: "Petshop",
  slug: "petshop",
  icon: "PawPrint",
  category: "servicos",
  tagline: "Agenda de banho e tosa, tutores e pets.",
  modules: ["clients", "scheduling", "services", "inventory", "financial", "team"],
  terms: {
    customer: "Tutor",
    customer_plural: "Tutores",
    professional: "Profissional",
    professional_plural: "Profissionais",
    service: "Serviço",
    service_plural: "Serviços",
    appointment: "Agendamento",
    appointment_plural: "Agenda",
    inventory: "Produtos / Estoque",
  },
  customerFields: [
    { key: "pet", label: "Nome do pet", type: "text" },
    { key: "especie", label: "Espécie / Raça", type: "text" },
    { key: "porte", label: "Porte", type: "select", options: ["Pequeno", "Médio", "Grande"] },
  ],
  defaultServices: [
    { name: "Banho", price: 50, durationMin: 60 },
    { name: "Banho e tosa", price: 90, durationMin: 90 },
    { name: "Tosa higiênica", price: 45, durationMin: 40 },
  ],
  benefits: [
    "Agenda de banho e tosa por profissional",
    "Cadastro de tutores e pets com histórico",
    "Venda de produtos com controle de estoque",
    "Financeiro e programa de fidelidade",
  ],
  faq: [
    { q: "Consigo cadastrar mais de um pet por tutor?", a: "Sim. Cada tutor pode ter vários pets, cada um com o próprio histórico de serviços." },
    { q: "Vendo produtos além dos serviços?", a: "Sim. Você cadastra produtos com estoque e vende junto com os serviços." },
  ],
  seo: {
    title: "Sistema para Petshop | Banho e tosa, tutores e pets",
    description:
      "Software para petshop com agenda de banho e tosa, cadastro de pets, vendas, estoque e financeiro.",
    keywords: ["sistema para petshop", "agenda banho e tosa", "software petshop"],
    headline: "O sistema do seu petshop",
    subheadline: "Agenda de banho e tosa, cadastro de pets, vendas e controle financeiro.",
  },
};
