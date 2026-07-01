import { Check, Minus, Shield, CreditCard, RefreshCw, Headphones } from "lucide-react";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { PLANS, COMPARISON } from "@/lib/plans";
import { cn } from "@/lib/utils";

type PricingProps = {
  withComparison?: boolean;
  /** Oculta título duplicado quando a página já tem PageHero */
  showHeader?: boolean;
  variant?: "default" | "premium";
};

function CellValue({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="mx-auto h-5 w-5 text-primary" />;
  if (value === false) return <Minus className="mx-auto h-4 w-4 text-muted-foreground/40" />;
  return <span className="text-sm font-medium text-foreground">{value}</span>;
}

const TRUST_ITEMS = [
  { icon: RefreshCw, label: "Sem fidelidade" },
  { icon: CreditCard, label: "PIX, boleto e cartão" },
  { icon: Shield, label: "Pagamento seguro Asaas" },
  { icon: Headphones, label: "Suporte em português" },
] as const;

export function PricingTrustBar() {
  return (
    <div className="border-b border-border bg-muted/30">
      <div className="section py-5">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <li key={label} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-card shadow-sm ring-1 ring-border">
                <Icon className="h-4 w-4 text-primary" />
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
    <section id="precos" className={cn(premium ? "section-premium relative" : "", "pb-4")}>
      {premium && <div className="section-glow pointer-events-none" aria-hidden />}

      <PricingCards showHeader={showHeader} className={cn(!showHeader && "pt-4", premium && "relative")} />

      {withComparison && (
        <div className={cn("section relative mx-auto max-w-5xl pb-16", premium ? "mt-8" : "mt-12")}>
          <div className="mb-8 text-center">
            <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Compare os planos em detalhes</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Todos incluem agenda, clientes e financeiro. Módulos avançados do segmento a partir do Profissional.
            </p>
          </div>
          <div
            className={cn(
              "overflow-x-auto rounded-2xl border border-border bg-card",
              premium ? "shadow-xl shadow-black/5 ring-1 ring-border/50" : "",
            )}
          >
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-5 py-4 text-left text-sm font-semibold text-foreground">Funcionalidade</th>
                  {PLANS.map((p) => (
                    <th
                      key={p.id}
                      className={cn(
                        "px-3 py-4 text-center text-sm font-semibold",
                        p.highlight ? "bg-primary/5 text-primary" : "text-foreground",
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
      <tr className="bg-card">
        <td
          colSpan={PLANS.length + 1}
          className="border-b border-border px-5 pb-2 pt-5 text-xs font-bold uppercase tracking-wider text-primary"
        >
          {group.group}
        </td>
      </tr>
      {group.rows.map((row) => (
        <tr key={row.label} className="border-b border-border last:border-0 hover:bg-muted/30">
          <td className="px-5 py-3.5 text-sm text-muted-foreground">{row.label}</td>
          {row.values.map((v, i) => (
            <td key={i} className={cn("px-3 py-3.5 text-center", i === proIndex && "bg-primary/5")}>
              <CellValue value={v} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}