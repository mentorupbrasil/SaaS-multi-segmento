import type { SegmentTemplate } from "./types";

// Sub-nichos adicionais de Automotivo.

const vehicleFields = [
  { key: "veiculo", label: "Veículo / modelo", type: "text" as const, placeholder: "Ex.: Onix 1.0" },
  { key: "placa", label: "Placa", type: "text" as const },
  { key: "ano", label: "Ano", type: "number" as const },
  { key: "km", label: "Quilometragem", type: "number" as const },
];

const osTerms = {
  customer: "Cliente",
  customer_plural: "Clientes",
  service: "Serviço",
  service_plural: "Serviços",
  work_order: "Ordem de Serviço",
  work_order_plural: "Ordens de Serviço",
  inventory: "Peças / Estoque",
};

export const centroAutomotivo: SegmentTemplate = {
  id: "centro-automotivo",
  label: "Centro Automotivo",
  slug: "centro-automotivo",
  icon: "Car",
  category: "automotivo",
  tagline: "Agenda, OS, peças e financeiro.",
  modules: ["clients", "scheduling", "work_orders", "services", "inventory", "financial", "team"],
  terms: { ...osTerms, professional: "Mecânico", professional_plural: "Mecânicos", appointment: "Agendamento", appointment_plural: "Agenda" },
  customerFields: vehicleFields,
  defaultServices: [
    { name: "Revisão completa", price: 450, durationMin: 120 },
    { name: "Troca de óleo", price: 150, durationMin: 40 },
    { name: "Alinhamento e balanceamento", price: 120, durationMin: 60 },
    { name: "Diagnóstico eletrônico", price: 100, durationMin: 40 },
  ],
  benefits: [
    "Agenda por mecânico e por box/elevador",
    "Ordens de serviço com checklist, fotos e aprovação",
    "Estoque de peças com baixa automática pela OS",
    "Histórico completo de cada veículo",
    "Financeiro com comissão da equipe",
  ],
  faq: [
    { q: "Atende vários tipos de serviço?", a: "Sim. O centro automotivo organiza mecânica, revisões e serviços rápidos com a mesma OS digital." },
    { q: "Tenho o histórico do veículo?", a: "Sim. Cada veículo guarda o histórico de serviços, independente de trocar de proprietário." },
  ],
  seo: {
    title: "Sistema para Centro Automotivo | Agenda, OS e estoque",
    description:
      "Software para centro automotivo e auto center com agenda, ordem de serviço, estoque de peças e financeiro.",
    keywords: ["sistema para centro automotivo", "auto center", "ordem de serviço automotiva"],
    headline: "O sistema do seu centro automotivo",
    subheadline: "Agenda, ordens de serviço digitais, estoque de peças e financeiro em um só lugar.",
  },
};

export const autoEletrica: SegmentTemplate = {
  id: "auto-eletrica",
  label: "Auto Elétrica",
  slug: "auto-eletrica",
  icon: "Zap",
  category: "automotivo",
  tagline: "Diagnóstico elétrico, OS e peças.",
  modules: ["clients", "work_orders", "services", "inventory", "financial", "team"],
  terms: { ...osTerms, professional: "Eletricista", professional_plural: "Eletricistas" },
  customerFields: vehicleFields,
  defaultServices: [
    { name: "Diagnóstico elétrico", price: 120, durationMin: 60 },
    { name: "Troca de bateria", price: 80, durationMin: 30 },
    { name: "Reparo do alternador", price: 300, durationMin: 120 },
    { name: "Instalação de som/acessórios", price: 200, durationMin: 90 },
  ],
  benefits: [
    "Ordens de serviço com diagnóstico e fotos",
    "Histórico elétrico de cada veículo",
    "Estoque de peças e componentes",
    "Orçamentos com aprovação do cliente",
    "Financeiro por ordem de serviço",
  ],
  faq: [
    { q: "Registro o diagnóstico na OS?", a: "Sim. Cada OS guarda o diagnóstico, os serviços executados e as peças usadas." },
    { q: "Controlo o estoque de peças?", a: "Sim. As peças usadas na OS baixam do estoque automaticamente." },
  ],
  seo: {
    title: "Sistema para Auto Elétrica | OS, diagnóstico e peças",
    description:
      "Software para auto elétrica com ordem de serviço, diagnóstico, histórico do veículo, estoque e financeiro.",
    keywords: ["sistema para auto elétrica", "ordem de serviço auto elétrica", "software auto elétrica"],
    headline: "O sistema da sua auto elétrica",
    subheadline: "Ordens de serviço, diagnóstico, estoque de peças e financeiro.",
  },
};

