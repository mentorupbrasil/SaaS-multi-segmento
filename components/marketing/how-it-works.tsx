"use client";

import Link from "next/link";
import { Icon } from "@/components/icon";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/fade-in";
import { SectionHeader } from "./section-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: "Search",
    step: "01",
    title: "Escolha o seu segmento",
    text: "Busque pelo ramo ou navegue pelas categorias. Menus e termos já vêm prontos para barbearia, clínica, oficina e dezenas de outros.",
  },
  {
    icon: "LogIn",
    step: "02",
    title: "Assine e ative sua conta",
    text: "Escolha o plano, conclua o cadastro e pague via Asaas. O painel libera na confirmação do pagamento.",
  },
  {
    icon: "Rocket",
    step: "03",
    title: "Comece a operar",
    text: "Agenda, clientes, serviços e financeiro prontos. Convide a equipe e personalize quando quiser.",
  },
];

function StepCard({ item, featured = false }: { item: (typeof STEPS)[number]; featured?: boolean }) {
  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md",
        featured ? "border-primary/25 ring-1 ring-primary/10" : "border-border",
      )}
    >
      {featured && (
        <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-xl bg-gradient-to-r from-brand-500 via-violet-500 to-fuchsia-500" />
      )}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold tabular-nums tracking-wider text-primary">Passo {item.step}</span>
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1",
            featured
              ? "bg-primary text-primary-foreground ring-primary/20"
              : "bg-primary/10 text-primary ring-primary/15",
          )}
        >
          <Icon name={item.icon} className="h-4 w-4" />
        </span>
      </div>
      <h3 className="mt-3 text-base font-semibold leading-snug text-foreground">{item.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
    </article>
  );
}

export function HowItWorks() {
  return (
    <section className="border-y border-border bg-background py-12 md:py-14">
      <div className="section">
        <FadeIn>
          <SectionHeader
            eyebrow="Como funciona"
            title="Do cadastro à operação em minutos"
            description="Três passos diretos — escolha o segmento, assine e comece a operar."
          />
        </FadeIn>

        <StaggerContainer className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5" stagger={0.08}>
          {STEPS.map((item, index) => (
            <StaggerItem key={item.step}>
              <StepCard item={item} featured={index === 0} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.2} className="mt-8 text-center">
          <Button asChild size="default">
            <Link href="/signup">
              Assinar agora
              <Icon name="ArrowRight" className="h-4 w-4" />
            </Link>
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
