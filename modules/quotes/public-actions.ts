"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { verifyPortalToken } from "@/lib/portal-token";

export interface PublicActionResult {
  error?: string;
  ok?: boolean;
}

export async function publicApproveQuote(
  orgId: string,
  quoteId: string,
  token: string,
  _prev: PublicActionResult,
  _formData: FormData,
): Promise<PublicActionResult> {
  if (!verifyPortalToken("quote", quoteId, orgId, token)) {
    return { error: "Link inválido ou expirado." };
  }

  const quote = await prisma.quote.findFirst({
    where: { id: quoteId, organizationId: orgId },
  });
  if (!quote) return { error: "Orçamento não encontrado." };
  if (quote.status === "APPROVED" || quote.status === "CONVERTED") {
    return { ok: true };
  }
  if (quote.status === "REJECTED") {
    return { error: "Orçamento já foi rejeitado." };
  }

  await prisma.quote.update({
    where: { id: quoteId },
    data: { status: "APPROVED" },
  });

  revalidatePath(`/portal`);
  return { ok: true };
}

export async function publicRejectQuote(
  orgId: string,
  quoteId: string,
  token: string,
  _prev: PublicActionResult,
  _formData: FormData,
): Promise<PublicActionResult> {
  if (!verifyPortalToken("quote", quoteId, orgId, token)) {
    return { error: "Link inválido ou expirado." };
  }

  const quote = await prisma.quote.findFirst({
    where: { id: quoteId, organizationId: orgId },
  });
  if (!quote) return { error: "Orçamento não encontrado." };
  if (quote.status === "CONVERTED") {
    return { error: "Orçamento já convertido em OS." };
  }

  await prisma.quote.update({
    where: { id: quoteId },
    data: { status: "REJECTED" },
  });

  return { ok: true };
}
