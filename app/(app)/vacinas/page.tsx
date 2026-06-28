import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { parseListParams } from "@/lib/list-params";
import { getMasterDataOptions } from "@/lib/master-data";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { ListToolbar } from "@/components/list-toolbar";
import { Pagination } from "@/components/pagination";
import { ExportButtons } from "@/components/export-link";
import { DeleteButton } from "@/components/delete-button";
import { VaccinationForm } from "@/modules/vaccinations/vaccination-form";
import { deleteVaccination } from "@/modules/vaccinations/actions";
import { formatDate } from "@/lib/utils";

const PAGE_SIZE = 20;

export default async function VacinasPage({
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
    ...(params.q
      ? {
          OR: [
            { vaccine: { contains: params.q, mode: "insensitive" as const } },
            { pet: { name: { contains: params.q, mode: "insensitive" as const } } },
          ],
        }
      : {}),
  };

  const [total, vaccinations, pets, vaccineItems] = await Promise.all([
    prisma.vaccination.count({ where }),
    prisma.vaccination.findMany({
      where,
      include: {
        pet: { include: { customer: { select: { name: true } } } },
      },
      orderBy: { appliedAt: "desc" },
      skip: (params.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.pet.findMany({
      where: { organizationId: ctx.orgId },
      include: { customer: { select: { name: true } } },
      orderBy: { name: "asc" },
    }),
    getMasterDataOptions(ctx.orgId, "VACCINE"),
  ]);

  const petOptions = pets.map((p) => ({
    id: p.id,
    label: `${p.name} (${p.customer.name})`,
  }));

  return (
    <div>
      <PageHeader
        title="Vacinas"
        description={`Calendário vacinal dos ${term(terms, "pet_plural").toLowerCase()}.`}
        action={<VaccinationForm pets={petOptions} vaccineItems={vaccineItems} />}
      />

      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <ListToolbar searchValue={params.q} searchPlaceholder="Buscar pet ou vacina..." />
        <ExportButtons module="vacinas" searchParams={{ q: params.q || undefined }} />
      </div>

      {vaccinations.length === 0 ? (
        <EmptyState icon="Syringe" description={params.q ? "Nenhum resultado." : "Nenhuma vacina registrada ainda."} />
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">{term(terms, "pet")}</th>
                  <th className="px-4 py-3">Tutor</th>
                  <th className="px-4 py-3">Vacina</th>
                  <th className="px-4 py-3">Aplicada em</th>
                  <th className="px-4 py-3">Próxima dose</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vaccinations.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <Link href={`/vacinas/${v.id}`} className="hover:text-brand-600">
                        {v.pet.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{v.pet.customer.name}</td>
                    <td className="px-4 py-3 text-slate-600">{v.vaccine}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(v.appliedAt)}</td>
                    <td className="px-4 py-3 text-slate-600">{v.nextDueAt ? formatDate(v.nextDueAt) : "—"}</td>
                    <td className="px-4 py-3">
                      <DeleteButton action={deleteVaccination.bind(null, v.id)} />
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
            basePath="/vacinas"
            searchParams={{ q: params.q || undefined }}
          />
        </>
      )}
    </div>
  );
}
