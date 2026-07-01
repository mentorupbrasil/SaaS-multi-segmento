import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { resolveTerms, term } from "@/lib/terms";
import { PrintLayout } from "@/components/print-layout";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Rascunho",
  SENT: "Enviado",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
  CONVERTED: "Convertido",
};

export default async function QuotePrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await getAuthContext();
  const org = ctx.organization;
  const terms = resolveTerms(org.segmentId, (org.config as { terms?: Record<string, string> })?.terms);

  const quote = await prisma.quote.findFirst({
    where: { id, organizationId: ctx.orgId },
    include: {
      customer: true,
      vehicle: true,
      items: { orderBy: { id: "asc" } },
    },
  });

  if (!quote) notFound();

  return (
    <PrintLayout title={`Imprimir ${term(terms, "quote")}`}>
      <div className="mb-6 border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-foreground">{org.name}</h1>
        <p className="text-sm text-muted-foreground">{term(terms, "quote")}</p>
      </div>

      <div className="mb-6 flex flex-wrap justify-between gap-4 text-sm">
        <div>
          <p className="font-semibold text-foreground">{quote.title}</p>
          <p className="text-muted-foreground">Status: {STATUS_LABEL[quote.status] ?? quote.status}</p>
          <p className="text-muted-foreground">Criado em {formatDate(quote.createdAt)}</p>
          {quote.validUntil && (
            <p className="text-muted-foreground">Válido até {formatDate(quote.validUntil)}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-muted-foreground">{term(terms, "customer")}: {quote.customer?.name ?? "—"}</p>
          {quote.vehicle && (
            <p className="text-muted-foreground">
              Veículo: {quote.vehicle.plate} — {quote.vehicle.model}
            </p>
          )}
        </div>
      </div>

      {quote.notes && <p className="mb-6 text-sm text-foreground">{quote.notes}</p>}

      <table className="mb-6 w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
            <th className="py-2 pr-4">Descrição</th>
            <th className="py-2 pr-4 text-right">Qtd</th>
            <th className="py-2 pr-4 text-right">Unit.</th>
            <th className="py-2 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {quote.items.map((item) => (
            <tr key={item.id}>
              <td className="py-2 pr-4">{item.description}</td>
              <td className="py-2 pr-4 text-right">{item.quantity}</td>
              <td className="py-2 pr-4 text-right">{formatCurrency(item.unitPrice)}</td>
              <td className="py-2 text-right">{formatCurrency(item.quantity * item.unitPrice)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="pt-4 text-right font-semibold">
              Total
            </td>
            <td className="pt-4 text-right text-lg font-bold">{formatCurrency(quote.total)}</td>
          </tr>
        </tfoot>
      </table>

      <p className="text-center text-xs text-muted-foreground print:hidden">
        <Link href={`/orcamentos/${quote.id}`} className="text-primary hover:underline">
          ← Voltar ao detalhe
        </Link>
      </p>
    </PrintLayout>
  );
}
