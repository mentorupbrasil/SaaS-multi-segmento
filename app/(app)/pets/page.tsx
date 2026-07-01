import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { parseListParams } from "@/lib/list-params";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
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
        <EmptyState icon="PawPrint" description={params.q ? "Nenhum resultado para a busca." : "Nenhum pet cadastrado ainda."} />
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Espécie</th>
                  <th className="px-4 py-3">Raça</th>
                  <th className="px-4 py-3">{customerLabel}</th>
                  <th className="px-4 py-3">Cadastro</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pets.map((p) => (
                  <tr key={p.id} className="hover:bg-muted">
                    <td className="px-4 py-3 font-medium text-foreground">
                      <Link href={`/pets/${p.id}`} className="hover:text-primary">
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.species ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.breed ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <Link href={`/clientes/${p.customer.id}`} className="hover:text-primary">
                        {p.customer.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(p.createdAt)}</td>
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
