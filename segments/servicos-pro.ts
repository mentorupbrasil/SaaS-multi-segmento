import type { SegmentTemplate } from "./types";

// Sub-nichos adicionais de Servicos & Profissionais.

export const contabilidade: SegmentTemplate = {
  id: "contabilidade",
  label: "Contabilidade",
  slug: "contabilidade",
  icon: "Calculator",
  category: "servicos",
  tagline: "Empresas, obrigações, honorários e documentos.",
  modules: ["clients", "scheduling", "services", "records", "financial", "team"],
  terms: {
    customer: "Empresa cliente",
    customer_plural: "Empresas",
    professional: "Contador",
    professional_plural: "Contadores",
    service: "Serviço",
    service_plural: "Serviços",
    appointment: "Compromisso",
    appointment_plural: "Agenda",
    records: "Documentos",
  },
  customerFields: [
    { key: "cnpj", label: "CNPJ", type: "text" },
    { key: "regime", label: "Regime tributário", type: "select", options: ["Simples Nacional", "Lucro Presumido", "Lucro Real", "MEI"] },
    { key: "responsavel", label: "Responsável", type: "text" },
  ],
  defaultServices: [
    { name: "Honorário mensal", price: 600, durationMin: 0 },
    { name: "Abertura de empresa", price: 900, durationMin: 0 },
    { name: "Imposto de renda PF", price: 350, durationMin: 0 },
  ],
  benefits: [
    "Carteira de empresas com documentos e responsáveis",
    "Agenda de obrigações e calendário tributário",
    "Honorários mensais com cobrança recorrente",
    "Organização de guias, certificados e documentos",
    "Financeiro completo do escritório",
  ],
  faq: [
    { q: "Consigo organizar as obrigações de cada empresa?", a: "Sim. Você acompanha prazos e obrigações por empresa, com lembretes na agenda." },
    { q: "Dá para controlar honorários mensais?", a: "Sim. Você lança os honorários recorrentes e acompanha a inadimplência no financeiro." },
  ],
  seo: {
    title: "Sistema para Contabilidade | Empresas, obrigações e honorários",
    description:
      "Software para escritório de contabilidade com carteira de empresas, calendário de obrigações, honorários e documentos.",
    keywords: ["sistema para contabilidade", "software contábil", "gestão escritório contábil"],
    headline: "Gestão completa do seu escritório de contabilidade",
    subheadline: "Empresas, obrigações, honorários recorrentes e documentos em um só lugar.",
  },
};

export const consultoria: SegmentTemplate = {
  id: "consultoria",
  label: "Consultoria",
  slug: "consultoria",
  icon: "Briefcase",
  category: "servicos",
  tagline: "Projetos, cronogramas, entregas e horas.",
  modules: ["clients", "scheduling", "services", "financial", "team"],
  terms: {
    customer: "Cliente",
    customer_plural: "Clientes",
    professional: "Consultor",
    professional_plural: "Consultores",
    service: "Projeto",
    service_plural: "Projetos",
    appointment: "Reunião",
    appointment_plural: "Agenda",
  },
  customerFields: [
    { key: "empresa", label: "Empresa", type: "text" },
    { key: "segmento", label: "Segmento", type: "text" },
  ],
  defaultServices: [
    { name: "Diagnóstico inicial", price: 1500, durationMin: 0 },
    { name: "Projeto de consultoria", price: 6000, durationMin: 0 },
    { name: "Hora de consultoria", price: 350, durationMin: 60 },
  ],
  benefits: [
    "Projetos com cronograma, entregas e responsáveis",
    "Agenda de reuniões com lembretes",
    "Controle de horas trabalhadas por projeto",
    "Contratos e propostas organizados",
    "Financeiro por projeto e por cliente",
  ],
  faq: [
    { q: "Consigo acompanhar entregas e cronograma?", a: "Sim. Cada projeto tem etapas, entregas e responsáveis, com prazos na agenda." },
    { q: "Dá para registrar horas trabalhadas?", a: "Sim. Você acompanha as horas por projeto para faturar e medir a rentabilidade." },
  ],
  seo: {
    title: "Sistema para Consultoria | Projetos, entregas e horas",
    description:
      "Software para consultoria empresarial e financeira com projetos, cronogramas, entregas, horas e financeiro.",
    keywords: ["sistema para consultoria", "gestão de projetos consultoria", "software consultor"],
    headline: "O sistema da sua consultoria",
    subheadline: "Projetos, cronogramas, entregas, horas trabalhadas e financeiro.",
  },
};

