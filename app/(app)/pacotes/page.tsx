import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { parseListParams } from "@/lib/list-params";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { ListToolbar } from "@/components/list-toolbar";
import { Pagination } from "@/components/pagination";
import { ExportButtons } from "@/components/export-link";
import { PackageForm } from "@/modules/packages/package-form";
import { UseSessionButton } from "@/modules/packages/use-session-button";
import { DeleteButton } from "@/components/delete-button";
import { deleteSessionPackage } from "@/modules/packages/actions";
import { formatCurrency, formatDate } from "@/lib/utils";

const PAGE_SIZE = 20;

export default async function PacotesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = parseListParams(await searchParams);
  const ctx = await getAuthContext();
  const terms = resolveTerms(
    ctx.organization.segmentId,
    (ctx.organization.config as { terms?: Record<string, string> })?.terms,
  );

  const where = {
    organizationId: ctx.orgId,
    ...(params.q ? { name: { contains: params.q, mode: "insensitive" as const } } : {}),
  };

  const [total, packages, customers] = await Promise.all([
    prisma.sessionPackage.count({ where }),
    prisma.sessionPackage.findMany({
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
  ]);

  return (
    <div>
      <PageHeader
        title="Pacotes de sessões"
        description="Pacotes vendidos e sessões utilizadas."
        action={
          <PackageForm
            customers={customers.map((c) => ({ id: c.id, label: c.name }))}
            customerLabel={term(terms, "customer")}
          />
        }
      />

      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <ListToolbar searchValue={params.q} searchPlaceholder="Buscar pacote..." />
        <ExportButtons plan={ctx.organization.plan} module="pacotes" searchParams={{ q: params.q || undefined }} />
      </div>

      {packages.length === 0 ? (
        <EmptyState icon="Gift" description={params.q ? "Nenhum resultado." : "Nenhum pacote cadastrado ainda."} />
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Pacote</th>
                  <th className="px-4 py-3">{term(terms, "customer")}</th>
                  <th className="px-4 py-3">Sessões</th>
                  <th className="px-4 py-3">Valor</th>
                  <th className="px-4 py-3">Validade</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {packages.map((p) => (
                  <tr key={p.id} className="hover:bg-muted">
                    <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.customer.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {p.usedSessions}/{p.totalSessions}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatCurrency(p.price)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.expiresAt ? formatDate(p.expiresAt) : "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <UseSessionButton id={p.id} disabled={p.usedSessions >= p.totalSessions} />
                        <DeleteButton action={deleteSessionPackage.bind(null, p.id)} />
                      </div>
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
            basePath="/pacotes"
            searchParams={{ q: params.q || undefined }}
          />
        </>
      )}
    </div>
  );
}
