import type { SegmentTemplate } from "./types";

// Sub-nichos de Hotelaria.

const baseTerms = {
  customer: "Hóspede",
  customer_plural: "Hóspedes",
  professional: "Colaborador",
  professional_plural: "Equipe",
  service: "Acomodação",
  service_plural: "Acomodações",
  appointment: "Reserva",
  appointment_plural: "Reservas",
};

const baseModules = ["clients", "scheduling", "services", "financial", "team"] as const;

const guestFields = [
  { key: "documento", label: "Documento (RG/CPF)", type: "text" as const },
  { key: "nacionalidade", label: "Nacionalidade", type: "text" as const },
  { key: "preferencias", label: "Preferências", type: "text" as const, placeholder: "Ex.: quarto no térreo" },
];

export const hotel: SegmentTemplate = {
  id: "hotel",
  label: "Hotel",
  slug: "hotel",
  icon: "Hotel",
  category: "hotelaria",
  tagline: "Reservas, quartos, check-in e tarifas.",
  modules: [...baseModules, "work_orders"],
  terms: {
    ...baseTerms,
    work_order: "Ordem de Serviço",
    work_order_plural: "Ordens de Serviço",
  },
  customerFields: guestFields,
  defaultServices: [
    { name: "Standard duplo", price: 220, durationMin: 0 },
    { name: "Superior duplo", price: 320, durationMin: 0 },
    { name: "Suíte", price: 480, durationMin: 0 },
  ],
  benefits: [
    "Gestão de reservas com controle de overbooking",
    "Mapa de quartos com status em tempo real",
    "Check-in e check-out ágeis na recepção",
    "Governança (housekeeping) com checklist",
    "Financeiro com diárias, pacotes e centros de custo",
  ],
  faq: [
    { q: "Controlo overbooking?", a: "Sim. O sistema organiza reservas por quarto e tipo de acomodação, evitando conflitos (channel manager a caminho)." },
    { q: "Vejo o status dos quartos?", a: "Sim. Cada quarto tem status: livre, ocupado, reservado, em limpeza ou em manutenção." },
  ],
  seo: {
    title: "Sistema para Hotel | Reservas, quartos e check-in",
    description: "Software PMS para hotel com reservas, gestão de quartos, check-in, governança, tarifas e financeiro.",
    keywords: ["sistema para hotel", "pms hotel", "gestão de reservas hotel"],
    headline: "O PMS completo do seu hotel",
    subheadline: "Reservas, quartos, check-in, governança, tarifas e financeiro em um só lugar.",
  },
};

export const pousada: SegmentTemplate = {
  id: "pousada",
  label: "Pousada",
  slug: "pousada",
  icon: "Home",
  category: "hotelaria",
  tagline: "Reservas, café da manhã e controle simples.",
  modules: [...baseModules],
  terms: baseTerms,
  customerFields: guestFields,
  defaultServices: [
    { name: "Quarto duplo", price: 180, durationMin: 0 },
    { name: "Quarto triplo", price: 240, durationMin: 0 },
    { name: "Café da manhã (adicional)", price: 35, durationMin: 0 },
  ],
  benefits: [
    "Reservas online, por telefone e presencial",
    "Pacotes de temporada e feriados",
    "Controle de quartos com status simples",
    "Café da manhã e extras na conta do hóspede",
    "Financeiro com diárias e pacotes",
  ],
  faq: [
    { q: "Funciona para pousada pequena?", a: "Sim. O sistema é pensado para poucos quartos, com reservas e check-in sem complexidade." },
    { q: "Incluo café da manhã na reserva?", a: "Sim. Você cadastra pacotes com café da manhã e extras na conta do hóspede." },
  ],
  seo: {
    title: "Sistema para Pousada | Reservas e café da manhã",
    description: "Software para pousada com reservas, pacotes de temporada, café da manhã, quartos e financeiro.",
    keywords: ["sistema para pousada", "reservas pousada", "pms pousada"],
    headline: "O sistema da sua pousada",
    subheadline: "Reservas, pacotes de temporada, café da manhã e controle de quartos.",
  },
};

