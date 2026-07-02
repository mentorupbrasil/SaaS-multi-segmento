import { Shield, CreditCard, RefreshCw, Headphones } from "lucide-react";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { PricingComparison } from "@/components/marketing/pricing-comparison";
import { cn } from "@/lib/utils";

type PricingProps = {
  withComparison?: boolean;
  /** Oculta título duplicado quando a página já tem PageHero */
  showHeader?: boolean;
  variant?: "default" | "premium";
};

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
            <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">O que muda em cada plano</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Todos incluem o sistema completo do segmento. Compare só usuários, filiais e recursos avançados.
            </p>
          </div>
          <PricingComparison className={premium ? "shadow-xl shadow-black/5 ring-1 ring-border/50" : undefined} />
        </div>
      )}
    </section>
  );
}