import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { PackageForm } from "@/modules/packages/package-form";
import { UseSessionButton } from "@/modules/packages/use-session-button";
import { DeleteButton } from "@/components/delete-button";
import { deleteSessionPackage } from "@/modules/packages/actions";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function PacotesPage() {
  const ctx = await getAuthContext();
  const terms = resolveTerms(
    ctx.organization.segmentId,
    (ctx.organization.config as { terms?: Record<string, string> })?.terms,
  );

  const [packages, customers] = await Promise.all([
    prisma.sessionPackage.findMany({
      where: { organizationId: ctx.orgId },
      include: { customer: { select: { name: true } } },
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
        title="Pacotes de sessões"
        description="Pacotes vendidos e sessões utilizadas."
        action={
          <PackageForm
            customers={customers.map((c) => ({ id: c.id, label: c.name }))}
            customerLabel={term(terms, "customer")}
          />
        }
      />

      {packages.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">Nenhum pacote cadastrado ainda.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Pacote</th>
                <th className="px-4 py-3">{term(terms, "customer")}</th>
                <th className="px-4 py-3">Sessões</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Validade</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {packages.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{p.name}</td>
                  <td className="px-4 py-3 text-slate-600">{p.customer.name}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {p.usedSessions}/{p.totalSessions}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatCurrency(p.price)}</td>
                  <td className="px-4 py-3 text-slate-600">{p.expiresAt ? formatDate(p.expiresAt) : "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <UseSessionButton id={p.id} disabled={p.usedSessions >= p.totalSessions} />
                      <DeleteButton onConfirm={() => deleteSessionPackage(p.id)} />
                    </div>
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