export const borracharia: SegmentTemplate = {
  id: "borracharia",
  label: "Borracharia",
  slug: "borracharia",
  icon: "Disc3",
  category: "automotivo",
  tagline: "Pneus, rodízio, balanceamento e caixa.",
  modules: ["clients", "work_orders", "services", "inventory", "financial", "team"],
  terms: { ...osTerms, professional: "Borracheiro", professional_plural: "Borracheiros", inventory: "Pneus / Estoque" },
  customerFields: vehicleFields,
  defaultServices: [
    { name: "Conserto de pneu", price: 30, durationMin: 20 },
    { name: "Balanceamento", price: 60, durationMin: 30 },
    { name: "Alinhamento", price: 80, durationMin: 40 },
    { name: "Rodízio de pneus", price: 40, durationMin: 30 },
  ],
  benefits: [
    "Atendimento rápido com OS simples",
    "Controle de pneus, rodízio e vida útil",
    "Estoque de pneus e materiais",
    "Histórico de serviços por veículo",
    "Caixa e relatórios de faturamento",
  ],
  faq: [
    { q: "Controlo a vida útil dos pneus?", a: "Sim. Você acompanha rodízio, balanceamento e o histórico de cada veículo." },
    { q: "Tem controle de estoque?", a: "Sim. Os pneus e materiais usados baixam do estoque automaticamente." },
  ],
  seo: {
    title: "Sistema para Borracharia | Pneus, rodízio e caixa",
    description:
      "Software para borracharia com controle de pneus, rodízio, balanceamento, estoque e financeiro.",
    keywords: ["sistema para borracharia", "controle de pneus", "software borracharia"],
    headline: "O sistema da sua borracharia",
    subheadline: "Pneus, rodízio, balanceamento, estoque e caixa em um só lugar.",
  },
};

export const esteticaAutomotiva: SegmentTemplate = {
  id: "estetica-automotiva",
  label: "Estética Automotiva",
  slug: "estetica-automotiva",
  icon: "Sparkles",
  category: "automotivo",
  tagline: "Polimento, vitrificação e histórico fotográfico.",
  modules: ["clients", "scheduling", "services", "financial", "team"],
  terms: {
    customer: "Cliente",
    customer_plural: "Clientes",
    professional: "Especialista",
    professional_plural: "Especialistas",
    service: "Serviço",
    service_plural: "Serviços",
    appointment: "Agendamento",
    appointment_plural: "Agenda",
  },
  customerFields: [
    { key: "veiculo", label: "Veículo", type: "text" },
    { key: "placa", label: "Placa", type: "text" },
    { key: "cor", label: "Cor", type: "text" },
  ],
  defaultServices: [
    { name: "Polimento técnico", price: 350, durationMin: 180 },
    { name: "Vitrificação", price: 900, durationMin: 0 },
    { name: "Higienização interna", price: 250, durationMin: 120 },
    { name: "Cristalização de vidros", price: 150, durationMin: 60 },
  ],
  benefits: [
    "Agenda de serviços com controle de capacidade",
    "Histórico fotográfico antes e depois",
    "Pacotes e planos de manutenção da estética",
    "Cadastro de veículos por cliente",
    "Financeiro e fidelização",
  ],
  faq: [
    { q: "Guardo as fotos antes e depois?", a: "Sim. Cada serviço guarda o histórico fotográfico do veículo para mostrar o resultado." },
    { q: "Trabalho com pacotes?", a: "Sim. Você cria pacotes (polimento, vitrificação) e acompanha o uso de cada cliente." },
  ],
  seo: {
    title: "Sistema para Estética Automotiva | Polimento e vitrificação",
    description:
      "Software para estética automotiva com agenda, histórico fotográfico, polimento, vitrificação, pacotes e financeiro.",
    keywords: ["sistema para estética automotiva", "agenda polimento", "software vitrificação"],
    headline: "O sistema da sua estética automotiva",
    subheadline: "Agenda, histórico fotográfico, pacotes de polimento e vitrificação e financeiro.",
  },
};

