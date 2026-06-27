import type { SegmentTemplate } from "./types";

export const restaurante: SegmentTemplate = {
  id: "restaurante",
  label: "Restaurante / Lanchonete",
  slug: "restaurante",
  icon: "Utensils",
  category: "alimentacao",
  tagline: "Cardapio, comandas e estoque.",
  modules: ["clients", "services", "work_orders", "inventory", "financial", "team"],
  terms: {
    customer: "Cliente",
    customer_plural: "Clientes",
    professional: "Funcionario",
    professional_plural: "Equipe",
    service: "Item do cardapio",
    service_plural: "Cardapio",
    work_order: "Comanda",
    work_order_plural: "Comandas",
    inventory: "Estoque",
  },
  defaultServices: [
    { name: "Prato executivo", price: 28, durationMin: 0 },
    { name: "Hamburguer artesanal", price: 32, durationMin: 0 },
    { name: "Refrigerante", price: 7, durationMin: 0 },
  ],
  benefits: [
    "Cardapio com precos",
    "Comandas e pedidos",
    "Controle de estoque de insumos",
    "Caixa e relatorios de vendas",
  ],
  seo: {
    title: "Sistema para Restaurante e Lanchonete | Cardapio e comandas",
    description:
      "Software para restaurante e lanchonete com cardapio, comandas, estoque e controle de caixa.",
    keywords: ["sistema para restaurante", "software lanchonete", "comanda eletronica"],
    headline: "O sistema do seu restaurante",
    subheadline: "Cardapio, comandas, estoque de insumos e controle de caixa.",
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
    service: "Servico",
    service_plural: "Servicos",
    appointment: "Agendamento",
    appointment_plural: "Agenda",
    inventory: "Produtos / Estoque",
  },
  customerFields: [
    { key: "pet", label: "Nome do pet", type: "text" },
    { key: "especie", label: "Especie / Raca", type: "text" },
    { key: "porte", label: "Porte", type: "select", options: ["Pequeno", "Medio", "Grande"] },
  ],
  defaultServices: [
    { name: "Banho", price: 50, durationMin: 60 },
    { name: "Banho e tosa", price: 90, durationMin: 90 },
    { name: "Tosa higienica", price: 45, durationMin: 40 },
  ],
  benefits: [
    "Agenda de banho e tosa",
    "Cadastro de tutores e pets",
    "Venda de produtos com estoque",
    "Financeiro e fidelidade",
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
