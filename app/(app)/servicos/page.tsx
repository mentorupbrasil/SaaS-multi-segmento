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
import { ServiceForm } from "@/modules/services/service-form";
import { ServiceEditForm } from "@/modules/services/service-edit-form";
import { deleteService } from "@/modules/services/actions";
import { formatCurrency } from "@/lib/utils";

const PAGE_SIZE = 20;

export default async function ServicosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = parseListParams(await searchParams);
  const ctx = await getAuthContext();
  const org = ctx.organization;
  const terms = resolveTerms(org.segmentId, (org.config as { terms?: Record<string, string> })?.terms);
  const serviceLabel = term(terms, "service");

  const where = {
    organizationId: org.id,
    ...(params.q
      ? { name: { contains: params.q, mode: "insensitive" as const } }
      : {}),
  };

  const [total, services, staff] = await Promise.all([
    prisma.service.count({ where }),
    prisma.service.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (params.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.membership.findMany({
      where: { organizationId: org.id },
      include: { user: true },
      orderBy: { user: { name: "asc" } },
    }),
  ]);

  return (
    <div>
      <PageHeader
        title={term(terms, "service_plural")}
        description="Catálogo de serviços, preços e duração."
        action={
          <ServiceForm
            serviceLabel={serviceLabel}
            staff={staff.map((m) => ({ id: m.id, label: m.user.name }))}
          />
        }
      />

      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <ListToolbar
          searchValue={params.q}
          searchPlaceholder={`Buscar ${serviceLabel.toLowerCase()} por nome...`}
        />
        <ExportCsvLink plan={org.plan} module="servicos" searchParams={{ q: params.q || undefined }} />
      </div>

      {services.length === 0 ? (
        <EmptyState icon="Scissors" description={params.q
            ? "Nenhum resultado para a busca."
            : `Nenhum ${serviceLabel.toLowerCase()} cadastrado ainda.`} />
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Preço</th>
                  <th className="px-4 py-3">Duração</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-muted">
                    <td className="px-4 py-3 font-medium text-foreground">
                      <Link href={`/servicos/${s.id}`} className="hover:text-primary">
                        {s.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatCurrency(s.price)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.durationMin} min</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          s.active
                            ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
                            : "rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                        }
                      >
                        {s.active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <ServiceEditForm
                          id={s.id}
                          serviceLabel={serviceLabel}
                          defaultValues={{
                            name: s.name,
                            price: s.price,
                            durationMin: s.durationMin,
                          }}
                        />
                        <DeleteButton action={deleteService.bind(null, s.id)} />
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
            basePath="/servicos"
            searchParams={{ q: params.q || undefined }}
          />
        </>
      )}
    </div>
  );
}
