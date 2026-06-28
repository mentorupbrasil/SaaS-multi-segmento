import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { parseListParams } from "@/lib/list-params";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { ListToolbar } from "@/components/list-toolbar";
import { Pagination } from "@/components/pagination";
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

      <ListToolbar
        searchValue={params.q}
        searchPlaceholder={`Buscar ${serviceLabel.toLowerCase()} por nome...`}
      />

      {services.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">
          {params.q
            ? "Nenhum resultado para a busca."
            : `Nenhum ${serviceLabel.toLowerCase()} cadastrado ainda.`}
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Preço</th>
                  <th className="px-4 py-3">Duração</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{s.name}</td>
                    <td className="px-4 py-3 text-slate-600">{formatCurrency(s.price)}</td>
                    <td className="px-4 py-3 text-slate-600">{s.durationMin} min</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          s.active
                            ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
                            : "rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500"
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
