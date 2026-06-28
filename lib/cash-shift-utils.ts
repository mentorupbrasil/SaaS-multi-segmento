import { prisma } from "@/lib/db";

export async function getOpenCashShift(organizationId: string) {
  return prisma.cashShift.findFirst({
    where: { organizationId, closedAt: null },
    include: { operator: { include: { user: { select: { name: true } } } } },
  });
}

export async function requireOpenCashShift(organizationId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const shift = await getOpenCashShift(organizationId);
  if (!shift) {
    return {
      ok: false,
      error: "Abra o caixa antes de finalizar vendas. Vá em Caixa → Abrir caixa.",
    };
  }
  return { ok: true };
}
