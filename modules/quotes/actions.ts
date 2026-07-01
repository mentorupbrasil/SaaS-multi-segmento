"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthContext } from "@/lib/auth-context";
import { requireMutationRole, requireCreateRole } from "@/lib/action-auth";
import { logAudit } from "@/lib/audit-log";
import { recalcQuoteTotal } from "@/lib/inventory-utils";
import { convertQuoteToWorkOrder } from "@/modules/work-orders/actions";

export interface FormResult {
  error?: string;
  ok?: boolean;
  id?: string;
}

const schema = z.object({
  title: z.string().min(1),
  customerId: z.string().optional(),
  vehicleId: z.string().optional(),
  notes: z.string().optional(),
  validUntil: z.string().optional(),
});

export async function createQuote(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireCreateRole(ctx);
  const parsed = schema.safeParse({
    title: formData.get("title"),
    customerId: formData.get("customerId") || undefined,
    vehicleId: formData.get("vehicleId") || undefined,
    notes: formData.get("notes") || undefined,
    validUntil: formData.get("validUntil") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const quote = await prisma.quote.create({
    data: {
      organizationId: ctx.orgId,
      title: parsed.data.title,
      customerId: parsed.data.customerId || null,
      vehicleId: parsed.data.vehicleId || null,
      notes: parsed.data.notes || null,
      validUntil: parsed.data.validUntil ? new Date(parsed.data.validUntil) : null,
      status: "DRAFT",
    },
  });

  revalidatePath("/orcamentos");
  return { ok: true, id: quote.id };
}

const itemSchema = z.object({
  quoteId: z.string().min(1),
  type: z.enum(["SERVICE", "PART", "LABOR"]),
  description: z.string().min(1),
  quantity: z.coerce.number().min(0.01),
  unitPrice: z.coerce.number().min(0),
  serviceId: z.string().optional(),
  inventoryItemId: z.string().optional(),
});

export async function addQuoteItem(
  _prev: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const ctx = await getAuthContext();
  const parsed = itemSchema.safeParse({
    quoteId: formData.get("quoteId"),
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

  const quote = await prisma.quote.findFirst({
    where: { id: parsed.data.quoteId, organizationId: ctx.orgId },
  });
  if (!quote) return { error: "Orçamento não encontrado" };

  await prisma.quoteItem.create({
    data: {
      quoteId: quote.id,
      type: parsed.data.type,
      description: parsed.data.description,
      quantity: parsed.data.quantity,
      unitPrice: parsed.data.unitPrice,
      serviceId: parsed.data.serviceId || null,
      inventoryItemId: parsed.data.inventoryItemId || null,
    },
  });

  await recalcQuoteTotal(quote.id, ctx.orgId);
  revalidatePath(`/orcamentos/${quote.id}`);
  revalidatePath("/orcamentos");
  return { ok: true };
}

export async function updateQuoteStatus(
  id: string,
  status: "DRAFT" | "SENT" | "APPROVED" | "REJECTED",
): Promise<FormResult> {
  const ctx = await getAuthContext();
  await prisma.quote.updateMany({
    where: { id, organizationId: ctx.orgId },
    data: { status },
  });
  revalidatePath(`/orcamentos/${id}`);
  revalidatePath("/orcamentos");
  return { ok: true };
}

export async function approveAndConvertQuote(quoteId: string): Promise<FormResult> {
  const ctx = await getAuthContext();
  await prisma.quote.updateMany({
    where: { id: quoteId, organizationId: ctx.orgId },
    data: { status: "APPROVED" },
  });
  return convertQuoteToWorkOrder(quoteId);
}

export async function deleteQuote(id: string): Promise<FormResult> {
  const ctx = await getAuthContext();
  requireMutationRole(ctx, ["OWNER", "ADMIN"]);

  const existing = await prisma.quote.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!existing) return { error: "Orçamento não encontrado" };
  if (existing.status === "CONVERTED") {
    return { error: "Orçamentos convertidos não podem ser excluídos" };
  }

  await prisma.quote.deleteMany({
    where: { id, organizationId: ctx.orgId },
  });

  await logAudit(ctx, "quote.delete", { id, title: existing.title });
  revalidatePath("/orcamentos");
  return { ok: true };
}