export const hostel: SegmentTemplate = {
  id: "hostel",
  label: "Hostel",
  slug: "hostel",
  icon: "BedDouble",
  category: "hotelaria",
  tagline: "Camas, dormitórios e reservas compartilhadas.",
  modules: [...baseModules],
  terms: {
    ...baseTerms,
    service: "Leito",
    service_plural: "Leitos",
  },
  customerFields: guestFields,
  defaultServices: [
    { name: "Dormitório misto (leito)", price: 65, durationMin: 0 },
    { name: "Dormitório feminino (leito)", price: 75, durationMin: 0 },
    { name: "Quarto privativo duplo", price: 160, durationMin: 0 },
  ],
  benefits: [
    "Reserva por leito ou quarto privativo",
    "Controle de ocupação por dormitório",
    "Check-in rápido para grupos",
    "Consumo de bar e lavanderia na conta",
    "Financeiro com diárias e pacotes",
  ],
  faq: [
    { q: "Reservo por leito?", a: "Sim. Você cadastra dormitórios com leitos e reserva individual ou quarto privativo." },
    { q: "Atendo grupos?", a: "Sim. Reservas de grupos com vários leitos ficam organizadas no mesmo check-in." },
  ],
  seo: {
    title: "Sistema para Hostel | Reservas por leito",
    description: "Software para hostel com reservas por leito, dormitórios, quartos privativos e financeiro.",
    keywords: ["sistema para hostel", "reservas hostel", "gestão dormitório"],
    headline: "O sistema do seu hostel",
    subheadline: "Reservas por leito, dormitórios, grupos e controle financeiro.",
  },
};

export const resort: SegmentTemplate = {
  id: "resort",
  label: "Resort",
  slug: "resort",
  icon: "Palmtree",
  category: "hotelaria",
  tagline: "Pacotes, recreação e múltiplos serviços.",
  modules: [...baseModules, "work_orders"],
  terms: {
    ...baseTerms,
    work_order: "Ordem de Serviço",
    work_order_plural: "Ordens de Serviço",
  },
  customerFields: guestFields,
  defaultServices: [
    { name: "Pacote all inclusive (diária)", price: 890, durationMin: 0 },
    { name: "Suíte premium", price: 650, durationMin: 0 },
    { name: "Passeio / excursão", price: 120, durationMin: 0 },
  ],
  benefits: [
    "Pacotes completos com refeições e atividades",
    "Reservas de recreação, spa e passeios",
    "Consumo integrado (bar, restaurante, room service)",
    "Gestão de quartos e áreas comuns",
    "Financeiro com pacotes e centros de custo",
  ],
  faq: [
    { q: "Monto pacotes all inclusive?", a: "Sim. Você cadastra pacotes com diária, refeições e atividades incluídas." },
    { q: "Controlo passeios e spa?", a: "Sim. Os serviços extras entram na conta do hóspede com controle de consumo." },
  ],
  seo: {
    title: "Sistema para Resort | Pacotes e recreação",
    description: "Software para resort com pacotes, recreação, spa, passeios, reservas e financeiro integrado.",
    keywords: ["sistema para resort", "pms resort", "pacotes all inclusive"],
    headline: "O PMS do seu resort",
    subheadline: "Pacotes, recreação, spa, consumo integrado e gestão de quartos.",
  },
};

