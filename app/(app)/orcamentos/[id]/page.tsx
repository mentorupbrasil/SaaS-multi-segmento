import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { LineItemForm } from "@/components/line-item-form";
import { ApproveQuoteButton, QuoteWorkOrderLink } from "@/components/approve-quote-button";
import { QuoteStatusButtons } from "@/components/quote-status-buttons";
import { DeleteButton } from "@/components/delete-button";
import { addQuoteItem, deleteQuote } from "@/modules/quotes/actions";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Rascunho",
  SENT: "Enviado",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
  CONVERTED: "Convertido",
};

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await getAuthContext();
  const terms = resolveTerms(
    ctx.organization.segmentId,
    (ctx.organization.config as { terms?: Record<string, string> })?.terms,
  );

  const [quote, services, inventory] = await Promise.all([
    prisma.quote.findFirst({
      where: { id, organizationId: ctx.orgId },
      include: {
        customer: true,
        vehicle: true,
        items: { orderBy: { id: "asc" } },
        workOrders: { select: { id: true }, take: 1 },
      },
    }),
    prisma.service.findMany({
      where: { organizationId: ctx.orgId, active: true },
      select: { id: true, name: true, price: true },
    }),
    prisma.inventoryItem.findMany({
      where: { organizationId: ctx.orgId },
      select: { id: true, name: true, quantity: true, price: true },
    }),
  ]);

  if (!quote) notFound();

  const canEdit = quote.status === "DRAFT" || quote.status === "SENT";
  const workOrder = quote.workOrders[0];

  return (
    <div>
      <PageHeader
        title={quote.title}
        description={`${term(terms, "quote")} · ${STATUS_LABEL[quote.status] ?? quote.status}`}
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/orcamentos" className="text-sm text-brand-600 hover:underline">
          ← Voltar
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/orcamentos/${quote.id}/print`}
            className="btn-secondary text-sm"
          >
            Imprimir
          </Link>
          {quote.status !== "CONVERTED" && (
            <DeleteButton
              action={deleteQuote.bind(null, quote.id)}
              redirectTo="/orcamentos"
            />
          )}
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs text-slate-500">{term(terms, "customer")}</p>
          <p className="font-medium">{quote.customer?.name ?? "—"}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Veículo</p>
          <p className="font-medium">
            {quote.vehicle ? `${quote.vehicle.plate} — ${quote.vehicle.model}` : "—"}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Válido até</p>
          <p className="font-medium">{quote.validUntil ? formatDate(quote.validUntil) : "—"}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-slate-500">Total</p>
          <p className="text-xl font-bold text-slate-900">{formatCurrency(quote.total)}</p>
        </div>
      </div>

      {quote.notes && <p className="mb-4 text-sm text-slate-600">{quote.notes}</p>}

      {canEdit && (
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <QuoteStatusButtons id={quote.id} status={quote.status} />
          <ApproveQuoteButton quoteId={quote.id} />
        </div>
      )}

      {workOrder && (
        <div className="mb-6">
          <QuoteWorkOrderLink workOrderId={workOrder.id} />
        </div>
      )}

      <h2 className="mb-2 mt-8 text-lg font-semibold">Itens</h2>
      {quote.items.length === 0 ? (
        <p className="text-sm text-slate-500">Nenhum item ainda.</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Descrição</th>
                <th className="px-4 py-3">Qtd</th>
                <th className="px-4 py-3">Unit.</th>
                <th className="px-4 py-3">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quote.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">{item.type}</td>
                  <td className="px-4 py-3">{item.description}</td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-4 py-3">{formatCurrency(item.quantity * item.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {canEdit && (
        <LineItemForm
          parentIdField="quoteId"
          parentId={quote.id}
          action={addQuoteItem}
          services={services.map((s) => ({ id: s.id, label: `${s.name} (${formatCurrency(s.price)})` }))}
          inventory={inventory.map((i) => ({
            id: i.id,
            label: `${i.name} (est: ${i.quantity})`,
          }))}
        />
      )}

      <p className="mt-4 text-xs text-slate-400">Criado em {formatDate(quote.createdAt)}</p>
    </div>
  );
}
