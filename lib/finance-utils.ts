import { prisma } from "@/lib/db";

/** Marca lançamentos PENDING com vencimento passado como OVERDUE. */
export async function markOverdueEntries(organizationId: string): Promise<number> {
  const now = new Date();
  const result = await prisma.financialEntry.updateMany({
    where: {
      organizationId,
      status: "PENDING",
      dueDate: { lt: now },
    },
    data: { status: "OVERDUE" },
  });
  return result.count;
}