export const motel: SegmentTemplate = {
  id: "motel",
  label: "Motel",
  slug: "motel",
  icon: "Moon",
  category: "hotelaria",
  tagline: "Ocupação por período e consumo em tempo real.",
  modules: [...baseModules],
  terms: {
    ...baseTerms,
    appointment: "Período",
    appointment_plural: "Ocupações",
  },
  customerFields: [
    { key: "placa", label: "Placa do veículo", type: "text" as const },
  ],
  defaultServices: [
    { name: "Período 4h", price: 120, durationMin: 0 },
    { name: "Período 6h", price: 150, durationMin: 0 },
    { name: "Período 12h", price: 200, durationMin: 0 },
  ],
  benefits: [
    "Controle por período com ocupação rápida",
    "Status das suítes em tempo real",
    "Consumo de frigobar na conta automaticamente",
    "Privacidade reforçada no cadastro",
    "Caixa e fechamento por turno",
  ],
  faq: [
    { q: "Controlo por período?", a: "Sim. Cada suíte registra o período contratado com início e fim automáticos." },
    { q: "Frigobar integrado?", a: "Sim. O consumo entra na conta do hóspede e fecha no checkout (integração completa a caminho)." },
  ],
  seo: {
    title: "Sistema para Motel | Período e consumo",
    description: "Software para motel com controle por período, status das suítes, consumo em tempo real e caixa.",
    keywords: ["sistema para motel", "controle período motel", "pms motel"],
    headline: "O sistema do seu motel",
    subheadline: "Ocupação por período, status das suítes, consumo e caixa.",
  },
};

export const flat: SegmentTemplate = {
  id: "flat",
  label: "Flat",
  slug: "flat",
  icon: "Building2",
  category: "hotelaria",
  tagline: "Proprietários, locações e rateio.",
  modules: [...baseModules, "work_orders"],
  terms: {
    ...baseTerms,
    customer: "Inquilino",
    customer_plural: "Inquilinos",
    work_order: "Ordem de Serviço",
    work_order_plural: "Ordens de Serviço",
  },
  customerFields: [
    { key: "proprietario", label: "Proprietário", type: "text" as const },
    { key: "contrato", label: "Nº do contrato", type: "text" as const },
  ],
  defaultServices: [
    { name: "Diária flat", price: 280, durationMin: 0 },
    { name: "Mensalidade", price: 3200, durationMin: 0 },
    { name: "Taxa de limpeza", price: 150, durationMin: 0 },
  ],
  benefits: [
    "Controle de proprietários e unidades",
    "Locações por diária ou mensalidade",
    "Rateio de receitas por proprietário — a caminho",
    "Manutenção e governança por unidade",
    "Financeiro com repasses e centros de custo",
  ],
  faq: [
    { q: "Controlo proprietários?", a: "Sim. Cada unidade tem o proprietário vinculado, com histórico de locações e receitas." },
    { q: "Faço rateio de receita?", a: "O rateio automático por proprietário está no roadmap; hoje você acompanha receitas por unidade." },
  ],
  seo: {
    title: "Sistema para Flat | Proprietários e locações",
    description: "Software para flat com gestão de proprietários, locações, rateio de receitas, manutenção e financeiro.",
    keywords: ["sistema para flat", "gestão flat", "rateio proprietários"],
    headline: "O sistema do seu flat",
    subheadline: "Proprietários, locações, rateio de receitas, manutenção e financeiro.",
  },
};

export const apartHotel: SegmentTemplate = {
  id: "apart-hotel",
  label: "Apart Hotel",
  slug: "apart-hotel",
  icon: "Bed",
  category: "hotelaria",
  tagline: "Apartamentos, diárias e serviços.",
  modules: [...baseModules, "work_orders"],
  terms: {
    ...baseTerms,
    service: "Apartamento",
    service_plural: "Apartamentos",
    work_order: "Ordem de Serviço",
    work_order_plural: "Ordens de Serviço",
  },
  customerFields: guestFields,
  defaultServices: [
    { name: "Studio (diária)", price: 250, durationMin: 0 },
    { name: "Apartamento 1 quarto", price: 350, durationMin: 0 },
    { name: "Apartamento 2 quartos", price: 480, durationMin: 0 },
  ],
  benefits: [
    "Reservas por apartamento com cozinha equipada",
    "Serviços de limpeza e lavanderia",
    "Consumo de frigobar e room service",
    "Estadias curtas e longas (mensal)",
    "Financeiro com diárias e pacotes",
  ],
  faq: [
    { q: "Atendo diária e mensal?", a: "Sim. Você reserva por diária ou contrato mensal, com tarifas diferentes." },
    { q: "Controlo limpeza?", a: "Sim. A governança organiza a limpeza por apartamento com checklist e status." },
  ],
  seo: {
    title: "Sistema para Apart Hotel | Apartamentos e reservas",
    description: "Software para apart hotel com reservas, apartamentos, serviços, governança e financeiro.",
    keywords: ["sistema apart hotel", "pms apart hotel", "reservas apartamento"],
    headline: "O sistema do seu apart hotel",
    subheadline: "Apartamentos, reservas, serviços, governança e financeiro.",
  },
};

