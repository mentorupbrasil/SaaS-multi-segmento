import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icon";
import { getOrganizationByPortalSlug } from "@/lib/public-booking";
import { getPublicQuote } from "@/lib/public-portal";
import { PublicQuoteActions } from "@/components/public-quote-actions";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Rascunho",
  SENT: "Enviado",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
  CONVERTED: "Convertido",
};

export default async function PortalQuotePage({
  params,
  searchParams,
}: {
  params: Promise<{ orgSlug: string; id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { orgSlug, id } = await params;
  const { token = "" } = await searchParams;
  const org = await getOrganizationByPortalSlug(orgSlug);
  if (!org) notFound();

  const quote = await getPublicQuote(org.id, id, token);
  if (!quote) notFound();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-lg">
        <Link href={`/portal/${org.slug}`} className="mb-4 inline-flex items-center gap-1 text-sm text-brand-600 hover:underline">
          <Icon name="ArrowLeft" className="h-4 w-4" />
          {org.name}
        </Link>

        <div className="card p-6">
          <p className="text-sm text-slate-500">Orçamento</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">{quote.title}</h1>
          <p className="mt-2 text-sm">
            Status: <span className="font-medium">{STATUS_LABEL[quote.status] ?? quote.status}</span>
          </p>

          <div className="mt-6 border-t border-slate-100 pt-4">
            <ul className="space-y-2 text-sm">
              {quote.items.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>
                    {item.description} ×{item.quantity}
                  </span>
                  <span>{formatCurrency(item.quantity * item.unitPrice)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-right text-lg font-bold">{formatCurrency(quote.total)}</p>
          </div>

          {quote.validUntil && (
            <p className="mt-2 text-xs text-slate-500">Válido até {formatDate(quote.validUntil)}</p>
          )}

          <PublicQuoteActions
            orgId={org.id}
            quoteId={quote.id}
            token={token}
            status={quote.status}
          />
        </div>
      </div>
    </div>
  );
}
