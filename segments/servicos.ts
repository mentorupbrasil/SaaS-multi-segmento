import type { SegmentTemplate } from "./types";

export const advogado: SegmentTemplate = {
  id: "advogado",
  label: "Advogado / Escritorio",
  slug: "advocacia",
  icon: "Scale",
  category: "servicos",
  tagline: "Clientes, processos e compromissos.",
  modules: ["clients", "scheduling", "services", "records", "financial", "team"],
  terms: {
    customer: "Cliente",
    customer_plural: "Clientes",
    professional: "Advogado",
    professional_plural: "Advogados",
    service: "Servico",
    service_plural: "Servicos",
    appointment: "Compromisso",
    appointment_plural: "Agenda",
    records: "Processos",
  },
  customerFields: [
    { key: "cpf_cnpj", label: "CPF/CNPJ", type: "text" },
    { key: "area", label: "Area", type: "select", options: ["Civel", "Trabalhista", "Criminal", "Tributario", "Familia"] },
  ],
  defaultServices: [
    { name: "Consulta juridica", price: 300, durationMin: 60 },
    { name: "Elaboracao de contrato", price: 800, durationMin: 0 },
  ],
  benefits: [
    "Agenda de audiencias e reunioes",
    "Cadastro de clientes e processos",
    "Controle de honorarios e contratos",
    "Financeiro do escritorio",
  ],
  seo: {
    title: "Sistema para Advogados | Clientes, processos e agenda",
    description:
      "Software para escritorio de advocacia com agenda, clientes, processos, honorarios e financeiro.",
    keywords: ["sistema para advogado", "software juridico", "gestao escritorio advocacia"],
    headline: "Gestao completa para o seu escritorio de advocacia",
    subheadline: "Clientes, processos, agenda de compromissos e controle de honorarios.",
  },
};

export const assistencia: SegmentTemplate = {
  id: "assistencia",
  label: "Assistencia Tecnica",
  slug: "assistencia-tecnica",
  icon: "Cpu",
  category: "servicos",
  tagline: "Ordens de servico e controle de aparelhos.",
  modules: ["clients", "work_orders", "services", "inventory", "financial", "team"],
  terms: {
    customer: "Cliente",
    customer_plural: "Clientes",
    professional: "Tecnico",
    professional_plural: "Tecnicos",
    service: "Servico",
    service_plural: "Servicos",
    work_order: "Ordem de Servico",
    work_order_plural: "Ordens de Servico",
    inventory: "Pecas / Estoque",
  },
  customerFields: [
    { key: "aparelho", label: "Aparelho", type: "text", placeholder: "Ex.: Notebook Dell" },
    { key: "defeito", label: "Defeito relatado", type: "text" },
  ],
  defaultServices: [
    { name: "Orcamento / diagnostico", price: 0, durationMin: 30 },
    { name: "Formatacao", price: 120, durationMin: 60 },
    { name: "Troca de tela", price: 350, durationMin: 90 },
  ],
  benefits: [
    "Ordens de servico do recebimento a entrega",
    "Controle de aparelhos e defeitos",
    "Estoque de pecas",
    "Financeiro por OS",
  ],
  seo: {
    title: "Sistema para Assistencia Tecnica | Ordem de servico",
    description:
      "Software para assistencia tecnica com ordem de servico, controle de aparelhos, estoque de pecas e financeiro.",
    keywords: ["sistema para assistencia tecnica", "ordem de servico assistencia", "software assistencia tecnica"],
    headline: "O sistema da sua assistencia tecnica",
    subheadline: "Ordens de servico, controle de aparelhos, estoque de pecas e financeiro.",
  },
};

export const imobiliaria: SegmentTemplate = {
  id: "imobiliaria",
  label: "Imobiliaria / Corretor",
  slug: "imobiliaria",
  icon: "Building2",
  category: "servicos",
  tagline: "Clientes, visitas e negociacoes.",
  modules: ["clients", "scheduling", "services", "financial", "team"],
  terms: {
    customer: "Cliente",
    customer_plural: "Clientes",
    professional: "Corretor",
    professional_plural: "Corretores",
    service: "Servico",
    service_plural: "Servicos",
    appointment: "Visita",
    appointment_plural: "Agenda",
  },
  customerFields: [
    { key: "interesse", label: "Interesse", type: "select", options: ["Comprar", "Alugar", "Vender"] },
    { key: "tipo_imovel", label: "Tipo de imovel", type: "text" },
  ],
  defaultServices: [
    { name: "Intermediacao de venda", price: 0, durationMin: 0 },
    { name: "Intermediacao de locacao", price: 0, durationMin: 0 },
  ],
  benefits: [
    "Agenda de visitas",
    "Funil de clientes e interesses",
    "Controle de comissoes",
    "Financeiro da carteira",
  ],
  seo: {
    title: "Sistema para Imobiliaria e Corretores | Clientes e visitas",
    description:
      "Software para imobiliaria e corretores com agenda de visitas, funil de clientes, comissoes e financeiro.",
    keywords: ["sistema para imobiliaria", "crm imobiliario", "software corretor de imoveis"],
    headline: "O sistema da sua imobiliaria",
    subheadline: "Agenda de visitas, funil de clientes, comissoes e financeiro.",
  },
};

export const obras: SegmentTemplate = {
  id: "obras",
  label: "Reformas & Obras",
  slug: "reformas-e-obras",
  icon: "Hammer",
  category: "servicos",
  tagline: "Orcamentos, clientes e agenda para profissionais de obra.",
  modules: ["clients", "scheduling", "services", "financial", "team"],
  terms: {
    customer: "Cliente",
    customer_plural: "Clientes",
    professional: "Profissional",
    professional_plural: "Equipe",
    service: "Servico",
    service_plural: "Servicos",
    appointment: "Visita",
    appointment_plural: "Agenda",
  },
  defaultServices: [
    { name: "Visita tecnica", price: 0, durationMin: 60 },
    { name: "Reforma (m2)", price: 0, durationMin: 0 },
  ],
  benefits: [
    "Orcamentos e servicos",
    "Agenda de visitas e obras",
    "Controle de clientes",
    "Financeiro por obra",
  ],
  seo: {
    title: "Sistema para Reformas e Obras | Orcamentos e agenda",
    description:
      "Software para pedreiros, pintores, eletricistas e empresas de reforma com orcamentos, agenda e financeiro.",
    keywords: ["sistema para reformas", "orcamento de obra", "software construcao civil"],
    headline: "O sistema para profissionais de reformas e obras",
    subheadline: "Orcamentos, agenda de visitas, clientes e controle financeiro por obra.",
  },
};
