import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { parseListParams } from "@/lib/list-params";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { ListToolbar } from "@/components/list-toolbar";
import { Pagination } from "@/components/pagination";
import { ExportButtons } from "@/components/export-link";
import { CommissionForm } from "@/modules/commission/commission-form";
import { SyncCommissionsButton } from "@/modules/commission/sync-commissions-button";
import { MarkCommissionPaidButton } from "@/modules/commission/mark-paid-button";
import { DeleteButton } from "@/components/delete-button";
import { deleteCommissionEntry } from "@/modules/commission/actions";
import { formatCurrency, formatDate } from "@/lib/utils";

const PAGE_SIZE = 20;

export default async function ComissoesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; paid?: string }>;
}) {
  const raw = await searchParams;
  const params = parseListParams(raw);
  const paidFilter = raw.paid?.trim();
  const ctx = await getAuthContext();
  const terms = resolveTerms(
    ctx.organization.segmentId,
    (ctx.organization.config as { terms?: Record<string, string> })?.terms,
  );

  const where = {
    organizationId: ctx.orgId,
    ...(params.q
      ? {
          OR: [
            { description: { contains: params.q, mode: "insensitive" as const } },
            { staff: { user: { name: { contains: params.q, mode: "insensitive" as const } } } },
          ],
        }
      : {}),
    ...(paidFilter === "yes" ? { paidAt: { not: null } } : {}),
    ...(paidFilter === "no" ? { paidAt: null } : {}),
  };

  const [total, commissions, staff, customers, pendingTotal] = await Promise.all([
    prisma.commissionEntry.count({ where }),
    prisma.commissionEntry.findMany({
      where,
      include: {
        staff: { include: { user: true } },
        customer: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (params.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.membership.findMany({
      where: { organizationId: ctx.orgId },
      include: { user: true },
      orderBy: { user: { name: "asc" } },
    }),
    prisma.customer.findMany({
      where: { organizationId: ctx.orgId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.commissionEntry.aggregate({
      where: { organizationId: ctx.orgId, paidAt: null },
      _sum: { amount: true },
    }),
  ]);

  const paginationParams = {
    q: params.q || undefined,
    paid: paidFilter || undefined,
  };

  return (
    <div>
      <PageHeader
        title="Comissões"
        description={`Comissões da ${term(terms, "team").toLowerCase()}. Geradas automaticamente ao concluir agendamentos e OS.`}
        action={
          <div className="flex flex-wrap gap-2">
            <SyncCommissionsButton />
            <CommissionForm
              staff={staff.map((m) => ({ id: m.id, label: m.user.name }))}
              customers={customers.map((c) => ({ id: c.id, label: c.name }))}
            />
          </div>
        }
      />

      <div className="mb-6 card p-5">
        <p className="text-sm text-slate-500">Total pendente</p>
        <p className="mt-1 text-xl font-bold text-amber-600">
          {formatCurrency(pendingTotal._sum.amount ?? 0)}
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <ListToolbar
          searchValue={params.q}
          searchPlaceholder="Buscar profissional ou descrição..."
          filters={[
            {
              name: "paid",
              label: "Status",
              value: paidFilter,
              options: [
                { value: "no", label: "Pendente" },
                { value: "yes", label: "Pago" },
              ],
            },
          ]}
        />
        <ExportButtons module="comissoes" searchParams={paginationParams} />
      </div>

      {commissions.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">
          {params.q || paidFilter ? "Nenhum resultado." : "Nenhuma comissão registrada ainda."}
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">{term(terms, "professional")}</th>
                  <th className="px-4 py-3">Descrição</th>
                  <th className="px-4 py-3">{term(terms, "customer")}</th>
                  <th className="px-4 py-3">Valor</th>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {commissions.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{c.staff.user.name}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {c.description.replace(/ \[apt:[^\]]+\]/, "")}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{c.customer?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{formatCurrency(c.amount)}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(c.createdAt)}</td>
                    <td className="px-4 py-3">
                      {c.paidAt ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            Pago
                          </span>
                          <DeleteButton action={deleteCommissionEntry.bind(null, c.id)} />
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                            Pendente
                          </span>
                          <MarkCommissionPaidButton id={c.id} />
                          <DeleteButton action={deleteCommissionEntry.bind(null, c.id)} />
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
            basePath="/comissoes"
            searchParams={paginationParams}
          />
        </>
      )}
    </div>
  );
}
