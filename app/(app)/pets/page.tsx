import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { DeleteButton } from "@/components/delete-button";
import { PetForm } from "@/modules/pets/pet-form";
import { deletePet } from "@/modules/pets/actions";
import { formatDate } from "@/lib/utils";

export default async function PetsPage() {
  const ctx = await getAuthContext();
  const terms = resolveTerms(
    ctx.organization.segmentId,
    (ctx.organization.config as { terms?: Record<string, string> })?.terms,
  );
  const customerLabel = term(terms, "customer");

  const [pets, customers] = await Promise.all([
    prisma.pet.findMany({
      where: { organizationId: ctx.orgId },
      include: { customer: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
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

      {pets.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">Nenhum pet cadastrado ainda.</div>
      ) : (
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
                  <td className="px-4 py-3 font-medium text-slate-900">{p.name}</td>
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
      )}
    </div>
  );
}
