"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/auth-context";

export interface FormResult {
  error?: string;
  ok?: boolean;
  id?: string;
}

type KitchenItem = {
  description: string;
  quantity: number;
  notes?: string;
};

export async function createKitchenOrder(workOrderId: string): Promise<FormResult> {
  const ctx = await getAuthContext();

  const wo = await prisma.workOrder.findFirst({
    where: { id: workOrderId, organizationId: ctx.orgId },
    include: { items: true },
  });
  if (!wo) return { error: "Ordem de serviço não encontrada" };

  const existing = await prisma.kitchenOrder.findFirst({
    where: { workOrderId, organizationId: ctx.orgId, status: { not: "CANCELED" } },
  });
  if (existing) return { error: "Já existe pedido de cozinha para esta OS" };

  const items: KitchenItem[] = wo.items.map((item) => ({
    description: item.description,
    quantity: item.quantity,
  }));

  if (items.length === 0) {
    return { error: "A ordem não possui itens para enviar à cozinha" };
  }

  const order = await prisma.kitchenOrder.create({
    data: {
      organizationId: ctx.orgId,
      workOrderId: wo.id,
      tableLabel: wo.title,
      notes: wo.description,
      items,
    },
  });

  revalidatePath("/cozinha");
  revalidatePath("/ordens-de-servico");
  return { ok: true, id: order.id };
}

export async function updateKitchenStatus(
  id: string,
  status: "PENDING" | "PREPARING" | "DONE" | "CANCELED",
): Promise<FormResult> {
  const ctx = await getAuthContext();

  const order = await prisma.kitchenOrder.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!order) return { error: "Pedido não encontrado" };

  await prisma.kitchenOrder.updateMany({
    where: { id, organizationId: ctx.orgId },
    data: {
      status,
      startedAt: status === "PREPARING" && !order.startedAt ? new Date() : order.startedAt,
      completedAt: status === "DONE" ? new Date() : null,
    },
  });

  revalidatePath("/cozinha");
  return { ok: true };
}