export const chales: SegmentTemplate = {
  id: "chales",
  label: "Chalés",
  slug: "chales",
  icon: "TreePine",
  category: "hotelaria",
  tagline: "Chalés, temporada e reservas.",
  modules: [...baseModules],
  terms: {
    ...baseTerms,
    service: "Chalé",
    service_plural: "Chalés",
  },
  customerFields: guestFields,
  defaultServices: [
    { name: "Chalé casal", price: 450, durationMin: 0 },
    { name: "Chalé família", price: 650, durationMin: 0 },
    { name: "Pacote fim de semana", price: 890, durationMin: 0 },
  ],
  benefits: [
    "Reservas por chalé com fotos e equipamentos",
    "Pacotes de temporada e feriados",
    "Check-in com instruções e consumo integrado",
    "Manutenção e limpeza por unidade",
    "Financeiro com diárias e pacotes",
  ],
  faq: [
    { q: "Reservo chalé individual?", a: "Sim. Cada chalé é uma unidade com calendário de reservas próprio." },
    { q: "Monto pacotes de fim de semana?", a: "Sim. Você cria pacotes com diárias e extras para temporada." },
  ],
  seo: {
    title: "Sistema para Chalés | Reservas e pacotes",
    description: "Software para chalés com reservas, pacotes de temporada, manutenção, limpeza e financeiro.",
    keywords: ["sistema para chalés", "reservas chalé", "pms chalés"],
    headline: "O sistema dos seus chalés",
    subheadline: "Reservas por chalé, pacotes de temporada, manutenção e financeiro.",
  },
};

export const hotelFazenda: SegmentTemplate = {
  id: "hotel-fazenda",
  label: "Hotel Fazenda",
  slug: "hotel-fazenda",
  icon: "Feather",
  category: "hotelaria",
  tagline: "Hospedagem, passeios e pacotes rurais.",
  modules: [...baseModules, "work_orders"],
  terms: {
    ...baseTerms,
    work_order: "Ordem de Serviço",
    work_order_plural: "Ordens de Serviço",
  },
  customerFields: guestFields,
  defaultServices: [
    { name: "Pacote família (diária)", price: 780, durationMin: 0 },
    { name: "Quarto duplo", price: 420, durationMin: 0 },
    { name: "Passeio a cavalo", price: 80, durationMin: 0 },
  ],
  benefits: [
    "Pacotes com hospedagem, refeições e atividades",
    "Reservas de passeios e recreação",
    "Controle de quartos e áreas rurais",
    "Consumo integrado (bar, restaurante)",
    "Financeiro com pacotes e eventos",
  ],
  faq: [
    { q: "Monto pacotes com passeios?", a: "Sim. Você cadastra pacotes com diária, refeições e atividades incluídas." },
    { q: "Controlo eventos?", a: "Sim. Reservas corporativas e eventos ficam organizados com salões e pacotes (a caminho)." },
  ],
  seo: {
    title: "Sistema para Hotel Fazenda | Pacotes e passeios",
    description: "Software para hotel fazenda com pacotes, passeios, recreação, reservas e financeiro.",
    keywords: ["sistema hotel fazenda", "pms fazenda", "pacotes hotel rural"],
    headline: "O sistema do seu hotel fazenda",
    subheadline: "Pacotes rurais, passeios, recreação, reservas e financeiro.",
  },
};

