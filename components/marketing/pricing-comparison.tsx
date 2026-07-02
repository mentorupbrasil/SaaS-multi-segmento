"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Minus, Star } from "lucide-react";
import { COMPARISON_INCLUDED_EVERYWHERE, getDifferentiatingComparisonRows, PLANS } from "@/lib/plans";
import { cn, formatCurrency } from "@/lib/utils";

function planPriceLabel(priceMonthly: number | null): string {
  if (priceMonthly === null) return "Sob consulta";
  return `${formatCurrency(priceMonthly)}/mês`;
}

function FeatureValue({ value, inline }: { value: string | boolean; inline?: boolean }) {
  if (value === true) {
    return (
      <span className={cn("inline-flex items-center gap-2", inline ? "text-sm text-foreground" : "")}>
        <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden />
        {inline && <span className="sr-only">Incluído</span>}
      </span>
    );
  }
  if (value === false) {
    return (
      <span className={cn("inline-flex items-center gap-2 text-muted-foreground/60", inline ? "text-sm" : "")}>
        <Minus className="h-4 w-4 shrink-0" aria-hidden />
        {inline && <span className="sr-only">Não incluído</span>}
      </span>
    );
  }
  return <span className="text-sm font-medium text-foreground">{value}</span>;
}

function IncludedEverywhere() {
  return (
    <div className="rounded-xl border border-border bg-muted/30 px-4 py-4 sm:px-5">
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-primary">
        Incluído em todos os planos
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {COMPARISON_INCLUDED_EVERYWHERE.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MobilePlanPicker({
  activeId,
  onChange,
}: {
  activeId: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {PLANS.map((plan) => {
        const active = plan.id === activeId;
        return (
          <button
            key={plan.id}
            type="button"
            onClick={() => onChange(plan.id)}
            className={cn(
              "shrink-0 rounded-xl border px-4 py-2.5 text-left transition-colors",
              active
                ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/30"
                : "border-border bg-card text-muted-foreground hover:border-primary/30",
            )}
          >
            <span className="block text-sm font-semibold">{plan.name}</span>
            <span className="block text-xs opacity-80">{planPriceLabel(plan.priceMonthly)}</span>
          </button>
        );
      })}
    </div>
  );
}

function MobileComparison({ highlightPlanId }: { highlightPlanId: string }) {
  const [activeId, setActiveId] = useState(highlightPlanId);
  const planIndex = PLANS.findIndex((p) => p.id === activeId);
  const plan = PLANS[planIndex];
  const rows = getDifferentiatingComparisonRows();

  if (!plan) return null;

  return (
    <div className="space-y-4 md:hidden">
      <MobilePlanPicker activeId={activeId} onChange={setActiveId} />
      <div
        className={cn(
          "rounded-2xl border bg-card p-5 shadow-sm",
          plan.highlight ? "border-primary/40 ring-1 ring-primary/15" : "border-border",
        )}
      >
        {plan.highlight && (
          <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
            <Star className="h-3 w-3 fill-current" aria-hidden />
            {plan.badge ?? "Popular"}
          </span>
        )}
        <p className="text-lg font-bold text-foreground">{plan.name}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{planPriceLabel(plan.priceMonthly)}</p>

        <ul className="mt-5 space-y-3 border-t border-border pt-5">
          {rows.map((row) => (
            <li key={row.label} className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">{row.label}</span>
              <FeatureValue value={row.values[planIndex]!} />
            </li>
          ))}
        </ul>

        <Link
          href={plan.priceMonthly === null ? "/suporte" : `/signup?plan=${plan.id}`}
          className={cn("btn-primary mt-6 block w-full text-center", !plan.highlight && "btn-secondary")}
        >
          {plan.priceMonthly === null ? "Falar com vendas" : `Assinar ${plan.name}`}
        </Link>
      </div>
    </div>
  );
}

function DesktopComparison({ highlightPlanId }: { highlightPlanId: string }) {
  const highlightIndex = PLANS.findIndex((p) => p.id === highlightPlanId);
  const rows = getDifferentiatingComparisonRows();

  return (
    <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:block">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <caption className="sr-only">Diferenças entre planos Inicial, Profissional e Enterprise</caption>
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-5 py-4 text-left font-semibold text-foreground">O que muda</th>
              {PLANS.map((plan, index) => (
                <th
                  key={plan.id}
                  className={cn(
                    "min-w-[140px] px-4 py-4 text-center",
                    index === highlightIndex && "bg-primary/[0.06]",
                    plan.highlight && "border-x border-primary/15",
                  )}
                >
                  <div className="flex flex-col items-center gap-1">
                    {plan.highlight && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">
                        <Star className="h-3 w-3 fill-current" aria-hidden />
                        Popular
                      </span>
                    )}
                    <span className={cn("font-bold", plan.highlight && "text-primary")}>{plan.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {planPriceLabel(plan.priceMonthly)}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-border last:border-0">
                <td className="px-5 py-3.5 text-muted-foreground">{row.label}</td>
                {row.values.map((value, index) => (
                  <td
                    key={`${row.label}-${index}`}
                    className={cn("px-4 py-3.5 text-center", index === highlightIndex && "bg-primary/[0.04]")}
                  >
                    <FeatureValue value={value} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-border bg-muted/30">
            <tr>
              <td className="px-5 py-4 font-medium text-foreground">Escolher</td>
              {PLANS.map((plan, index) => (
                <td
                  key={plan.id}
                  className={cn("px-4 py-4 text-center", index === highlightIndex && "bg-primary/[0.04]")}
                >
                  <Link
                    href={plan.priceMonthly === null ? "/suporte" : `/signup?plan=${plan.id}`}
                    className={cn(
                      "inline-flex min-w-[120px] items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
                      plan.highlight ? "btn-primary" : "btn-secondary",
                    )}
                  >
                    {plan.priceMonthly === null ? "Vendas" : "Assinar"}
                  </Link>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export function PricingComparison({
  highlightPlanId = "starter",
  className,
}: {
  highlightPlanId?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-5", className)}>
      <IncludedEverywhere />
      <MobileComparison highlightPlanId={highlightPlanId} />
      <DesktopComparison highlightPlanId={highlightPlanId} />
    </div>
  );
}