export const funilaria: SegmentTemplate = {
  id: "funilaria",
  label: "Funilaria e Pintura",
  slug: "funilaria-e-pintura",
  icon: "SprayCan",
  category: "automotivo",
  tagline: "Reparos por etapas, fotos e materiais.",
  modules: ["clients", "work_orders", "services", "inventory", "financial", "team"],
  terms: { ...osTerms, professional: "Funileiro", professional_plural: "Funileiros", inventory: "Materiais / Estoque" },
  customerFields: vehicleFields,
  defaultServices: [
    { name: "Reparo de lataria", price: 600, durationMin: 0 },
    { name: "Pintura de para-choque", price: 450, durationMin: 0 },
    { name: "Polimento pós-pintura", price: 200, durationMin: 120 },
    { name: "Funilaria completa", price: 0, durationMin: 0 },
  ],
  benefits: [
    "Controle do reparo por etapas com status",
    "Fotos dos danos e do andamento",
    "Orçamento com aprovação do cliente",
    "Controle de materiais e tinta",
    "Financeiro por ordem de serviço",
  ],
  faq: [
    { q: "Acompanho o reparo por etapas?", a: "Sim. Cada OS passa por etapas com status e fotos, do dano à entrega." },
    { q: "Registro os danos com fotos?", a: "Sim. Você anexa fotos dos danos e do andamento em cada ordem de serviço." },
  ],
  seo: {
    title: "Sistema para Funilaria e Pintura | Reparos por etapas",
    description:
      "Software para funilaria e pintura com controle por etapas, fotos dos danos, orçamento, materiais e financeiro.",
    keywords: ["sistema para funilaria", "software pintura automotiva", "ordem de serviço funilaria"],
    headline: "O sistema da sua funilaria e pintura",
    subheadline: "Reparos por etapas, fotos dos danos, orçamento aprovado e controle de materiais.",
  },
};

export const oficinaMotos: SegmentTemplate = {
  id: "oficina-motos",
  label: "Oficina de Motos",
  slug: "oficina-de-motos",
  icon: "Bike",
  category: "automotivo",
  tagline: "OS, peças e histórico da moto.",
  modules: ["clients", "work_orders", "services", "inventory", "financial", "team"],
  terms: { ...osTerms, professional: "Mecânico", professional_plural: "Mecânicos", inventory: "Peças / Estoque" },
  customerFields: [
    { key: "moto", label: "Moto / modelo", type: "text", placeholder: "Ex.: CG 160" },
    { key: "placa", label: "Placa", type: "text" },
    { key: "ano", label: "Ano", type: "number" },
    { key: "km", label: "Quilometragem", type: "number" },
  ],
  defaultServices: [
    { name: "Troca de óleo", price: 70, durationMin: 30 },
    { name: "Revisão completa", price: 250, durationMin: 90 },
    { name: "Troca de relação", price: 180, durationMin: 60 },
    { name: "Regulagem de freios", price: 60, durationMin: 30 },
  ],
  benefits: [
    "Ordens de serviço do orçamento ao fechamento",
    "Histórico de manutenções por moto",
    "Estoque de peças com baixa automática",
    "Plano de revisão e lembretes",
    "Financeiro por ordem de serviço",
  ],
  faq: [
    { q: "Guardo o histórico da moto?", a: "Sim. Cada moto tem o histórico de manutenções e revisões organizado." },
    { q: "Tem controle de garantia?", a: "Sim. Você registra a garantia dos serviços e acompanha retornos." },
  ],
  seo: {
    title: "Sistema para Oficina de Motos | OS, peças e histórico",
    description:
      "Software para oficina de motos com ordem de serviço, histórico de manutenções, estoque de peças e financeiro.",
    keywords: ["sistema para oficina de motos", "ordem de serviço moto", "software oficina moto"],
    headline: "O sistema da sua oficina de motos",
    subheadline: "Ordens de serviço, histórico da moto, estoque de peças e financeiro.",
  },
};

export const oficinaCaminhoes: SegmentTemplate = {
  id: "oficina-caminhoes",
  label: "Oficina de Caminhões",
  slug: "oficina-de-caminhoes",
  icon: "Truck",
  category: "automotivo",
  tagline: "OS pesadas, frotas, peças e financeiro.",
  modules: ["clients", "work_orders", "services", "inventory", "financial", "team"],
  terms: { ...osTerms, professional: "Mecânico", professional_plural: "Mecânicos", inventory: "Peças / Estoque" },
  customerFields: [
    { key: "veiculo", label: "Caminhão / modelo", type: "text" },
    { key: "placa", label: "Placa", type: "text" },
    { key: "frota", label: "Frota / empresa", type: "text" },
    { key: "km", label: "Quilometragem", type: "number" },
  ],
  defaultServices: [
    { name: "Revisão de freios", price: 800, durationMin: 0 },
    { name: "Troca de óleo (diesel)", price: 600, durationMin: 90 },
    { name: "Manutenção de suspensão", price: 1200, durationMin: 0 },
    { name: "Diagnóstico eletrônico", price: 250, durationMin: 60 },
  ],
  benefits: [
    "Ordens de serviço para veículos pesados",
    "Gestão de frotas por empresa cliente",
    "Histórico completo de cada caminhão",
    "Estoque de peças com baixa automática",
    "Financeiro com faturamento por frota",
  ],
  faq: [
    { q: "Atende frotas?", a: "Sim. Você organiza os caminhões por empresa/frota e acompanha o histórico de cada um." },
    { q: "Tenho o histórico do veículo?", a: "Sim. Cada caminhão guarda todas as manutenções e serviços realizados." },
  ],
  seo: {
    title: "Sistema para Oficina de Caminhões | Frotas, OS e peças",
    description:
      "Software para oficina de caminhões com ordem de serviço, gestão de frotas, histórico do veículo, estoque e financeiro.",
    keywords: ["sistema para oficina de caminhões", "gestão de frota", "ordem de serviço caminhão"],
    headline: "O sistema da sua oficina de caminhões",
    subheadline: "Ordens de serviço, gestão de frotas, estoque de peças e financeiro.",
  },
};

