import Link from "next/link";
import { Check } from "lucide-react";
import { PLANS } from "@/lib/plans";
import { formatCurrency, cn } from "@/lib/utils";

export function Pricing() {
  return (
    <section id="precos" className="section py-20">
      <div className="text-center">
        <span className="eyebrow">Precos</span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Planos simples e transparentes
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
          Comece com 14 dias gratis, sem cartao de credito. Cancele quando quiser.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm",
              plan.highlight ? "border-brand-300 ring-2 ring-brand-500" : "border-slate-200",
            )}
          >
            {plan.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                Mais popular
              </span>
            )}
            <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
            <p className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight text-slate-900">
                {formatCurrency(plan.priceMonthly)}
              </span>
              <span className="text-sm text-slate-500">/mes</span>
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className={cn("mt-8 w-full text-center", plan.highlight ? "btn-primary" : "btn-secondary")}
            >
              Comecar agora
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
