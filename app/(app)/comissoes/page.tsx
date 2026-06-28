import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { CommissionForm } from "@/modules/commission/commission-form";
import { MarkCommissionPaidButton } from "@/modules/commission/mark-paid-button";
import { DeleteButton } from "@/components/delete-button";
import { deleteCommissionEntry } from "@/modules/commission/actions";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function ComissoesPage() {
  const ctx = await getAuthContext();
  const terms = resolveTerms(
    ctx.organization.segmentId,
    (ctx.organization.config as { terms?: Record<string, string> })?.terms,
  );

  const [commissions, staff, customers] = await Promise.all([
    prisma.commissionEntry.findMany({
      where: { organizationId: ctx.orgId },
      include: {
        staff: { include: { user: true } },
        customer: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
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
  ]);

  const pendingTotal = commissions
    .filter((c) => !c.paidAt)
    .reduce((sum, c) => sum + c.amount, 0);

  return (
    <div>
      <PageHeader
        title="Comissões"
        description={`Comissões da ${term(terms, "team").toLowerCase()}.`}
        action={
          <CommissionForm
            staff={staff.map((m) => ({ id: m.id, label: m.user.name }))}
            customers={customers.map((c) => ({ id: c.id, label: c.name }))}
          />
        }
      />

      <div className="mb-6 card p-5">
        <p className="text-sm text-slate-500">Total pendente</p>
        <p className="mt-1 text-xl font-bold text-amber-600">{formatCurrency(pendingTotal)}</p>
      </div>

      {commissions.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">Nenhuma comissão registrada ainda.</div>
      ) : (
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
                  <td className="px-4 py-3 text-slate-600">{c.description}</td>
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
      )}
    </div>
  );
}

