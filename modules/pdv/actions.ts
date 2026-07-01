"use server";



import { revalidatePath } from "next/cache";

import { z } from "zod";

import { prisma } from "@/lib/db";

import { getAuthContext } from "@/lib/auth-context";
import { requireMutationRole, requireCreateRole } from "@/lib/action-auth";
import { logAudit } from "@/lib/audit-log";

import { addInventoryMovement } from "@/lib/inventory-utils";
import { recalcSaleTotal, lineItemFieldsSchema, buildSaleItemData } from "@/lib/line-items";
import { requireOpenCashShift } from "@/lib/cash-shift-utils";



export interface FormResult {

  error?: string;

  ok?: boolean;

  id?: string;

}



export async function createSale(

  _prev: FormResult,

  formData: FormData,

): Promise<FormResult> {

  const ctx = await getAuthContext();

  requireCreateRole(ctx);

  const customerId = (formData.get("customerId") as string) || undefined;

  const tableLabel = (formData.get("tableLabel") as string) || undefined;



  const sale = await prisma.sale.create({

    data: {

      organizationId: ctx.orgId,

      customerId: customerId || null,

      tableLabel: tableLabel || null,

      status: "OPEN",

    },

  });



  revalidatePath("/pdv");

  return { ok: true, id: sale.id };

}



const itemSchema = lineItemFieldsSchema.extend({
  saleId: z.string().min(1),
});



export async function addSaleItem(

  _prev: FormResult,

  formData: FormData,

): Promise<FormResult> {

  const ctx = await getAuthContext();

  const parsed = itemSchema.safeParse({
    saleId: formData.get("saleId"),
    type: formData.get("type") || undefined,
    description: formData.get("description"),
    quantity: formData.get("quantity"),
    unitPrice: formData.get("unitPrice"),
    serviceId: formData.get("serviceId") || undefined,
    inventoryItemId: formData.get("inventoryItemId") || undefined,
  });

  if (!parsed.success) {

    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  }



  const sale = await prisma.sale.findFirst({

    where: { id: parsed.data.saleId, organizationId: ctx.orgId, status: "OPEN" },

  });

  if (!sale) return { error: "Venda não encontrada ou já fechada" };



  await prisma.saleItem.create({
    data: {
      saleId: sale.id,
      ...buildSaleItemData(parsed.data),
    },
  });



  if (parsed.data.inventoryItemId) {

    try {

      await addInventoryMovement({

        organizationId: ctx.orgId,

        inventoryItemId: parsed.data.inventoryItemId,

        type: "OUT",

        quantity: Math.ceil(parsed.data.quantity),

        reason: "Venda PDV",

      });

    } catch (e) {

      return { error: e instanceof Error ? e.message : "Erro no estoque" };

    }

  }



  await recalcSaleTotal(sale.id, ctx.orgId);

  revalidatePath("/pdv");

  return { ok: true };

}



export async function finalizeSale(

  saleId: string,

  paymentMethod: string,

): Promise<FormResult> {

  const ctx = await getAuthContext();

  const sale = await prisma.sale.findFirst({

    where: { id: saleId, organizationId: ctx.orgId },

  });

  if (!sale) return { error: "Venda não encontrada" };

  if (sale.total <= 0) return { error: "Adicione itens antes de finalizar" };

  const cashShift = await requireOpenCashShift(ctx.orgId);
  if (!cashShift.ok) return { error: cashShift.error };

  await prisma.sale.update({

    where: { id: saleId },

    data: { status: "PAID", paymentMethod },

  });



  await prisma.financialEntry.create({

    data: {

      organizationId: ctx.orgId,

      customerId: sale.customerId,

      saleId: sale.id,

      type: "INCOME",

      description: sale.tableLabel ? `Venda — ${sale.tableLabel}` : "Venda PDV",

      amount: sale.total,

      status: "PAID",

      paidAt: new Date(),

    },

  });



  revalidatePath("/pdv");

  revalidatePath("/financeiro");

  return { ok: true };

}



export async function cancelSale(saleId: string): Promise<FormResult> {

  const ctx = await getAuthContext();

  const sale = await prisma.sale.findFirst({

    where: { id: saleId, organizationId: ctx.orgId },

    include: { items: true },

  });

  if (!sale) return { error: "Venda não encontrada" };

  if (sale.status !== "OPEN") return { error: "Somente vendas abertas podem ser canceladas" };



  for (const item of sale.items) {

    if (item.inventoryItemId) {

      await addInventoryMovement({

        organizationId: ctx.orgId,

        inventoryItemId: item.inventoryItemId,

        type: "IN",

        quantity: Math.ceil(item.quantity),

        reason: "Cancelamento venda PDV",

      });

    }

  }



  await prisma.sale.update({

    where: { id: saleId },

    data: { status: "CANCELED" },

  });



  revalidatePath("/pdv");

  revalidatePath("/estoque");

  return { ok: true };

}



export async function deleteSale(saleId: string): Promise<FormResult> {

  const ctx = await getAuthContext();

  requireMutationRole(ctx, ["OWNER", "ADMIN"]);



  const sale = await prisma.sale.findFirst({

    where: { id: saleId, organizationId: ctx.orgId },

    include: { items: true },

  });

  if (!sale) return { error: "Venda não encontrada" };

  if (sale.status !== "OPEN") return { error: "Somente vendas abertas podem ser excluídas" };



  for (const item of sale.items) {

    if (item.inventoryItemId) {

      await addInventoryMovement({

        organizationId: ctx.orgId,

        inventoryItemId: item.inventoryItemId,

        type: "IN",

        quantity: Math.ceil(item.quantity),

        reason: "Exclusão venda PDV",

      });

    }

  }



  await prisma.sale.deleteMany({

    where: { id: saleId, organizationId: ctx.orgId },

  });



  await logAudit(ctx, "sale.delete", { id: saleId });

  revalidatePath("/pdv");

  revalidatePath("/estoque");

  return { ok: true };

}


