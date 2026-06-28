import Link from "next/link";
import { getAuthContext } from "@/lib/auth-context";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/page-header";
import { syncOverdueEntries } from "@/modules/financial/actions";
import { EntryForm } from "@/modules/financial/entry-form";
import { MarkPaidButton } from "@/components/mark-paid-button";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function FinanceiroPage() {
  const ctx = await getAuthContext();
  const org = ctx.organization;

  await syncOverdueEntries();

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
  const overdueEntries = entries.filter((e) => e.status === "OVERDUE");

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
        description="Caixa, contas a pagar e a receber."
        action={<EntryForm />}
      />

      <p className="mb-4 text-sm text-slate-500">
        <Link href="/caixa" className="text-brand-600 hover:underline">
          Ir para o caixa →
        </Link>
      </p>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card p-5">
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className={`mt-1 text-xl font-bold ${c.tone}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {overdueEntries.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-lg font-semibold text-red-700">Vencidos ({overdueEntries.length})</h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-red-50 text-left text-xs uppercase tracking-wider text-red-600">
                <tr>
                  <th className="px-4 py-3">Descrição</th>
                  <th className="px-4 py-3">Valor</th>
                  <th className="px-4 py-3">Vencimento</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {overdueEntries.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{e.description}</td>
                    <td className="px-4 py-3 text-slate-600">{formatCurrency(e.amount)}</td>
                    <td className="px-4 py-3 text-red-600">{e.dueDate ? formatDate(e.dueDate) : "—"}</td>
                    <td className="px-4 py-3">
                      <MarkPaidButton id={e.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {entries.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">Nenhum lançamento ainda.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Descrição</th>
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
                    {e.status === "PAID" ? (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        Pago
                      </span>
                    ) : e.status === "OVERDUE" ? (
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                          Vencido
                        </span>
                        <MarkPaidButton id={e.id} />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                          Em aberto
                        </span>
                        <MarkPaidButton id={e.id} />
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
