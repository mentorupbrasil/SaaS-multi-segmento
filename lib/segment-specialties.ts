import type { SegmentCategory, SegmentTemplate } from "@/segments/types";

type Specialty = NonNullable<SegmentTemplate["specialties"]>[number];

export const CATEGORY_SPECIALTIES: Partial<Record<SegmentCategory, Specialty[]>> = {
  beleza: [
    { id: "corte", label: "Corte e styling" },
    { id: "coloracao", label: "Coloração" },
    { id: "estetica-facial", label: "Estética facial" },
    { id: "unhas", label: "Unhas e nail art" },
  ],
  saude: [
    { id: "clinica-geral", label: "Clínica geral" },
    { id: "especialidade", label: "Especialidade médica" },
    { id: "fisioterapia", label: "Fisioterapia" },
    { id: "odontologia", label: "Odontologia" },
    { id: "psicologia", label: "Psicologia" },
  ],
  automotivo: [
    { id: "mecanica", label: "Mecânica geral" },
    { id: "eletrica", label: "Elétrica automotiva" },
    { id: "funilaria", label: "Funilaria e pintura" },
    { id: "motos", label: "Motos" },
  ],
  alimentacao: [
    { id: "salao", label: "Salão / mesas" },
    { id: "delivery", label: "Delivery" },
    { id: "balcao", label: "Balcão / fast food" },
    { id: "buffet", label: "Buffet e eventos" },
  ],
  comercio: [
    { id: "varejo", label: "Varejo" },
    { id: "atacado", label: "Atacado" },
    { id: "ecommerce", label: "E-commerce" },
    { id: "multiloja", label: "Multilojas" },
  ],
  hotelaria: [
    { id: "hotel", label: "Hotel" },
    { id: "pousada", label: "Pousada" },
    { id: "hostel", label: "Hostel" },
    { id: "resort", label: "Resort" },
  ],
  eventos: [
    { id: "casamento", label: "Casamentos" },
    { id: "corporativo", label: "Corporativo" },
    { id: "infantil", label: "Festas infantis" },
    { id: "formatura", label: "Formaturas" },
  ],
  organizacoes: [
    { id: "igreja", label: "Igreja / templo" },
    { id: "ong", label: "ONG" },
    { id: "associacao", label: "Associação" },
    { id: "cooperativa", label: "Cooperativa" },
  ],
  servicos: [
    { id: "consultoria", label: "Consultoria" },
    { id: "juridico", label: "Jurídico" },
    { id: "contabil", label: "Contábil" },
    { id: "tecnico", label: "Serviços técnicos" },
  ],
  educacao: [
    { id: "infantil", label: "Educação infantil" },
    { id: "fundamental", label: "Ensino fundamental" },
    { id: "medio", label: "Ensino médio" },
    { id: "curso-livre", label: "Curso livre" },
    { id: "tecnico", label: "Ensino técnico" },
  ],
  pet: [
    { id: "clinica-vet", label: "Clínica veterinária" },
    { id: "banho-tosa", label: "Banho e tosa" },
    { id: "pet-shop", label: "Pet shop" },
    { id: "hotel-pet", label: "Hotel para pets" },
  ],
};

/** Mescla especialidades explícitas do segmento com defaults da categoria. */
export function withDefaultSpecialties(segment: SegmentTemplate): SegmentTemplate {
  if (segment.specialties?.length) return segment;
  const defaults = CATEGORY_SPECIALTIES[segment.category];
  if (!defaults?.length) return segment;
  return { ...segment, specialties: defaults };
}
