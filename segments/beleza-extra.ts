import type { SegmentTemplate } from "./types";

export const estetica: SegmentTemplate = {
  id: "estetica",
  label: "Clínica de Estética",
  slug: "estetica",
  icon: "Flower2",
  category: "beleza",
  tagline: "Procedimentos, avaliação e evolução com fotos.",
  modules: ["clients", "scheduling", "services", "records", "financial", "team", "inventory"],
  terms: {
    customer: "Cliente",
    customer_plural: "Clientes",
    professional: "Esteticista",
    professional_plural: "Esteticistas",
    service: "Procedimento",
    service_plural: "Procedimentos",
    appointment: "Sessão",
    appointment_plural: "Agenda",
    records: "Prontuário",
  },
  customerFields: [
    { key: "data_nascimento", label: "Data de nascimento", type: "date" },
    { key: "tipo_pele", label: "Tipo de pele", type: "select", options: ["Normal", "Seca", "Oleosa", "Mista"] },
    { key: "alergias", label: "Alergias / restrições", type: "text", placeholder: "Ex.: alergia a ácidos" },
    { key: "objetivo", label: "Objetivo do tratamento", type: "text", placeholder: "Ex.: rejuvenescimento facial" },
  ],
  defaultServices: [
    { name: "Limpeza de pele", price: 120, durationMin: 60 },
    { name: "Drenagem linfática", price: 100, durationMin: 50 },
    { name: "Peeling", price: 180, durationMin: 45 },
    { name: "Radiofrequência", price: 200, durationMin: 50 },
    { name: "Massagem modeladora", price: 110, durationMin: 60 },
  ],
  benefits: [
    "Agenda de sessões e pacotes com controle de retornos",
    "Prontuário estético com anamnese, avaliação e fotos evolutivas",
    "Acompanhamento de pacotes e sessões restantes",
    "Estoque de cosméticos com baixa por procedimento",
    "Financeiro com parcelamento e relatórios de faturamento",
  ],
  faq: [
    { q: "Consigo controlar pacotes de sessões?", a: "Sim. Você acompanha quantas sessões o cliente já usou e quantas faltam em cada pacote." },
    { q: "Tem prontuário e ficha de avaliação?", a: "Sim. Cada cliente tem anamnese, ficha de avaliação, evolução e fotos antes/depois organizadas com segurança." },
    { q: "Posso guardar termos de consentimento assinados?", a: "Sim. Você anexa documentos e consentimentos à ficha do cliente (assinatura digital a caminho)." },
  ],
  seo: {
    title: "Sistema para Clínica de Estética | Prontuário e agenda",
    description:
      "Software para clínica de estética com agenda de sessões, prontuário, fotos evolutivas, pacotes, estoque e financeiro.",
    keywords: ["sistema para estética", "agenda estética", "prontuário estético", "software clínica de estética"],
    headline: "Gestão completa para a sua clínica de estética",
    subheadline: "Agenda de sessões, prontuário com fotos evolutivas, pacotes e controle financeiro.",
  },
};

export const tatuagem: SegmentTemplate = {
  id: "tatuagem",
  label: "Studio de Tatuagem",
  slug: "studio-de-tatuagem",
  icon: "Palette",
  category: "beleza",
  tagline: "Agenda de sessões, sinais e aprovação de arte.",
  modules: ["clients", "scheduling", "services", "records", "financial", "team"],
  terms: {
    customer: "Cliente",
    customer_plural: "Clientes",
    professional: "Tatuador",
    professional_plural: "Tatuadores",
    service: "Sessão",
    service_plural: "Sessões",
    appointment: "Agendamento",
    appointment_plural: "Agenda",
    records: "Ficha",
  },
  customerFields: [
    { key: "data_nascimento", label: "Data de nascimento", type: "date" },
    { key: "alergias", label: "Alergias", type: "text", placeholder: "Ex.: látex, tintas" },
    { key: "local_tatuagem", label: "Local do corpo", type: "text", placeholder: "Ex.: antebraço" },
  ],
  defaultServices: [
    { name: "Sessão pequena", price: 200, durationMin: 60 },
    { name: "Sessão média", price: 450, durationMin: 120 },
    { name: "Sessão fechamento", price: 800, durationMin: 240 },
    { name: "Retoque", price: 0, durationMin: 60 },
  ],
  benefits: [
    "Agenda por tatuador com bloqueio de horários longos",
    "Controle de sinais e pagamentos por sessão",
    "Ficha com aprovação da arte, fotos e consentimento",
    "Histórico de trabalhos e lote dos pigmentos por cliente",
    "Financeiro e comissões da equipe",
  ],
  faq: [
    { q: "Consigo registrar o sinal do cliente?", a: "Sim. Você registra o sinal pago e o valor restante de cada sessão no financeiro." },
    { q: "Dá para guardar a aprovação da arte e o consentimento?", a: "Sim. A ficha do cliente guarda a arte aprovada, fotos, o lote dos pigmentos e o termo de consentimento." },
    { q: "Dá para ter mais de um tatuador?", a: "Sim. Cada tatuador tem a própria agenda e o controle de comissão por trabalho." },
  ],
  seo: {
    title: "Sistema para Studio de Tatuagem | Agenda, sinais e ficha",
    description:
      "Software para studio de tatuagem com agenda de sessões, sinais, aprovação de arte, consentimento, clientes e financeiro.",
    keywords: ["sistema para tatuagem", "agenda studio tatuagem", "software tatuador"],
    headline: "O sistema do seu studio de tatuagem",
    subheadline: "Agenda de sessões, sinais, aprovação de arte, ficha do cliente e controle financeiro.",
  },
};
