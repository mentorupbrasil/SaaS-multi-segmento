import Link from "next/link";
import { Check, Minus, Shield, CreditCard, RefreshCw, Headphones } from "lucide-react";
import { PLANS, COMPARISON, type Plan } from "@/lib/plans";
import { formatCurrency, cn } from "@/lib/utils";

type PricingProps = {
  withComparison?: boolean;
  /** Oculta título duplicado quando a página já tem PageHero */
  showHeader?: boolean;
  variant?: "default" | "premium";
};

function CellValue({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="mx-auto h-5 w-5 text-brand-600" />;
  if (value === false) return <Minus className="mx-auto h-4 w-4 text-slate-300" />;
  return <span className="text-sm font-medium text-slate-700">{value}</span>;
}

function PlanCard({ plan, variant }: { plan: Plan; variant: "default" | "premium" }) {
  const isEnterprise = plan.priceMonthly === null;
  const premium = variant === "premium";

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-white transition-all duration-300",
        premium ? "p-7" : "p-6",
        plan.highlight
          ? premium
            ? "border-brand-300/80 bg-gradient-to-b from-brand-50/40 to-white shadow-xl shadow-brand-600/10 ring-2 ring-brand-500/20 lg:-translate-y-3 lg:scale-[1.02]"
            : "border-brand-300 shadow-lg shadow-brand-600/10 ring-1 ring-brand-200 lg:-translate-y-2"
          : premium
            ? "border-slate-200/80 shadow-sm hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/5"
            : "border-slate-200 shadow-sm hover:shadow-md",
      )}
    >
      {plan.badge && (
        <span
          className={cn(
            "absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-semibold shadow-sm",
            plan.highlight ? "bg-brand-600 text-white" : "bg-slate-900 text-white",
          )}
        >
          {plan.badge}
        </span>
      )}

      <h3 className={cn("font-semibold text-slate-900", premium ? "text-xl" : "text-lg")}>
        {plan.name}
      </h3>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-brand-600">
        {plan.audience}
      </p>
      <p className={cn("mt-3 text-slate-500", premium ? "min-h-[44px] text-sm" : "min-h-[40px] text-sm")}>
        {plan.description}
      </p>

      <p className="mt-5 flex items-baseline gap-1">
        {isEnterprise ? (
          <span className="text-2xl font-bold tracking-tight text-slate-900">Sob consulta</span>
        ) : (
          <>
            <span className={cn("font-bold tracking-tight text-slate-900", premium ? "text-4xl" : "text-4xl")}>
              {formatCurrency(plan.priceMonthly as number)}
            </span>
            <span className="text-sm text-slate-500">/mês</span>
          </>
        )}
      </p>

      {premium && !isEnterprise && (
        <p className="mt-1 text-xs text-slate-400">Cobrança mensal · cancele quando quiser</p>
      )}

      <Link
        href={isEnterprise ? "/suporte" : `/signup?plan=${plan.id}`}
        className={cn(
          "mt-5 w-full text-center",
          plan.highlight ? "btn-primary py-3" : premium ? "btn-secondary py-3" : "btn-secondary",
        )}
      >
        {isEnterprise ? "Falar com vendas" : `Assinar ${plan.name}`}
      </Link>

      <ul className={cn("space-y-3 border-t border-slate-100 pt-6", premium ? "mt-6" : "mt-6")}>
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
            <Check
              className={cn(
                "mt-0.5 shrink-0 text-brand-600",
                premium && plan.highlight ? "h-4 w-4" : "h-4 w-4",
              )}
            />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

const TRUST_ITEMS = [
  { icon: RefreshCw, label: "Sem fidelidade" },
  { icon: CreditCard, label: "PIX, boleto e cartão" },
  { icon: Shield, label: "Pagamento seguro Asaas" },
  { icon: Headphones, label: "Suporte em português" },
] as const;

export function PricingTrustBar() {
  return (
    <div className="border-b border-slate-100 bg-slate-50/80">
      <div className="section py-5">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <li key={label} className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200/80">
                <Icon className="h-4 w-4 text-brand-600" />
              </span>
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Pricing({
  withComparison = true,
  showHeader = true,
  variant = "default",
}: PricingProps) {
  const premium = variant === "premium";

  return (
    <section id="precos" className={cn(premium ? "section-premium py-16 lg:py-20" : "section py-16")}>
      {premium && <div className="section-glow pointer-events-none" aria-hidden />}

      {showHeader && (
        <div className="relative mx-auto max-w-2xl text-center">
          <span className="eyebrow">Planos</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Preços simples e transparentes
          </h2>
          <p className="mt-3 text-slate-600">
            Escolha o plano ideal e comece a usar na hora. Sem fidelidade — mude de plano ou cancele
            quando quiser.
          </p>
        </div>
      )}

      <div
        className={cn(
          "relative mx-auto grid max-w-6xl items-start gap-5 sm:grid-cols-2 lg:grid-cols-4",
          showHeader ? "mt-12" : "mt-0",
        )}
      >
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} variant={variant} />
        ))}
      </div>

      {withComparison && (
        <div className={cn("relative mx-auto max-w-5xl", premium ? "mt-20" : "mt-16")}>
          <div className="mb-8 text-center">
            <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Compare os planos em detalhes
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Todos incluem agenda, clientes e financeiro. Módulos avançados do segmento a partir do Profissional.
            </p>
          </div>
          <div
            className={cn(
              "overflow-x-auto",
              premium
                ? "rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40 ring-1 ring-slate-100"
                : "rounded-2xl border border-slate-200",
            )}
          >
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/90">
                  <th className="px-5 py-4 text-left text-sm font-semibold text-slate-900">
                    Funcionalidade
                  </th>
                  {PLANS.map((p) => (
                    <th
                      key={p.id}
                      className={cn(
                        "px-3 py-4 text-center text-sm font-semibold",
                        p.highlight ? "bg-brand-50/50 text-brand-800" : "text-slate-900",
                      )}
                    >
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((group) => (
                  <Group key={group.group} group={group} highlightPlanId="pro" />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

function Group({
  group,
  highlightPlanId,
}: {
  group: (typeof COMPARISON)[number];
  highlightPlanId?: string;
}) {
  const proIndex = PLANS.findIndex((p) => p.id === highlightPlanId);

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
        <tr key={row.label} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
          <td className="px-5 py-3.5 text-sm text-slate-600">{row.label}</td>
          {row.values.map((v, i) => (
            <td
              key={i}
              className={cn("px-3 py-3.5 text-center", i === proIndex && "bg-brand-50/30")}
            >
              <CellValue value={v} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
