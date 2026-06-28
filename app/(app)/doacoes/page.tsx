import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { resolveTerms, term } from "@/lib/terms";
import { PageHeader } from "@/components/page-header";
import { DonationForm } from "@/modules/donations/donation-form";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function DoacoesPage() {
  const ctx = await getAuthContext();
  const terms = resolveTerms(
    ctx.organization.segmentId,
    (ctx.organization.config as { terms?: Record<string, string> })?.terms,
  );
  const customerLabel = term(terms, "customer");

  const [donations, customers] = await Promise.all([
    prisma.donation.findMany({
      where: { organizationId: ctx.orgId },
      include: { customer: { select: { name: true } } },
      orderBy: { receivedAt: "desc" },
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
        title="Doações"
        description="Registro de doações recebidas."
        action={
          <DonationForm
            customers={customers.map((c) => ({ id: c.id, label: c.name }))}
            customerLabel={customerLabel}
          />
        }
      />

      {donations.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">Nenhuma doação registrada ainda.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">{customerLabel}</th>
                <th className="px-4 py-3">Descrição</th>
                <th className="px-4 py-3">Recebida em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {donations.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-green-600">{formatCurrency(d.amount)}</td>
                  <td className="px-4 py-3 text-slate-600">{d.donationType ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{d.customer?.name ?? "Anônimo"}</td>
                  <td className="px-4 py-3 text-slate-600">{d.description ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(d.receivedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
