import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { parseListParams } from "@/lib/list-params";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { ListToolbar } from "@/components/list-toolbar";
import { Pagination } from "@/components/pagination";
import { ExportCsvLink } from "@/components/export-csv-link";
import { syncOverdueEntries } from "@/modules/financial/actions";
import { EntryForm } from "@/modules/financial/entry-form";
import { MarkPaidButton } from "@/components/mark-paid-button";
import { formatCurrency, formatDate } from "@/lib/utils";

const PAGE_SIZE = 20;

export default async function FinanceiroPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; type?: string; status?: string }>;
}) {
  const raw = await searchParams;
  const params = parseListParams(raw);
  const typeFilter = raw.type?.trim() || undefined;
  const statusFilter = raw.status?.trim() || undefined;
  const ctx = await getAuthContext();
  const org = ctx.organization;

  await syncOverdueEntries();

  const where = {
    organizationId: org.id,
    ...(params.q ? { description: { contains: params.q, mode: "insensitive" as const } } : {}),
    ...(typeFilter ? { type: typeFilter as "INCOME" | "EXPENSE" } : {}),
    ...(statusFilter ? { status: statusFilter as "PENDING" | "PAID" | "OVERDUE" } : {}),
  };

  const [total, entries, summary] = await Promise.all([
    prisma.financialEntry.count({ where }),
    prisma.financialEntry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (params.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.financialEntry.findMany({
      where: { organizationId: org.id },
      select: { type: true, status: true, amount: true },
    }),
  ]);

  const income = summary
    .filter((e) => e.type === "INCOME" && e.status === "PAID")
    .reduce((sum, e) => sum + e.amount, 0);
  const expense = summary
    .filter((e) => e.type === "EXPENSE" && e.status === "PAID")
    .reduce((sum, e) => sum + e.amount, 0);
  const pending = summary
    .filter((e) => e.status === "PENDING")
    .reduce((sum, e) => sum + (e.type === "INCOME" ? e.amount : -e.amount), 0);
  const overdueCount = summary.filter((e) => e.status === "OVERDUE").length;

  const cards = [
    { label: "Receitas (pagas)", value: formatCurrency(income), tone: "text-green-600" },
    { label: "Despesas (pagas)", value: formatCurrency(expense), tone: "text-red-600" },
    { label: "Saldo", value: formatCurrency(income - expense), tone: "text-foreground" },
    { label: "Em aberto", value: formatCurrency(pending), tone: "text-amber-600" },
  ];

  const paginationParams = {
    q: params.q || undefined,
    type: typeFilter,
    status: statusFilter,
  };

  return (
    <div>
      <PageHeader
        title="Financeiro"
        description="Caixa, contas a pagar e a receber."
        action={<EntryForm />}
      />

      <p className="mb-4 text-sm text-muted-foreground">
        <Link href="/caixa" className="text-primary hover:underline">
          Ir para o caixa →
        </Link>
        {overdueCount > 0 && (
          <span className="ml-3 text-red-600">{overdueCount} vencido(s)</span>
        )}
      </p>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card p-5">
            <p className="text-sm text-muted-foreground">{c.label}</p>
            <p className={`mt-1 text-xl font-bold ${c.tone}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <ListToolbar
          searchValue={params.q}
          searchPlaceholder="Buscar por descrição..."
          filters={[
            {
              name: "type",
              label: "Tipo",
              value: typeFilter,
              options: [
                { value: "INCOME", label: "Receita" },
                { value: "EXPENSE", label: "Despesa" },
              ],
            },
            {
              name: "status",
              label: "Status",
              value: statusFilter,
              options: [
                { value: "PENDING", label: "Em aberto" },
                { value: "PAID", label: "Pago" },
                { value: "OVERDUE", label: "Vencido" },
              ],
            },
          ]}
        />
        <ExportCsvLink plan={org.plan} module="financeiro" searchParams={paginationParams} />
      </div>

      {entries.length === 0 ? (
        <EmptyState
          icon="Wallet"
          description={
            params.q || typeFilter || statusFilter
              ? "Nenhum resultado para os filtros."
              : "Nenhum lançamento financeiro ainda."
          }
        />
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Descrição</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Valor</th>
                  <th className="px-4 py-3">Vencimento</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {entries.map((e) => (
                  <tr key={e.id} className="hover:bg-muted">
                    <td className="px-4 py-3 font-medium text-foreground">
                      <Link href={`/financeiro/${e.id}`} className="hover:text-primary">
                        {e.description}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className={e.type === "INCOME" ? "text-green-600" : "text-red-600"}>
                        {e.type === "INCOME" ? "Receita" : "Despesa"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatCurrency(e.amount)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.dueDate ? formatDate(e.dueDate) : "-"}</td>
                    <td className="px-4 py-3">
                      {e.status === "PAID" ? (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          Pago
                        </span>
                      ) : e.status === "OVERDUE" ? (
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                            Vencido
                          </span>
                          <MarkPaidButton id={e.id} />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                            Em aberto
                          </span>
                          <MarkPaidButton id={e.id} />
                        </div>
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
            basePath="/financeiro"
            searchParams={paginationParams}
          />
        </>
      )}
    </div>
  );
}
