import { z } from "zod";
import { prisma } from "@/lib/db";
import { sumLineItems } from "@/lib/inventory-utils";

export const lineItemTypeEnum = z.enum(["SERVICE", "PART", "LABOR"]);

export const lineItemFieldsSchema = z.object({
  type: lineItemTypeEnum.default("SERVICE"),
  description: z.string().min(1, "Informe a descrição"),
  quantity: z.coerce.number().min(0.01, "Quantidade inválida"),
  unitPrice: z.coerce.number().min(0, "Preço inválido"),
  serviceId: z.string().optional(),
  inventoryItemId: z.string().optional(),
});

export type LineItemFields = z.infer<typeof lineItemFieldsSchema>;

export function buildLineItemData(parsed: LineItemFields) {
  return {
    type: parsed.type,
    description: parsed.description,
    quantity: parsed.quantity,
    unitPrice: parsed.unitPrice,
    serviceId: parsed.serviceId || null,
    inventoryItemId: parsed.inventoryItemId || null,
  };
}

/** SaleItem aceita type opcional (default SERVICE). */
export function buildSaleItemData(parsed: LineItemFields) {
  const { type, ...rest } = buildLineItemData(parsed);
  return { type, ...rest };
}

type DocumentKind = "quote" | "workOrder" | "sale";

export async function recalcDocumentTotal(
  kind: DocumentKind,
  parentId: string,
  organizationId: string,
): Promise<number> {
  if (kind === "quote") {
    const items = await prisma.quoteItem.findMany({ where: { quoteId: parentId } });
    const total = sumLineItems(items);
    await prisma.quote.updateMany({ where: { id: parentId, organizationId }, data: { total } });
    return total;
  }
  if (kind === "workOrder") {
    const items = await prisma.workOrderItem.findMany({ where: { workOrderId: parentId } });
    const total = sumLineItems(items);
    await prisma.workOrder.updateMany({ where: { id: parentId, organizationId }, data: { total } });
    return total;
  }
  const items = await prisma.saleItem.findMany({ where: { saleId: parentId } });
  const total = sumLineItems(items);
  await prisma.sale.updateMany({ where: { id: parentId, organizationId }, data: { total } });
  return total;
}

export function recalcQuoteTotal(parentId: string, organizationId: string) {
  return recalcDocumentTotal("quote", parentId, organizationId);
}

export function recalcWorkOrderTotal(parentId: string, organizationId: string) {
  return recalcDocumentTotal("workOrder", parentId, organizationId);
}

export function recalcSaleTotal(parentId: string, organizationId: string) {
  return recalcDocumentTotal("sale", parentId, organizationId);
}