export const trocaOleo: SegmentTemplate = {
  id: "troca-oleo",
  label: "Troca de Óleo",
  slug: "troca-de-oleo",
  icon: "Droplets",
  category: "automotivo",
  tagline: "Atendimento rápido, lembretes e histórico.",
  modules: ["clients", "work_orders", "services", "inventory", "financial", "team"],
  terms: { ...osTerms, professional: "Técnico", professional_plural: "Técnicos", inventory: "Óleos / Estoque" },
  customerFields: vehicleFields,
  defaultServices: [
    { name: "Troca de óleo + filtro", price: 160, durationMin: 30 },
    { name: "Troca de filtro de ar", price: 60, durationMin: 20 },
    { name: "Troca de filtro de combustível", price: 90, durationMin: 30 },
    { name: "Aditivo / arrefecimento", price: 70, durationMin: 20 },
  ],
  benefits: [
    "Atendimento rápido com registro por veículo",
    "Lembrete automático da próxima troca (km/data)",
    "Estoque de óleos e filtros com baixa automática",
    "Histórico de trocas por veículo",
    "Caixa e relatórios de faturamento",
  ],
  faq: [
    { q: "O sistema lembra a próxima troca?", a: "Sim. Com base na quilometragem e na data, você programa o lembrete da próxima troca (envio automático a caminho)." },
    { q: "Controlo o estoque de óleo?", a: "Sim. Os óleos e filtros usados baixam do estoque automaticamente." },
  ],
  seo: {
    title: "Sistema para Troca de Óleo | Lembretes e histórico",
    description:
      "Software para troca de óleo com atendimento rápido, lembrete da próxima troca, estoque de óleos e financeiro.",
    keywords: ["sistema para troca de óleo", "lembrete troca de óleo", "software troca de óleo"],
    headline: "O sistema do seu ponto de troca de óleo",
    subheadline: "Atendimento rápido, lembrete da próxima troca, estoque e caixa.",
  },
};

export const lojaPneus: SegmentTemplate = {
  id: "loja-pneus",
  label: "Loja de Pneus",
  slug: "loja-de-pneus",
  icon: "CircleDot",
  category: "automotivo",
  tagline: "Venda de pneus, montagem e estoque.",
  modules: ["clients", "work_orders", "services", "inventory", "financial", "team"],
  terms: { ...osTerms, professional: "Técnico", professional_plural: "Técnicos", inventory: "Pneus / Estoque" },
  customerFields: vehicleFields,
  defaultServices: [
    { name: "Pneu (unidade)", price: 0, durationMin: 0 },
    { name: "Montagem e balanceamento", price: 80, durationMin: 40 },
    { name: "Alinhamento", price: 90, durationMin: 40 },
    { name: "Rodízio", price: 40, durationMin: 30 },
  ],
  benefits: [
    "Venda de pneus com controle de estoque por medida",
    "Montagem, balanceamento e alinhamento na mesma OS",
    "Histórico de pneus por veículo",
    "Compras e fornecedores",
    "Caixa, parcelamento e relatórios",
  ],
  faq: [
    { q: "Controlo o estoque por medida?", a: "Sim. Você cadastra os pneus por medida e marca, com baixa automática na venda." },
    { q: "Faço a montagem na mesma venda?", a: "Sim. A OS junta a venda do pneu e os serviços de montagem e balanceamento." },
  ],
  seo: {
    title: "Sistema para Loja de Pneus | Venda, montagem e estoque",
    description:
      "Software para loja de pneus com venda, montagem, balanceamento, controle de estoque por medida e financeiro.",
    keywords: ["sistema para loja de pneus", "controle de estoque de pneus", "software pneus"],
    headline: "O sistema da sua loja de pneus",
    subheadline: "Venda de pneus, montagem, balanceamento, estoque por medida e caixa.",
  },
};
