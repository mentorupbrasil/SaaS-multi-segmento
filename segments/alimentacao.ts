import type { SegmentTemplate } from "./types";

export const restaurante: SegmentTemplate = {
  id: "restaurante",
  label: "Restaurante / Lanchonete",
  slug: "restaurante",
  icon: "Utensils",
  category: "alimentacao",
  tagline: "Cardápio, comandas e estoque.",
  modules: ["clients", "services", "work_orders", "inventory", "financial", "team"],
  terms: {
    customer: "Cliente",
    customer_plural: "Clientes",
    professional: "Funcionário",
    professional_plural: "Equipe",
    service: "Item do cardápio",
    service_plural: "Cardápio",
    work_order: "Comanda",
    work_order_plural: "Comandas",
    inventory: "Estoque",
  },
  defaultServices: [
    { name: "Prato executivo", price: 28, durationMin: 0 },
    { name: "Hambúrguer artesanal", price: 32, durationMin: 0 },
    { name: "Refrigerante", price: 7, durationMin: 0 },
  ],
  benefits: [
    "Cardápio com preços sempre atualizados",
    "Comandas e pedidos por mesa",
    "Controle de estoque de insumos",
    "Caixa e relatórios de vendas do dia",
  ],
  faq: [
    { q: "Consigo controlar comandas por mesa?", a: "Sim. Cada comanda registra os itens consumidos e fecha direto no caixa." },
    { q: "Tem controle de estoque de insumos?", a: "Sim. Você acompanha a entrada e a saída de insumos e recebe alerta de estoque baixo." },
  ],
  seo: {
    title: "Sistema para Restaurante e Lanchonete | Cardápio e comandas",
    description:
      "Software para restaurante e lanchonete com cardápio, comandas, estoque e controle de caixa.",
    keywords: ["sistema para restaurante", "software lanchonete", "comanda eletrônica"],
    headline: "O sistema do seu restaurante",
    subheadline: "Cardápio, comandas, estoque de insumos e controle de caixa.",
  },
};

export const petshop: SegmentTemplate = {
  id: "petshop",
  label: "Petshop",
  slug: "petshop",
  icon: "PawPrint",
  category: "alimentacao",
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
