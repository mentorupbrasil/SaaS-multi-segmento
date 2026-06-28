import type { ModuleId } from "@/modules/types";

// Categorias para agrupar os segmentos na vitrine.
export type SegmentCategory =
  | "beleza"
  | "saude"
  | "automotivo"
  | "alimentacao"
  | "servicos"
  | "educacao"
  | "pet"
  | "comercio"
  | "hotelaria"
  | "eventos"
  | "organizacoes";

export const CATEGORY_LABELS: Record<SegmentCategory, string> = {
  beleza: "Beleza & Estética",
  saude: "Saúde & Bem-estar",
  automotivo: "Automotivo",
  alimentacao: "Alimentação",
  servicos: "Serviços & Profissionais",
  educacao: "Educação",
  pet: "Pet",
  comercio: "Comércio",
  hotelaria: "Hotelaria",
  eventos: "Eventos",
  organizacoes: "Organizações",
};

export interface CategoryMeta {
  label: string;
  description: string;
  icon: string;
}

export const CATEGORY_META: Record<SegmentCategory, CategoryMeta> = {
  beleza: {
    label: "Beleza & Estética",
    description: "Agenda, comissões e fidelização de clientes.",
    icon: "Sparkles",
  },
  saude: {
    label: "Saúde & Bem-estar",
    description: "Consultas, prontuário e gestão de pacientes.",
    icon: "Stethoscope",
  },
  automotivo: {
    label: "Automotivo",
    description: "Ordens de serviço, veículos e peças.",
    icon: "Car",
  },
  alimentacao: {
    label: "Alimentação",
    description: "Cardápio digital, PDV, mesas, delivery e estoque.",
    icon: "Utensils",
  },
  servicos: {
    label: "Serviços & Profissionais",
    description: "Clientes, orçamentos, processos e agenda.",
    icon: "Briefcase",
  },
  educacao: {
    label: "Educação",
    description: "Alunos, turmas, aulas e mensalidades.",
    icon: "GraduationCap",
  },
  pet: {
    label: "Pet",
    description: "Clínica veterinária, pet shop, banho e tosa, hotel e prontuário.",
    icon: "PawPrint",
  },
  comercio: {
    label: "Comércio",
    description: "PDV, estoque, compras, CRM e multilojas.",
    icon: "Store",
  },
  hotelaria: {
    label: "Hotelaria",
    description: "Reservas, quartos, check-in, governança e tarifas.",
    icon: "Bed",
  },
  eventos: {
    label: "Eventos",
    description: "Orçamentos, contratos, cronograma e fornecedores.",
    icon: "PartyPopper",
  },
  organizacoes: {
    label: "Organizações",
    description: "Membros, doações, eventos, voluntários e prestação de contas.",
    icon: "HeartHandshake",
  },
};

// Ordem de exibicao das categorias.
export const CATEGORY_ORDER: SegmentCategory[] = [
  "beleza",
  "saude",
  "automotivo",
  "alimentacao",
  "comercio",
  "hotelaria",
  "eventos",
  "organizacoes",
  "servicos",
  "educacao",
  "pet",
];

export interface FieldDef {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "select";
  options?: string[];
  placeholder?: string;
}

export interface DefaultService {
  name: string;
  price: number;
  durationMin: number;
}

export interface SegmentFaq {
  q: string;
  a: string;
}

export interface SegmentSeo {
  title: string;
  description: string;
  keywords: string[];
  headline: string;
  subheadline: string;
}

// Template de um segmento/nicho. Adicionar um nicho novo = criar um destes.
export interface SegmentTemplate {
  id: string; // "barbearia"
  label: string; // "Barbearia"
  slug: string; // landing /barbearia
  icon: string; // nome de icone do lucide-react
  category: SegmentCategory;
  tagline: string;
  /** modulos ligados para este segmento */
  modules: ModuleId[];
  /** nomenclatura: sobrescreve termos padrao (ex.: professional -> "Barbeiro") */
  terms: Record<string, string>;
  /** campos especificos do nicho aplicados ao cadastro de clientes */
  customerFields?: FieldDef[];
  /** especialidades / sub-nichos dentro do segmento */
  specialties?: { id: string; label: string; fields?: FieldDef[] }[];
  /** servicos pre-cadastrados ao criar a conta */
  defaultServices?: DefaultService[];
  /** beneficios em destaque na landing do segmento */
  benefits: string[];
  /** perguntas frequentes especificas (opcional) */
  faq?: SegmentFaq[];
  seo: SegmentSeo;
}
