import { prisma } from "@/lib/db";
import type { WorkOrderItemType } from "@prisma/client";

export function calcLineTotal(quantity: number, unitPrice: number): number {
  return Math.round(quantity * unitPrice * 100) / 100;
}

export function sumLineItems(items: { quantity: number; unitPrice: number }[]): number {
  return items.reduce((sum, i) => sum + calcLineTotal(i.quantity, i.unitPrice), 0);
}

/** Baixa estoque ao adicionar peça na OS e registra movimentação. */
export async function deductInventoryForWorkOrder(params: {
  organizationId: string;
  workOrderId: string;
  inventoryItemId: string;
  quantity: number;
  reason?: string;
}) {
  const item = await prisma.inventoryItem.findFirst({
    where: { id: params.inventoryItemId, organizationId: params.organizationId },
  });
  if (!item) throw new Error("Item de estoque não encontrado");
  if (item.quantity < params.quantity) {
    throw new Error(`Estoque insuficiente de "${item.name}"`);
  }

  await prisma.$transaction([
    prisma.inventoryItem.update({
      where: { id: item.id },
      data: { quantity: item.quantity - params.quantity },
    }),
    prisma.inventoryMovement.create({
      data: {
        organizationId: params.organizationId,
        inventoryItemId: item.id,
        type: "OUT",
        quantity: params.quantity,
        reason: params.reason ?? "Baixa por ordem de serviço",
        workOrderId: params.workOrderId,
      },
    }),
  ]);
}

/** Entrada de estoque (compra, ajuste positivo). */
export async function addInventoryMovement(params: {
  organizationId: string;
  inventoryItemId: string;
  type: "IN" | "OUT" | "ADJUST";
  quantity: number;
  reason?: string;
  supplierId?: string;
  workOrderId?: string;
}) {
  const item = await prisma.inventoryItem.findFirst({
    where: { id: params.inventoryItemId, organizationId: params.organizationId },
  });
  if (!item) throw new Error("Item não encontrado");

  let newQty = item.quantity;
  if (params.type === "IN") newQty += params.quantity;
  else if (params.type === "OUT") {
    if (item.quantity < params.quantity) throw new Error("Estoque insuficiente");
    newQty -= params.quantity;
  } else {
    newQty = params.quantity;
  }

  await prisma.$transaction([
    prisma.inventoryItem.update({ where: { id: item.id }, data: { quantity: newQty } }),
    prisma.inventoryMovement.create({
      data: {
        organizationId: params.organizationId,
        inventoryItemId: item.id,
        type: params.type,
        quantity: params.quantity,
        reason: params.reason,
        supplierId: params.supplierId,
        workOrderId: params.workOrderId,
      },
    }),
  ]);
}

export async function recalcWorkOrderTotal(workOrderId: string, organizationId: string) {
  const items = await prisma.workOrderItem.findMany({ where: { workOrderId } });
  const total = sumLineItems(items);
  await prisma.workOrder.updateMany({
    where: { id: workOrderId, organizationId },
    data: { total },
  });
  return total;
}

export async function recalcQuoteTotal(quoteId: string, organizationId: string) {
  const items = await prisma.quoteItem.findMany({ where: { quoteId } });
  const total = sumLineItems(items);
  await prisma.quote.updateMany({
    where: { id: quoteId, organizationId },
    data: { total },
  });
  return total;
}

export async function recalcSaleTotal(saleId: string, organizationId: string) {
  const items = await prisma.saleItem.findMany({ where: { saleId } });
  const total = sumLineItems(items);
  await prisma.sale.updateMany({
    where: { id: saleId, organizationId },
    data: { total },
  });
  return total;
}

export type LineItemInput = {
  type: WorkOrderItemType;
  description: string;
  quantity: number;
  unitPrice: number;
  serviceId?: string;
  inventoryItemId?: string;
};