export const camping: SegmentTemplate = {
  id: "camping",
  label: "Camping",
  slug: "camping",
  icon: "Tent",
  category: "hotelaria",
  tagline: "Vagas, barracas e reservas.",
  modules: [...baseModules],
  terms: {
    ...baseTerms,
    service: "Vaga",
    service_plural: "Vagas",
    appointment: "Reserva",
    appointment_plural: "Reservas",
  },
  customerFields: guestFields,
  defaultServices: [
    { name: "Vaga barraca (diária)", price: 45, durationMin: 0 },
    { name: "Vaga motorhome", price: 85, durationMin: 0 },
    { name: "Aluguel de barraca", price: 120, durationMin: 0 },
  ],
  benefits: [
    "Reserva de vagas por tipo (barraca, motorhome)",
    "Mapa do camping com ocupação",
    "Check-in rápido na entrada",
    "Consumo de bar e loja na conta",
    "Financeiro com diárias e aluguel de equipamentos",
  ],
  faq: [
    { q: "Reservo vaga específica?", a: "Sim. Você cadastra vagas no mapa do camping com reserva por data." },
    { q: "Alugo barraca e equipamentos?", a: "Sim. Você cadastra aluguel de barraca e extras na reserva." },
  ],
  seo: {
    title: "Sistema para Camping | Vagas e reservas",
    description: "Software para camping com reservas de vagas, barracas, motorhome, mapa de ocupação e financeiro.",
    keywords: ["sistema para camping", "reservas camping", "gestão camping"],
    headline: "O sistema do seu camping",
    subheadline: "Vagas, barracas, motorhome, mapa de ocupação e financeiro.",
  },
};

export const coloniaFerias: SegmentTemplate = {
  id: "colonia-ferias",
  label: "Colônia de Férias",
  slug: "colonia-de-ferias",
  icon: "Sun",
  category: "hotelaria",
  tagline: "Temporadas, grupos e atividades.",
  modules: [...baseModules],
  terms: {
    ...baseTerms,
    customer: "Participante",
    customer_plural: "Participantes",
    service: "Temporada",
    service_plural: "Temporadas",
    appointment: "Inscrição",
    appointment_plural: "Inscrições",
  },
  customerFields: [
    { key: "responsavel", label: "Responsável", type: "text" as const },
    { key: "idade", label: "Idade", type: "number" as const },
    { key: "alergias", label: "Alergias / restrições", type: "text" as const },
  ],
  defaultServices: [
    { name: "Temporada janeiro (semana)", price: 890, durationMin: 0 },
    { name: "Temporada julho (semana)", price: 890, durationMin: 0 },
    { name: "Day use", price: 120, durationMin: 0 },
  ],
  benefits: [
    "Inscrições por temporada e faixa etária",
    "Controle de participantes e responsáveis",
    "Atividades e grupos organizados",
    "Alojamento e refeições no pacote",
    "Financeiro com parcelamento e convênios",
  ],
  faq: [
    { q: "Controlo inscrições por temporada?", a: "Sim. Cada temporada tem vagas, faixa etária e pacote com atividades." },
    { q: "Cadastro de responsáveis?", a: "Sim. Cada participante tem responsável, documentos e observações de saúde." },
  ],
  seo: {
    title: "Sistema para Colônia de Férias | Temporadas e inscrições",
    description: "Software para colônia de férias com inscrições, temporadas, grupos, atividades, alojamento e financeiro.",
    keywords: ["sistema colônia de férias", "inscrições colônia", "gestão colônia"],
    headline: "O sistema da sua colônia de férias",
    subheadline: "Inscrições, temporadas, grupos, atividades, alojamento e financeiro.",
  },
};
