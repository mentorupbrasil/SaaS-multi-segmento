"use server";



import { revalidatePath } from "next/cache";

import { z } from "zod";

import { prisma } from "@/lib/db";

import { getAuthContext } from "@/lib/auth-context";

import {

  deductInventoryForWorkOrder,

  recalcWorkOrderTotal,

} from "@/lib/inventory-utils";



const schema = z.object({

  title: z.string().min(1, "Informe o título"),

  description: z.string().optional(),

  customerId: z.string().optional(),

  vehicleId: z.string().optional(),

  staffId: z.string().optional(),

  dueDate: z.string().optional(),

  total: z.coerce.number().min(0).optional(),

  status: z.enum(["DRAFT", "OPEN", "IN_PROGRESS", "DONE", "CANCELED"]),

});



export interface FormResult {

  error?: string;

  ok?: boolean;

  id?: string;

}



export async function createWorkOrder(

  _prev: FormResult,

  formData: FormData,

): Promise<FormResult> {

  const ctx = await getAuthContext();

  const parsed = schema.safeParse({

    title: formData.get("title"),

    description: formData.get("description") ?? undefined,

    customerId: formData.get("customerId") || undefined,

    vehicleId: formData.get("vehicleId") || undefined,

    staffId: formData.get("staffId") || undefined,

    dueDate: formData.get("dueDate") || undefined,

    total: formData.get("total") ?? 0,

    status: formData.get("status") ?? "OPEN",

  });

  if (!parsed.success) {

    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  }



  const wo = await prisma.workOrder.create({

    data: {

      organizationId: ctx.orgId,

      title: parsed.data.title,

      description: parsed.data.description || null,

      customerId: parsed.data.customerId || null,

      vehicleId: parsed.data.vehicleId || null,

      staffId: parsed.data.staffId || null,

      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,

      total: parsed.data.total ?? 0,

      status: parsed.data.status,

    },

  });



  revalidatePath("/ordens-de-servico");

  return { ok: true, id: wo.id };

}



const itemSchema = z.object({

  workOrderId: z.string().min(1),

  type: z.enum(["SERVICE", "PART", "LABOR"]),

  description: z.string().min(1),

  quantity: z.coerce.number().min(0.01),

  unitPrice: z.coerce.number().min(0),

  serviceId: z.string().optional(),

  inventoryItemId: z.string().optional(),

});



export async function addWorkOrderItem(

  _prev: FormResult,

  formData: FormData,

): Promise<FormResult> {

  const ctx = await getAuthContext();

  const parsed = itemSchema.safeParse({

    workOrderId: formData.get("workOrderId"),

    type: formData.get("type"),

    description: formData.get("description"),

    quantity: formData.get("quantity"),

    unitPrice: formData.get("unitPrice"),

    serviceId: formData.get("serviceId") || undefined,

    inventoryItemId: formData.get("inventoryItemId") || undefined,

  });

  if (!parsed.success) {

    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  }



  const wo = await prisma.workOrder.findFirst({

    where: { id: parsed.data.workOrderId, organizationId: ctx.orgId },

  });

  if (!wo) return { error: "Ordem não encontrada" };



  await prisma.workOrderItem.create({

    data: {

      workOrderId: wo.id,

      type: parsed.data.type,

      description: parsed.data.description,

      quantity: parsed.data.quantity,

      unitPrice: parsed.data.unitPrice,

      serviceId: parsed.data.serviceId || null,

      inventoryItemId: parsed.data.inventoryItemId || null,

    },

  });



  if (parsed.data.type === "PART" && parsed.data.inventoryItemId) {

    try {

      await deductInventoryForWorkOrder({

        organizationId: ctx.orgId,

        workOrderId: wo.id,

        inventoryItemId: parsed.data.inventoryItemId,

        quantity: Math.ceil(parsed.data.quantity),

      });

    } catch (e) {

      await prisma.workOrderItem.deleteMany({

        where: { workOrderId: wo.id, description: parsed.data.description },

      });

      return { error: e instanceof Error ? e.message : "Erro ao baixar estoque" };

    }

  }



  await recalcWorkOrderTotal(wo.id, ctx.orgId);

  revalidatePath(`/ordens-de-servico/${wo.id}`);

  revalidatePath("/ordens-de-servico");

  revalidatePath("/estoque");

  return { ok: true };

}



