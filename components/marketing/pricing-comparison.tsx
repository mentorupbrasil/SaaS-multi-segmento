import Link from "next/link";
import { Check, Star } from "lucide-react";
import { PLANS, type Plan } from "@/lib/plans";
import { cn, formatCurrency } from "@/lib/utils";

function PlanIncludesCard({ plan }: { plan: Plan }) {
  const isEnterprise = plan.priceMonthly === null;

  return (
    <article
      className={cn(
        "flex flex-col rounded-2xl border bg-card p-5 shadow-sm sm:p-6",
        plan.highlight
          ? "border-primary/40 ring-2 ring-primary/20"
          : "border-border",
      )}
    >
      <div className="mb-4">
        {plan.highlight ? (
          <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
            <Star className="h-3 w-3 fill-current" aria-hidden />
            {plan.badge ?? "Popular"}
          </span>
        ) : plan.badge ? (
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            {plan.badge}
          </span>
        ) : null}

        <h4 className={cn("text-lg font-bold", plan.highlight ? "text-primary" : "text-foreground")}>
          {plan.name}
        </h4>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-primary/80">{plan.audience}</p>
        <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
          {isEnterprise ? "Sob consulta" : formatCurrency(plan.priceMonthly!)}
          {!isEnterprise && <span className="text-sm font-medium text-muted-foreground"> /mês</span>}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{plan.description}</p>
      </div>

      <div className="flex flex-1 flex-col border-t border-border pt-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground">Você leva</p>
        <ul className="space-y-2.5">
          {plan.features.map((feature, index) => {
            const isInherited = feature.startsWith("Tudo do");
            return (
              <li key={feature} className="flex items-start gap-2.5">
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                    isInherited ? "bg-muted" : "bg-primary/10",
                  )}
                >
                  <Check
                    className={cn("h-3 w-3", isInherited ? "text-muted-foreground" : "text-primary")}
                    aria-hidden
                  />
                </span>
                <span
                  className={cn(
                    "text-sm leading-snug",
                    isInherited ? "font-semibold text-foreground" : "text-foreground/90",
                    index === 0 && isInherited && "text-primary",
                  )}
                >
                  {feature}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <Link
        href={isEnterprise ? "/suporte" : `/signup?plan=${plan.id}`}
        className={cn(
          "mt-6 block w-full rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition-colors",
          plan.highlight ? "btn-primary" : "btn-secondary",
        )}
      >
        {isEnterprise ? "Falar com vendas" : `Assinar ${plan.name}`}
      </Link>
    </article>
  );
}

export function PricingComparison({ className }: { highlightPlanId?: string; className?: string }) {
  return (
    <div className={cn("grid gap-5 lg:grid-cols-3", className)}>
      {PLANS.map((plan) => (
        <PlanIncludesCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}
