"use server";

import { revalidatePath } from "next/cache";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export interface FormResult {
  error?: string;
  ok?: boolean;
}

export type TableStatus = "free" | "occupied" | "reserved";

export interface RestaurantTable {
  id: string;
  label: string;
  seats: number;
  status: TableStatus;
  zone?: string;
}

function parseConfig(config: unknown): { tables?: RestaurantTable[] } {
  if (config && typeof config === "object" && !Array.isArray(config)) {
    return config as { tables?: RestaurantTable[] };
  }
  return {};
}

const DEFAULT_TABLES: RestaurantTable[] = [
  { id: "t1", label: "Mesa 1", seats: 2, status: "free", zone: "Salão" },
  { id: "t2", label: "Mesa 2", seats: 4, status: "free", zone: "Salão" },
  { id: "t3", label: "Mesa 3", seats: 4, status: "occupied", zone: "Salão" },
  { id: "t4", label: "Mesa 4", seats: 6, status: "free", zone: "Varanda" },
  { id: "t5", label: "Mesa 5", seats: 2, status: "reserved", zone: "Varanda" },
];

export async function getRestaurantTables(): Promise<RestaurantTable[]> {
  const ctx = await getAuthContext();
  const org = await prisma.organization.findUnique({ where: { id: ctx.orgId } });
  const config = parseConfig(org?.config);
  return config.tables?.length ? config.tables : DEFAULT_TABLES;
}

async function saveTables(tables: RestaurantTable[]): Promise<void> {
  const ctx = await getAuthContext();
  const org = await prisma.organization.findUnique({ where: { id: ctx.orgId } });
  const config = parseConfig(org?.config);
  await prisma.organization.update({
    where: { id: ctx.orgId },
    data: { config: { ...config, tables } as unknown as Prisma.InputJsonValue },
  });
  revalidatePath("/mesas");
}

export async function updateTableStatus(id: string, status: TableStatus): Promise<void> {
  const tables = await getRestaurantTables();
  const next = tables.map((t) => (t.id === id ? { ...t, status } : t));
  await saveTables(next);
}

export async function addRestaurantTable(label: string, seats: number, zone?: string): Promise<void> {
  const tables = await getRestaurantTables();
  const id = `t${Date.now()}`;
  await saveTables([...tables, { id, label, seats, status: "free", zone }]);
}

export async function addRestaurantTableAction(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const label = String(formData.get("label") ?? "").trim();
  const seats = parseInt(String(formData.get("seats") ?? "4"), 10);
  const zone = String(formData.get("zone") ?? "").trim() || undefined;
  if (!label) return { error: "Informe o nome da mesa" };
  if (!Number.isFinite(seats) || seats < 1) return { error: "Lugares inválidos" };
  await addRestaurantTable(label, seats, zone);
  return { ok: true };
}
