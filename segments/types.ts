import type { ModuleId } from "@/modules/types";

// Tipos de campos customizados por segmento (aplicados a clientes, etc.)
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
  tagline: string;
  /** modulos ligados para este segmento */
  modules: ModuleId[];
  /** nomenclatura: sobrescreve termos padrao (ex.: professional -> "Barbeiro") */
  terms: Record<string, string>;
  /** campos especificos do nicho aplicados ao cadastro de clientes */
  customerFields?: FieldDef[];
  /** servicos pre-cadastrados ao criar a conta */
  defaultServices?: DefaultService[];
  seo: SegmentSeo;
}
