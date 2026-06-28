import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { parseListParams } from "@/lib/list-params";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { ListToolbar } from "@/components/list-toolbar";
import { Pagination } from "@/components/pagination";
import { DeleteButton } from "@/components/delete-button";
import { PetForm } from "@/modules/pets/pet-form";
import { deletePet } from "@/modules/pets/actions";
import { formatDate } from "@/lib/utils";

const PAGE_SIZE = 20;

export default async function PetsPage({
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
  const customerLabel = term(terms, "customer");

  const where = {
    organizationId: ctx.orgId,
    ...(params.q
      ? { name: { contains: params.q, mode: "insensitive" as const } }
      : {}),
  };

  const [total, pets, customers] = await Promise.all([
    prisma.pet.count({ where }),
    prisma.pet.findMany({
      where,
      include: { customer: { select: { id: true, name: true } } },
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
        title="Pets"
        description={`Animais vinculados aos ${term(terms, "customer_plural").toLowerCase()}.`}
        action={
          <PetForm
            customers={customers.map((c) => ({ id: c.id, label: c.name }))}
            customerLabel={customerLabel}
          />
        }
      />

      <ListToolbar searchValue={params.q} searchPlaceholder="Buscar pet por nome..." />

      {pets.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">
          {params.q ? "Nenhum resultado para a busca." : "Nenhum pet cadastrado ainda."}
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Espécie</th>
                  <th className="px-4 py-3">Raça</th>
                  <th className="px-4 py-3">{customerLabel}</th>
                  <th className="px-4 py-3">Cadastro</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pets.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <Link href={`/pets/${p.id}`} className="hover:text-brand-600">
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{p.species ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{p.breed ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">
                      <Link href={`/clientes/${p.customer.id}`} className="hover:text-brand-600">
                        {p.customer.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(p.createdAt)}</td>
                    <td className="px-4 py-3">
                      <DeleteButton action={deletePet.bind(null, p.id)} />
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
            basePath="/pets"
            searchParams={{ q: params.q || undefined }}
          />
        </>
      )}
    </div>
  );
}
