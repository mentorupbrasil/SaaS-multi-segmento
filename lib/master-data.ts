import type { MasterDataType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSegment } from "@/segments";
import type { SegmentCategory } from "@/segments/types";

export const MASTER_DATA_TYPE_LABELS: Record<MasterDataType, string> = {
  PAYMENT_METHOD: "Formas de pagamento",
  FINANCIAL_CATEGORY: "Categorias financeiras",
  SERVICE_CATEGORY: "Categorias de serviço",
  PRODUCT_CATEGORY: "Categorias de produto",
  PRODUCT_UNIT: "Unidades de produto",
  ROOM_TYPE: "Tipos de quarto",
  EVENT_TYPE: "Tipos de evento",
  GROUP_TYPE: "Tipos de grupo",
  DONATION_TYPE: "Tipos de doação",
  VACCINE: "Vacinas",
  PET_SPECIES: "Espécies de pet",
  PET_BREED: "Raças de pet",
  VEHICLE_BRAND: "Marcas de veículo",
  COMMISSION_RATE: "Taxas de comissão",
};

export const MASTER_DATA_TYPES = Object.keys(MASTER_DATA_TYPE_LABELS) as MasterDataType[];

export function isMasterDataType(value: string): value is MasterDataType {
  return value in MASTER_DATA_TYPE_LABELS;
}

export function masterDataTypeLabel(type: MasterDataType): string {
  return MASTER_DATA_TYPE_LABELS[type];
}

export interface MasterDataOption {
  value: string;
  label: string;
}

export interface CreateMasterDataInput {
  organizationId: string;
  type: MasterDataType;
  label: string;
  value?: string | null;
  sortOrder?: number;
  metadata?: Record<string, unknown>;
}

type SeedEntry = { type: MasterDataType; label: string; value?: string };

const COMMON_SEEDS: SeedEntry[] = [
  { type: "PAYMENT_METHOD", label: "Dinheiro", value: "cash" },
  { type: "PAYMENT_METHOD", label: "PIX", value: "pix" },
  { type: "PAYMENT_METHOD", label: "Cartão de crédito", value: "credit_card" },
  { type: "PAYMENT_METHOD", label: "Cartão de débito", value: "debit_card" },
  { type: "FINANCIAL_CATEGORY", label: "Receitas", value: "income" },
  { type: "FINANCIAL_CATEGORY", label: "Despesas fixas", value: "fixed_expense" },
  { type: "FINANCIAL_CATEGORY", label: "Despesas variáveis", value: "variable_expense" },
];

