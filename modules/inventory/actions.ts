"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/auth-context";
import { requireMutationRole, requireCreateRole } from "@/lib/action-auth";
import { logAudit } from "@/lib/audit-log";

import { addInventoryMovement } from "@/lib/inventory-utils";

const schema = z.object({
  name: z.string().min(1, "Informe o nome"),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  quantity: z.coerce.number().int().min(0),
  minQuantity: z.coerce.number().int().min(0).optional(),
  unit: z.string().optional(),
  price: z.coerce.number().min(0).optional(),
});

export interface FormResult {
  error?: string;
  ok?: boolean;
}

export async function createInventoryItem(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireCreateRole(ctx);
  const parsed = schema.safeParse({
    name: formData.get("name"),
    sku: formData.get("sku") ?? undefined,
    barcode: formData.get("barcode") ?? undefined,
    brand: formData.get("brand") ?? undefined,
    category: formData.get("category") ?? undefined,
    quantity: formData.get("quantity") ?? 0,
    minQuantity: formData.get("minQuantity") ?? 0,
    unit: formData.get("unit") ?? "un",
    price: formData.get("price") ?? 0,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  await prisma.inventoryItem.create({
    data: {
      organizationId: ctx.orgId,
      name: parsed.data.name,
      sku: parsed.data.sku || null,
      barcode: parsed.data.barcode || null,
      brand: parsed.data.brand || null,
      category: parsed.data.category || null,
      quantity: parsed.data.quantity,
      minQuantity: parsed.data.minQuantity ?? 0,
      unit: parsed.data.unit || "un",
      price: parsed.data.price ?? 0,
    },
  });

  revalidatePath("/estoque");
  return { ok: true };
}

export async function updateInventoryItem(
  id: string,
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);

  const parsed = schema.safeParse({
    name: formData.get("name"),
    sku: formData.get("sku") ?? undefined,
    barcode: formData.get("barcode") ?? undefined,
    brand: formData.get("brand") ?? undefined,
    category: formData.get("category") ?? undefined,
    quantity: formData.get("quantity") ?? 0,
    minQuantity: formData.get("minQuantity") ?? 0,
    unit: formData.get("unit") ?? "un",
    price: formData.get("price") ?? 0,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const existing = await prisma.inventoryItem.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!existing) return { error: "Item não encontrado" };

  await prisma.inventoryItem.updateMany({
    where: { id, organizationId: ctx.orgId },
    data: {
      name: parsed.data.name,
      sku: parsed.data.sku || null,
      barcode: parsed.data.barcode || null,
      brand: parsed.data.brand || null,
      category: parsed.data.category || null,
      quantity: parsed.data.quantity,
      minQuantity: parsed.data.minQuantity ?? 0,
      unit: parsed.data.unit || "un",
      price: parsed.data.price ?? 0,
    },
  });

  await logAudit(ctx, "inventory.update", { id });
  revalidatePath("/estoque");
  return { ok: true };
}

export async function deleteInventoryItem(id: string): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);

  const existing = await prisma.inventoryItem.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!existing) return { error: "Item não encontrado" };

  await prisma.inventoryItem.deleteMany({
    where: { id, organizationId: ctx.orgId },
  });

  await logAudit(ctx, "inventory.delete", { id, name: existing.name });
  revalidatePath("/estoque");
  return { ok: true };
}

const movementSchema = z.object({
  inventoryItemId: z.string().min(1),
  type: z.enum(["IN", "OUT", "ADJUST"]),
  quantity: z.coerce.number().int().min(1),
  reason: z.string().optional(),
  supplierId: z.string().optional(),
});

export async function registerInventoryMovement(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  const parsed = movementSchema.safeParse({
    inventoryItemId: formData.get("inventoryItemId"),
    type: formData.get("type"),
    quantity: formData.get("quantity"),
    reason: formData.get("reason") ?? undefined,
    supplierId: formData.get("supplierId") ?? undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  try {
    await addInventoryMovement({
      organizationId: ctx.orgId,
      inventoryItemId: parsed.data.inventoryItemId,
      type: parsed.data.type,
      quantity: parsed.data.quantity,
      reason: parsed.data.reason,
      supplierId: parsed.data.supplierId,
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro na movimentação" };
  }

  revalidatePath("/estoque");
  return { ok: true };
}
