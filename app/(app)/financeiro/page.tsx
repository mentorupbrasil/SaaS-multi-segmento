import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/page-header";
import { EntryForm } from "@/modules/financial/entry-form";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function FinanceiroPage() {
  const ctx = await getAuthContext();
  const org = ctx.organization;

  const entries = await prisma.financialEntry.findMany({
    where: { organizationId: org.id },
    orderBy: { createdAt: "desc" },
  });

  const income = entries
    .filter((e) => e.type === "INCOME" && e.status === "PAID")
    .reduce((sum, e) => sum + e.amount, 0);
  const expense = entries
    .filter((e) => e.type === "EXPENSE" && e.status === "PAID")
    .reduce((sum, e) => sum + e.amount, 0);
  const pending = entries
    .filter((e) => e.status === "PENDING")
    .reduce((sum, e) => sum + (e.type === "INCOME" ? e.amount : -e.amount), 0);

  const cards = [
    { label: "Receitas (pagas)", value: formatCurrency(income), tone: "text-green-600" },
    { label: "Despesas (pagas)", value: formatCurrency(expense), tone: "text-red-600" },
    { label: "Saldo", value: formatCurrency(income - expense), tone: "text-slate-900" },
    { label: "Em aberto", value: formatCurrency(pending), tone: "text-amber-600" },
  ];

  return (
    <div>
      <PageHeader
        title="Financeiro"
        description="Caixa, contas a pagar e receber."
        action={<EntryForm />}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card p-5">
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className={`mt-1 text-xl font-bold ${c.tone}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {entries.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">Nenhum lancamento ainda.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Descricao</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Vencimento</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{e.description}</td>
                  <td className="px-4 py-3">
                    <span className={e.type === "INCOME" ? "text-green-600" : "text-red-600"}>
                      {e.type === "INCOME" ? "Receita" : "Despesa"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatCurrency(e.amount)}</td>
                  <td className="px-4 py-3 text-slate-600">{e.dueDate ? formatDate(e.dueDate) : "-"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        e.status === "PAID"
                          ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
                          : "rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700"
                      }
                    >
                      {e.status === "PAID" ? "Pago" : "Em aberto"}
                    </span>
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