export async function updateWorkOrderStatus(

  id: string,

  status: "DRAFT" | "OPEN" | "IN_PROGRESS" | "DONE" | "CANCELED",

): Promise<FormResult> {

  const ctx = await getAuthContext();

  const wo = await prisma.workOrder.findFirst({

    where: { id, organizationId: ctx.orgId },

    include: { customer: true, items: true },

  });

  if (!wo) return { error: "Ordem não encontrada" };



  await prisma.workOrder.updateMany({

    where: { id, organizationId: ctx.orgId },

    data: { status },

  });



  if (status === "DONE" && wo.total > 0) {

    const existing = await prisma.financialEntry.findFirst({

      where: {

        organizationId: ctx.orgId,

        workOrderId: id,

        type: "INCOME",

      },

    });

    if (!existing) {

      await prisma.financialEntry.create({

        data: {

          organizationId: ctx.orgId,

          customerId: wo.customerId,

          workOrderId: id,

          type: "INCOME",

          description: `OS: ${wo.title}`,

          amount: wo.total,

          status: "PENDING",

          dueDate: new Date(),

        },

      });

      revalidatePath("/financeiro");

    }

    if (wo.staffId) {
      const laborTotal = wo.items
        .filter((i) => i.type === "LABOR" || i.type === "SERVICE")
        .reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
      const commissionAmount = Math.round(laborTotal * 0.1 * 100) / 100;
      if (commissionAmount > 0) {
        const existingCommission = await prisma.commissionEntry.findFirst({
          where: { organizationId: ctx.orgId, workOrderId: id, staffId: wo.staffId },
        });
        if (!existingCommission) {
          await prisma.commissionEntry.create({
            data: {
              organizationId: ctx.orgId,
              staffId: wo.staffId,
              customerId: wo.customerId,
              workOrderId: id,
              description: `Comissão OS: ${wo.title}`,
              amount: commissionAmount,
            },
          });
          revalidatePath("/comissoes");
        }
      }
    }

  }



  revalidatePath(`/ordens-de-servico/${id}`);

  revalidatePath("/ordens-de-servico");

  return { ok: true };

}



export async function convertQuoteToWorkOrder(quoteId: string): Promise<FormResult> {

  const ctx = await getAuthContext();

  const quote = await prisma.quote.findFirst({

    where: { id: quoteId, organizationId: ctx.orgId },

    include: { items: true },

  });

  if (!quote) return { error: "Orçamento não encontrado" };

  if (quote.status === "CONVERTED") return { error: "Orçamento já convertido" };



  const wo = await prisma.workOrder.create({

    data: {

      organizationId: ctx.orgId,

      customerId: quote.customerId,

      vehicleId: quote.vehicleId,

      quoteId: quote.id,

      title: quote.title,

      description: quote.notes,

      status: "OPEN",

      total: quote.total,

      items: {

        create: quote.items.map((i) => ({

          type: i.type,

          description: i.description,

          quantity: i.quantity,

          unitPrice: i.unitPrice,

          serviceId: i.serviceId,

          inventoryItemId: i.inventoryItemId,

        })),

      },

    },

  });



  for (const item of quote.items) {

    if (item.type === "PART" && item.inventoryItemId) {

      await deductInventoryForWorkOrder({

        organizationId: ctx.orgId,

        workOrderId: wo.id,

        inventoryItemId: item.inventoryItemId,

        quantity: Math.ceil(item.quantity),

      });

    }

  }



  await prisma.quote.update({

    where: { id: quote.id },

    data: { status: "CONVERTED" },

  });



  revalidatePath("/orcamentos");

  revalidatePath("/ordens-de-servico");

  revalidatePath("/estoque");

  return { ok: true, id: wo.id };

}


