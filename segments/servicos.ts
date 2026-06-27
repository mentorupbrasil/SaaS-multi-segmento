import type { SegmentTemplate } from "./types";

export const advogado: SegmentTemplate = {
  id: "advogado",
  label: "Advogado / Escritório",
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
    service: "Serviço",
    service_plural: "Serviços",
    appointment: "Compromisso",
    appointment_plural: "Agenda",
    records: "Processos",
  },
  customerFields: [
    { key: "cpf_cnpj", label: "CPF/CNPJ", type: "text" },
    { key: "area", label: "Área", type: "select", options: ["Cível", "Trabalhista", "Criminal", "Tributário", "Família"] },
  ],
  defaultServices: [
    { name: "Consulta jurídica", price: 300, durationMin: 60 },
    { name: "Elaboração de contrato", price: 800, durationMin: 0 },
  ],
  benefits: [
    "Agenda de audiências e reuniões com lembretes",
    "Cadastro de clientes e processos vinculados",
    "Controle de honorários e contratos",
    "Financeiro completo do escritório",
  ],
  faq: [
    { q: "Consigo vincular processos a cada cliente?", a: "Sim. Cada cliente tem os processos e compromissos organizados em um só lugar." },
    { q: "Dá para controlar honorários?", a: "Sim. Você registra os honorários e acompanha o que está a receber no financeiro." },
  ],
  seo: {
    title: "Sistema para Advogados | Clientes, processos e agenda",
    description:
      "Software para escritório de advocacia com agenda, clientes, processos, honorários e financeiro.",
    keywords: ["sistema para advogado", "software jurídico", "gestão escritório advocacia"],
    headline: "Gestão completa para o seu escritório de advocacia",
    subheadline: "Clientes, processos, agenda de compromissos e controle de honorários.",
  },
};

export const assistencia: SegmentTemplate = {
  id: "assistencia",
  label: "Assistência Técnica",
  slug: "assistencia-tecnica",
  icon: "Cpu",
  category: "servicos",
  tagline: "Ordens de serviço e controle de aparelhos.",
  modules: ["clients", "work_orders", "services", "inventory", "financial", "team"],
  terms: {
    customer: "Cliente",
    customer_plural: "Clientes",
    professional: "Técnico",
    professional_plural: "Técnicos",
    service: "Serviço",
    service_plural: "Serviços",
    work_order: "Ordem de Serviço",
    work_order_plural: "Ordens de Serviço",
    inventory: "Peças / Estoque",
  },
  customerFields: [
    { key: "aparelho", label: "Aparelho", type: "text", placeholder: "Ex.: Notebook Dell" },
    { key: "defeito", label: "Defeito relatado", type: "text" },
  ],
  defaultServices: [
    { name: "Orçamento / diagnóstico", price: 0, durationMin: 30 },
    { name: "Formatação", price: 120, durationMin: 60 },
    { name: "Troca de tela", price: 350, durationMin: 90 },
  ],
  benefits: [
    "Ordens de serviço do recebimento à entrega",
    "Controle de aparelhos e defeitos relatados",
    "Estoque de peças com baixa automática",
    "Financeiro por ordem de serviço",
  ],
  faq: [
    { q: "Consigo acompanhar o status do conserto?", a: "Sim. Cada ordem de serviço passa por etapas, do diagnóstico à entrega ao cliente." },
    { q: "Dá para controlar peças usadas?", a: "Sim. As peças usadas na ordem de serviço baixam do estoque automaticamente." },
  ],
  seo: {
    title: "Sistema para Assistência Técnica | Ordem de serviço",
    description:
      "Software para assistência técnica com ordem de serviço, controle de aparelhos, estoque de peças e financeiro.",
    keywords: ["sistema para assistência técnica", "ordem de serviço assistência", "software assistência técnica"],
    headline: "O sistema da sua assistência técnica",
    subheadline: "Ordens de serviço, controle de aparelhos, estoque de peças e financeiro.",
  },
};

export const imobiliaria: SegmentTemplate = {
  id: "imobiliaria",
  label: "Imobiliária / Corretor",
  slug: "imobiliaria",
  icon: "Building2",
  category: "servicos",
  tagline: "Clientes, visitas e negociações.",
  modules: ["clients", "scheduling", "services", "financial", "team"],
  terms: {
    customer: "Cliente",
    customer_plural: "Clientes",
    professional: "Corretor",
    professional_plural: "Corretores",
    service: "Serviço",
    service_plural: "Serviços",
    appointment: "Visita",
    appointment_plural: "Agenda",
  },
  customerFields: [
    { key: "interesse", label: "Interesse", type: "select", options: ["Comprar", "Alugar", "Vender"] },
    { key: "tipo_imovel", label: "Tipo de imóvel", type: "text" },
  ],
  defaultServices: [
    { name: "Intermediação de venda", price: 0, durationMin: 0 },
    { name: "Intermediação de locação", price: 0, durationMin: 0 },
  ],
  benefits: [
    "Agenda de visitas aos imóveis",
    "Funil de clientes por interesse",
    "Controle de comissões por negócio",
    "Financeiro da carteira de clientes",
  ],
  faq: [
    { q: "Consigo organizar os clientes por interesse?", a: "Sim. Você separa quem quer comprar, alugar ou vender e acompanha cada negociação." },
    { q: "Tem controle de comissão?", a: "Sim. Cada negócio fechado registra a comissão do corretor responsável." },
  ],
  seo: {
    title: "Sistema para Imobiliária e Corretores | Clientes e visitas",
    description:
      "Software para imobiliária e corretores com agenda de visitas, funil de clientes, comissões e financeiro.",
    keywords: ["sistema para imobiliária", "crm imobiliário", "software corretor de imóveis"],
    headline: "O sistema da sua imobiliária",
    subheadline: "Agenda de visitas, funil de clientes, comissões e financeiro.",
  },
};

export const obras: SegmentTemplate = {
  id: "obras",
  label: "Reformas & Obras",
  slug: "reformas-e-obras",
  icon: "Hammer",
  category: "servicos",
  tagline: "Orçamentos, clientes e agenda para profissionais de obra.",
  modules: ["clients", "scheduling", "services", "financial", "team"],
  terms: {
    customer: "Cliente",
    customer_plural: "Clientes",
    professional: "Profissional",
    professional_plural: "Equipe",
    service: "Serviço",
    service_plural: "Serviços",
    appointment: "Visita",
    appointment_plural: "Agenda",
  },
  defaultServices: [
    { name: "Visita técnica", price: 0, durationMin: 60 },
    { name: "Reforma (m²)", price: 0, durationMin: 0 },
  ],
  benefits: [
    "Orçamentos detalhados de serviços",
    "Agenda de visitas técnicas e obras",
    "Controle de clientes e propostas",
    "Financeiro por obra, com entradas e saídas",
  ],
  faq: [
    { q: "Consigo montar orçamento por obra?", a: "Sim. Você cria os serviços e monta orçamentos para cada cliente e obra." },
    { q: "Dá para acompanhar o financeiro de cada obra?", a: "Sim. Você lança entradas e saídas e acompanha o resultado de cada obra." },
  ],
  seo: {
    title: "Sistema para Reformas e Obras | Orçamentos e agenda",
    description:
      "Software para pedreiros, pintores, eletricistas e empresas de reforma com orçamentos, agenda e financeiro.",
    keywords: ["sistema para reformas", "orçamento de obra", "software construção civil"],
    headline: "O sistema para profissionais de reformas e obras",
    subheadline: "Orçamentos, agenda de visitas, clientes e controle financeiro por obra.",
  },
};
