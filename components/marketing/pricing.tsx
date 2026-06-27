import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { PLANS, COMPARISON } from "@/lib/plans";
import { formatCurrency, cn } from "@/lib/utils";

function CellValue({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="mx-auto h-5 w-5 text-brand-600" />;
  if (value === false) return <Minus className="mx-auto h-4 w-4 text-slate-300" />;
  return <span className="text-sm font-medium text-slate-700">{value}</span>;
}

export function Pricing() {
  return (
    <section id="precos" className="section py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow">Planos</span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Preços simples e transparentes
        </h2>
        <p className="mt-3 text-slate-600">
          Comece com 14 dias grátis, sem cartão de crédito. Mude de plano ou cancele quando quiser.
        </p>
      </div>

      {/* Cards */}
      <div className="mx-auto mt-12 grid max-w-5xl items-start gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "relative flex flex-col rounded-2xl border bg-white p-7 transition-shadow",
              plan.highlight
                ? "border-brand-300 shadow-lg shadow-brand-600/10 ring-1 ring-brand-200 lg:-translate-y-2"
                : "border-slate-200 shadow-sm hover:shadow-md",
            )}
          >
            {plan.badge && (
              <span
                className={cn(
                  "absolute -top-3 left-7 rounded-full px-3 py-1 text-xs font-semibold",
                  plan.highlight ? "bg-brand-600 text-white" : "bg-slate-900 text-white",
                )}
              >
                {plan.badge}
              </span>
            )}
            <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{plan.description}</p>
            <p className="mt-5 flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight text-slate-900">
                {formatCurrency(plan.priceMonthly)}
              </span>
              <span className="text-sm text-slate-500">/mês</span>
            </p>
            <Link
              href="/signup"
              className={cn("mt-5 w-full text-center", plan.highlight ? "btn-primary" : "btn-secondary")}
            >
              Começar grátis
            </Link>
            <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Tabela comparativa */}
      <div className="mx-auto mt-16 max-w-5xl">
        <h3 className="mb-6 text-center text-lg font-semibold text-slate-900">
          Compare os planos em detalhes
        </h3>
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-900">
                  Funcionalidade
                </th>
                {PLANS.map((p) => (
                  <th key={p.id} className="px-3 py-4 text-center text-sm font-semibold text-slate-900">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((group) => (
                <Group key={group.group} group={group} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Group({ group }: { group: (typeof COMPARISON)[number] }) {
  return (
    <>
      <tr className="bg-white">
        <td
          colSpan={PLANS.length + 1}
          className="border-b border-slate-100 px-5 pb-2 pt-5 text-xs font-bold uppercase tracking-wider text-brand-600"
        >
          {group.group}
        </td>
      </tr>
      {group.rows.map((row) => (
        <tr key={row.label} className="border-b border-slate-100 last:border-0">
          <td className="px-5 py-3 text-sm text-slate-600">{row.label}</td>
          {row.values.map((v, i) => (
            <td key={i} className="px-3 py-3 text-center">
              <CellValue value={v} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
