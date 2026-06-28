import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { DeleteButton } from "@/components/delete-button";
import { VaccinationForm } from "@/modules/vaccinations/vaccination-form";
import { deleteVaccination } from "@/modules/vaccinations/actions";
import { formatDate } from "@/lib/utils";

export default async function VacinasPage() {
  const ctx = await getAuthContext();
  const terms = resolveTerms(
    ctx.organization.segmentId,
    (ctx.organization.config as { terms?: Record<string, string> })?.terms,
  );

  const [vaccinations, pets] = await Promise.all([
    prisma.vaccination.findMany({
      where: { organizationId: ctx.orgId },
      include: {
        pet: { include: { customer: { select: { name: true } } } },
      },
      orderBy: { appliedAt: "desc" },
    }),
    prisma.pet.findMany({
      where: { organizationId: ctx.orgId },
      include: { customer: { select: { name: true } } },
      orderBy: { name: "asc" },
    }),
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
        action={<VaccinationForm pets={petOptions} />}
      />

      {vaccinations.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">Nenhuma vacina registrada ainda.</div>
      ) : (
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
                  <td className="px-4 py-3 font-medium text-slate-900">{v.pet.name}</td>
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
      )}
    </div>
  );
}