export const seguros: SegmentTemplate = {
  id: "seguros",
  label: "Corretora de Seguros",
  slug: "corretora-de-seguros",
  icon: "Umbrella",
  category: "servicos",
  tagline: "Clientes, apólices, renovações e comissões.",
  modules: ["clients", "scheduling", "services", "financial", "team"],
  terms: {
    customer: "Cliente",
    customer_plural: "Clientes",
    professional: "Corretor",
    professional_plural: "Corretores",
    service: "Seguro",
    service_plural: "Seguros",
    appointment: "Compromisso",
    appointment_plural: "Agenda",
  },
  customerFields: [
    { key: "cpf_cnpj", label: "CPF/CNPJ", type: "text" },
    { key: "tipo_seguro", label: "Tipo de seguro", type: "select", options: ["Auto", "Vida", "Residencial", "Empresarial", "Saúde"] },
    { key: "vencimento", label: "Vencimento da apólice", type: "date" },
  ],
  defaultServices: [
    { name: "Seguro auto", price: 0, durationMin: 0 },
    { name: "Seguro de vida", price: 0, durationMin: 0 },
    { name: "Seguro residencial", price: 0, durationMin: 0 },
  ],
  benefits: [
    "Carteira de clientes com apólices e vencimentos",
    "Alertas de renovação para não perder cliente",
    "Funil de propostas e fechamentos",
    "Controle de comissões por apólice",
    "Financeiro da corretora",
  ],
  faq: [
    { q: "Sou avisado dos vencimentos?", a: "Sim. Você acompanha os vencimentos das apólices e organiza as renovações com antecedência." },
    { q: "Tem controle de comissão?", a: "Sim. Cada apólice fechada registra a comissão do corretor responsável." },
  ],
  seo: {
    title: "Sistema para Corretora de Seguros | Apólices e renovações",
    description:
      "Software para corretora de seguros com carteira de clientes, apólices, alertas de renovação, comissões e financeiro.",
    keywords: ["sistema para corretora de seguros", "gestão de apólices", "crm seguros"],
    headline: "O sistema da sua corretora de seguros",
    subheadline: "Clientes, apólices, alertas de renovação, comissões e financeiro.",
  },
};

export const despachante: SegmentTemplate = {
  id: "despachante",
  label: "Despachante",
  slug: "despachante",
  icon: "Stamp",
  category: "servicos",
  tagline: "Protocolos, prazos, documentos e financeiro.",
  modules: ["clients", "work_orders", "services", "financial", "team"],
  terms: {
    customer: "Cliente",
    customer_plural: "Clientes",
    professional: "Despachante",
    professional_plural: "Despachantes",
    service: "Serviço",
    service_plural: "Serviços",
    work_order: "Protocolo",
    work_order_plural: "Protocolos",
  },
  customerFields: [
    { key: "cpf_cnpj", label: "CPF/CNPJ", type: "text" },
    { key: "documento", label: "Documento / placa", type: "text" },
  ],
  defaultServices: [
    { name: "Transferência de veículo", price: 350, durationMin: 0 },
    { name: "Licenciamento", price: 180, durationMin: 0 },
    { name: "Primeiro emplacamento", price: 500, durationMin: 0 },
  ],
  benefits: [
    "Protocolos do início ao fim, com status e responsável",
    "Controle de prazos e documentos por cliente",
    "Histórico completo de cada serviço",
    "Financeiro por serviço prestado",
    "Comunicação com o cliente por WhatsApp — a caminho",
  ],
  faq: [
    { q: "Acompanho o andamento de cada serviço?", a: "Sim. Cada protocolo passa por etapas com status e responsável até a conclusão." },
    { q: "Organizo os documentos do cliente?", a: "Sim. Cada cliente tem os documentos e o histórico de serviços organizados." },
  ],
  seo: {
    title: "Sistema para Despachante | Protocolos, prazos e documentos",
    description:
      "Software para despachante com protocolos, controle de prazos, documentos por cliente e financeiro.",
    keywords: ["sistema para despachante", "gestão de despachante", "controle de protocolos"],
    headline: "O sistema do seu escritório de despachante",
    subheadline: "Protocolos, prazos, documentos por cliente e financeiro em um só lugar.",
  },
};

export const agencia: SegmentTemplate = {
  id: "agencia",
  label: "Agência de Marketing",
  slug: "agencia-de-marketing",
  icon: "Megaphone",
  category: "servicos",
  tagline: "Clientes, projetos, tarefas e contratos.",
  modules: ["clients", "scheduling", "services", "financial", "team"],
  terms: {
    customer: "Cliente",
    customer_plural: "Clientes",
    professional: "Especialista",
    professional_plural: "Equipe",
    service: "Projeto",
    service_plural: "Projetos",
    appointment: "Reunião",
    appointment_plural: "Agenda",
  },
  customerFields: [
    { key: "empresa", label: "Empresa", type: "text" },
    { key: "contrato", label: "Tipo de contrato", type: "select", options: ["Mensal (fee)", "Projeto", "Pontual"] },
  ],
  defaultServices: [
    { name: "Gestão de redes sociais (mensal)", price: 1500, durationMin: 0 },
    { name: "Tráfego pago (mensal)", price: 2000, durationMin: 0 },
    { name: "Criação de site", price: 4500, durationMin: 0 },
  ],
  benefits: [
    "Clientes com contratos e histórico de projetos",
    "Projetos e tarefas com prazos e responsáveis",
    "Agenda de reuniões e entregas",
    "Contratos mensais com cobrança recorrente",
    "Financeiro por cliente e por projeto",
  ],
  faq: [
    { q: "Consigo organizar as tarefas da equipe?", a: "Sim. Você acompanha as tarefas e entregas de cada projeto com prazos e responsáveis." },
    { q: "Dá para controlar contratos mensais?", a: "Sim. Você lança os contratos recorrentes e acompanha o financeiro de cada cliente." },
  ],
  seo: {
    title: "Sistema para Agência de Marketing | Clientes, projetos e tarefas",
    description:
      "Software para agência de marketing com gestão de clientes, projetos, tarefas, contratos recorrentes e financeiro.",
    keywords: ["sistema para agência de marketing", "gestão de agência", "gestão de projetos marketing"],
    headline: "O sistema da sua agência de marketing",
    subheadline: "Clientes, projetos, tarefas, contratos recorrentes e financeiro.",
  },
};
