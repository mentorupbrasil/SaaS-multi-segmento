import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { parseListParams } from "@/lib/list-params";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { ListToolbar } from "@/components/list-toolbar";
import { Pagination } from "@/components/pagination";
import { ExportCsvLink } from "@/components/export-csv-link";
import { DeleteButton } from "@/components/delete-button";
import { QuoteForm } from "@/modules/quotes/quote-form";
import { deleteQuote } from "@/modules/quotes/actions";
import { formatCurrency, formatDate } from "@/lib/utils";

const PAGE_SIZE = 20;

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Rascunho",
  SENT: "Enviado",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
  CONVERTED: "Convertido",
};

export default async function OrcamentosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; status?: string }>;
}) {
  const raw = await searchParams;
  const params = parseListParams(raw);
  const statusFilter = raw.status?.trim() || undefined;
  const ctx = await getAuthContext();
  const terms = resolveTerms(
    ctx.organization.segmentId,
    (ctx.organization.config as { terms?: Record<string, string> })?.terms,
  );

  const where = {
    organizationId: ctx.orgId,
    ...(params.q ? { title: { contains: params.q, mode: "insensitive" as const } } : {}),
    ...(statusFilter ? { status: statusFilter as "DRAFT" | "SENT" | "APPROVED" | "REJECTED" | "CONVERTED" } : {}),
  };

  const [total, quotes, customers, vehicles] = await Promise.all([
    prisma.quote.count({ where }),
    prisma.quote.findMany({
      where,
      include: { customer: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip: (params.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
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

  const paginationParams = {
    q: params.q || undefined,
    status: statusFilter,
  };

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

      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <ListToolbar
          searchValue={params.q}
          searchPlaceholder="Buscar por título..."
          filters={[
            {
              name: "status",
              label: "Status",
              value: statusFilter,
              options: Object.entries(STATUS_LABEL).map(([value, label]) => ({ value, label })),
            },
          ]}
        />
        <ExportCsvLink plan={ctx.organization.plan} module="orcamentos" searchParams={paginationParams} />
      </div>

      {quotes.length === 0 ? (
        <EmptyState icon="FileSignature" description={params.q || statusFilter ? "Nenhum resultado." : "Nenhum orçamento cadastrado ainda."} />
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Título</th>
                  <th className="px-4 py-3">{term(terms, "customer")}</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Valor</th>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {quotes.map((q) => (
                  <tr key={q.id} className="hover:bg-muted">
                    <td className="px-4 py-3 font-medium text-foreground">
                      <Link href={`/orcamentos/${q.id}`} className="hover:text-primary">
                        {q.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{q.customer?.name ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                        {STATUS_LABEL[q.status] ?? q.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatCurrency(q.total)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(q.createdAt)}</td>
                    <td className="px-4 py-3">
                      {q.status !== "CONVERTED" && (
                        <DeleteButton action={deleteQuote.bind(null, q.id)} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            total={total}
            page={params.page}
            pageSize={PAGE_SIZE}
            basePath="/orcamentos"
            searchParams={paginationParams}
          />
        </>
      )}
    </div>
  );
}