const CATEGORY_SEEDS: Partial<Record<SegmentCategory, SeedEntry[]>> = {
  beleza: [
    { type: "SERVICE_CATEGORY", label: "Corte", value: "corte" },
    { type: "SERVICE_CATEGORY", label: "Coloração", value: "coloracao" },
    { type: "COMMISSION_RATE", label: "10%", value: "10" },
    { type: "COMMISSION_RATE", label: "15%", value: "15" },
    { type: "COMMISSION_RATE", label: "20%", value: "20" },
  ],
  saude: [
    { type: "SERVICE_CATEGORY", label: "Consulta", value: "consulta" },
    { type: "SERVICE_CATEGORY", label: "Procedimento", value: "procedimento" },
    { type: "SERVICE_CATEGORY", label: "Exame", value: "exame" },
  ],
  automotivo: [
    { type: "VEHICLE_BRAND", label: "Chevrolet", value: "chevrolet" },
    { type: "VEHICLE_BRAND", label: "Fiat", value: "fiat" },
    { type: "VEHICLE_BRAND", label: "Volkswagen", value: "volkswagen" },
    { type: "VEHICLE_BRAND", label: "Toyota", value: "toyota" },
    { type: "COMMISSION_RATE", label: "5%", value: "5" },
    { type: "COMMISSION_RATE", label: "10%", value: "10" },
  ],
  alimentacao: [
    { type: "PRODUCT_CATEGORY", label: "Pratos", value: "pratos" },
    { type: "PRODUCT_CATEGORY", label: "Bebidas", value: "bebidas" },
    { type: "PRODUCT_CATEGORY", label: "Sobremesas", value: "sobremesas" },
    { type: "PRODUCT_UNIT", label: "Unidade", value: "un" },
    { type: "PRODUCT_UNIT", label: "Porção", value: "porcao" },
  ],
  comercio: [
    { type: "PRODUCT_CATEGORY", label: "Mercadorias", value: "mercadorias" },
    { type: "PRODUCT_CATEGORY", label: "Serviços", value: "servicos" },
    { type: "PRODUCT_UNIT", label: "Unidade", value: "un" },
    { type: "PRODUCT_UNIT", label: "Caixa", value: "cx" },
  ],
  hotelaria: [
    { type: "ROOM_TYPE", label: "Standard", value: "standard" },
    { type: "ROOM_TYPE", label: "Superior", value: "superior" },
    { type: "ROOM_TYPE", label: "Suíte", value: "suite" },
  ],
  eventos: [
    { type: "EVENT_TYPE", label: "Casamento", value: "casamento" },
    { type: "EVENT_TYPE", label: "Corporativo", value: "corporativo" },
    { type: "EVENT_TYPE", label: "Aniversário", value: "aniversario" },
  ],
  organizacoes: [
    { type: "GROUP_TYPE", label: "Ministério", value: "ministerio" },
    { type: "GROUP_TYPE", label: "Célula", value: "celula" },
    { type: "DONATION_TYPE", label: "Dízimo", value: "dizimo" },
    { type: "DONATION_TYPE", label: "Oferta", value: "oferta" },
    { type: "DONATION_TYPE", label: "Campanha", value: "campanha" },
  ],
  pet: [
    { type: "PET_SPECIES", label: "Cão", value: "cao" },
    { type: "PET_SPECIES", label: "Gato", value: "gato" },
    { type: "PET_BREED", label: "SRD", value: "srd" },
    { type: "VACCINE", label: "V8/V10", value: "v8_v10" },
    { type: "VACCINE", label: "Antirrábica", value: "antirrabica" },
  ],
  servicos: [
    { type: "SERVICE_CATEGORY", label: "Consultoria", value: "consultoria" },
    { type: "SERVICE_CATEGORY", label: "Projeto", value: "projeto" },
  ],
  educacao: [
    { type: "SERVICE_CATEGORY", label: "Mensalidade", value: "mensalidade" },
    { type: "SERVICE_CATEGORY", label: "Matrícula", value: "matricula" },
    { type: "SERVICE_CATEGORY", label: "Material", value: "material" },
  ],
};

export async function listMasterData(organizationId: string, type: MasterDataType) {
  return prisma.masterData.findMany({
    where: { organizationId, type, active: true },
    orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
  });
}

export async function getMasterDataOptions(
  organizationId: string,
  type: MasterDataType,
): Promise<MasterDataOption[]> {
  const rows = await listMasterData(organizationId, type);
  return rows.map((row) => ({
    value: row.value ?? row.id,
    label: row.label,
  }));
}

export async function createMasterData(input: CreateMasterDataInput) {
  return prisma.masterData.create({
    data: {
      organizationId: input.organizationId,
      type: input.type,
      label: input.label,
      value: input.value ?? null,
      sortOrder: input.sortOrder ?? 0,
      metadata: (input.metadata ?? {}) as Prisma.InputJsonValue,
    },
  });
}

function buildSeedEntries(segmentId: string): SeedEntry[] {
  const segment = getSegment(segmentId);
  const category = segment?.category;
  const categorySeeds = category ? (CATEGORY_SEEDS[category] ?? []) : [];
  return [...COMMON_SEEDS, ...categorySeeds];
}

/** Cria pré-cadastros padrão para uma org recém-criada (idempotente por type+value). */
export async function seedDefaultMasterData(organizationId: string, segmentId: string) {
  const entries = buildSeedEntries(segmentId);
  let created = 0;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const existing = await prisma.masterData.findFirst({
      where: {
        organizationId,
        type: entry.type,
        OR: [
          entry.value ? { value: entry.value } : { label: entry.label },
        ],
      },
    });
    if (existing) continue;

    await prisma.masterData.create({
      data: {
        organizationId,
        type: entry.type,
        label: entry.label,
        value: entry.value ?? null,
        sortOrder: i,
      },
    });
    created++;
  }

  return { created, total: entries.length };
}
