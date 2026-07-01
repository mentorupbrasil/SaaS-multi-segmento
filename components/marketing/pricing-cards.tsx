"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";
import { PLANS, type Plan } from "@/lib/plans";
import { cn } from "@/lib/utils";

interface PricingCardsProps {
  title?: string;
  description?: string;
  className?: string;
  showHeader?: boolean;
}

function yearlyMonthlyPrice(monthly: number) {
  return Math.round(monthly * 0.8 * 100) / 100;
}

function planToCard(plan: Plan) {
  const isEnterprise = plan.priceMonthly === null;
  return {
    id: plan.id,
    name: plan.name,
    audience: plan.audience,
    monthly: plan.priceMonthly,
    yearlyMonthly: plan.priceMonthly != null ? yearlyMonthlyPrice(plan.priceMonthly) : null,
    features: plan.features,
    description: plan.description,
    buttonText: isEnterprise ? "Falar com vendas" : `Assinar ${plan.name}`,
    href: isEnterprise ? "/suporte" : `/signup?plan=${plan.id}`,
    isPopular: Boolean(plan.highlight),
    badge: plan.badge,
  };
}

export function PricingCards({
  title = "Preços simples e transparentes",
  description = "Escolha o plano ideal e comece a usar na hora.\nTodos incluem agenda, clientes e financeiro — sem fidelidade.",
  className,
  showHeader = true,
}: PricingCardsProps) {
  const [isMonthly, setIsMonthly] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const reduceMotion = useReducedMotion();
  const toggleWrapRef = useRef<HTMLDivElement>(null);

  const cards = useMemo(() => PLANS.map(planToCard), []);

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);
    if (checked && toggleWrapRef.current && !reduceMotion) {
      const rect = toggleWrapRef.current.getBoundingClientRect();
      confetti({
        particleCount: 48,
        spread: 60,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
        colors: ["#6366f1", "#8b5cf6", "#a855f7", "#e2e8f0"],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 28,
        shapes: ["circle"],
      });
    }
  };

  return (
    <div className={cn("section py-12 lg:py-16", className)}>
      {showHeader && (
        <div className="mb-10 space-y-4 text-center">
          <span className="eyebrow">Planos</span>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">{title}</h2>
          <p className="whitespace-pre-line text-lg text-muted-foreground">{description}</p>
        </div>
      )}

      <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
        <span className={cn("text-sm font-medium", isMonthly ? "text-foreground" : "text-muted-foreground")}>Mensal</span>
        <div ref={toggleWrapRef} className="flex items-center gap-2">
          <Label htmlFor="billing-toggle" className="sr-only">
            Cobrança anual
          </Label>
          <Switch id="billing-toggle" checked={!isMonthly} onCheckedChange={handleToggle} />
        </div>
        <span className={cn("text-sm font-semibold", !isMonthly ? "text-foreground" : "text-muted-foreground")}>
          Anual <span className="text-primary">(−20%)</span>
        </span>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-5 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((plan, index) => {
          const isEnterprise = plan.monthly === null;
          const displayPrice = isEnterprise ? null : isMonthly ? plan.monthly! : plan.yearlyMonthly!;

          return (
            <motion.div
              key={plan.id}
              initial={reduceMotion ? false : { y: 40, opacity: 0 }}
              whileInView={
                reduceMotion
                  ? undefined
                  : isDesktop
                    ? {
                        y: plan.isPopular ? -12 : 0,
                        opacity: 1,
                        scale: plan.isPopular ? 1.02 : index === 0 || index === 3 ? 0.98 : 1,
                      }
                    : { y: 0, opacity: 1 }
              }
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.65,
                type: "spring" as const,
                stiffness: 120,
                damping: 22,
                delay: index * 0.08,
              }}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card p-6 text-center lg:flex lg:flex-col lg:justify-center",
                plan.isPopular ? "z-10 border-2 border-primary shadow-lg shadow-primary/10" : "border-border shadow-sm",
                !plan.isPopular && "md:mt-2 lg:mt-4",
              )}
            >
              {(plan.isPopular || plan.badge) && (
                <div className="absolute right-0 top-0 flex items-center rounded-bl-xl rounded-tr-xl bg-primary px-2 py-1">
                  {plan.isPopular && <Star className="h-4 w-4 fill-primary-foreground text-primary-foreground" />}
                  <span className="ml-1 font-sans text-xs font-semibold text-primary-foreground">
                    {plan.badge ?? "Popular"}
                  </span>
                </div>
              )}

              <div className="flex flex-1 flex-col">
                <p className="text-base font-semibold text-muted-foreground">{plan.name}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary">{plan.audience}</p>

                <div className="mt-6 flex items-center justify-center gap-x-1">
                  {isEnterprise ? (
                    <span className="text-3xl font-bold tracking-tight text-foreground">Sob consulta</span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold tabular-nums tracking-tight text-foreground">
                        <NumberFlow
                          value={displayPrice!}
                          format={{
                            style: "currency",
                            currency: "BRL",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }}
                          transformTiming={{ duration: 450, easing: "ease-out" }}
                        />
                      </span>
                      <span className="text-sm font-semibold leading-6 text-muted-foreground">/mês</span>
                    </>
                  )}
                </div>

                {!isEnterprise && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {isMonthly ? "cobrança mensal" : "equivalente mensal no plano anual (−20%)"}
                  </p>
                )}

                <ul className="mt-5 flex flex-col gap-2 text-left">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-foreground/90">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <hr className="my-5 w-full border-border" />

                <Link
                  href={plan.href}
                  className={cn(
                    buttonVariants({ variant: plan.isPopular ? "default" : "outline" }),
                    "group relative w-full gap-2 overflow-hidden font-semibold tracking-tight transition-all duration-300",
                    !plan.isPopular &&
                      "hover:bg-primary hover:text-primary-foreground hover:ring-2 hover:ring-primary hover:ring-offset-1 hover:ring-offset-background",
                  )}
                >
                  {plan.buttonText}
                </Link>

                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{plan.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
