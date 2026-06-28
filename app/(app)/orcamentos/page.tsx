import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { QuoteForm } from "@/modules/quotes/quote-form";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Rascunho",
  SENT: "Enviado",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
  CONVERTED: "Convertido",
};

export default async function OrcamentosPage() {
  const ctx = await getAuthContext();
  const terms = resolveTerms(
    ctx.organization.segmentId,
    (ctx.organization.config as { terms?: Record<string, string> })?.terms,
  );

  const [quotes, customers, vehicles] = await Promise.all([
    prisma.quote.findMany({
      where: { organizationId: ctx.orgId },
      include: { customer: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.customer.findMany({
      where: { organizationId: ctx.orgId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.vehicle.findMany({
      where: { organizationId: ctx.orgId },
      select: { id: true, plate: true, model: true },
      orderBy: { plate: "asc" },
    }),
  ]);

  return (
    <div>
      <PageHeader
        title={term(terms, "quote_plural")}
        description="Orçamentos e propostas comerciais."
        action={
          <QuoteForm
            customers={customers.map((c) => ({ id: c.id, label: c.name }))}
            vehicles={vehicles.map((v) => ({ id: v.id, label: `${v.plate} — ${v.model}` }))}
          />
        }
      />

      {quotes.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">Nenhum orçamento cadastrado ainda.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">{term(terms, "customer")}</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quotes.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <Link href={`/orcamentos/${q.id}`} className="hover:text-brand-600">
                      {q.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{q.customer?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {STATUS_LABEL[q.status] ?? q.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatCurrency(q.total)}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(q.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
