"use client";

import Link from "next/link";
import { Icon } from "@/components/icon";
import { HeroMockup } from "@/components/marketing/hero-mockup";
import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";

export function HomeHero({ starterPrice }: { starterPrice?: number }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="section-glow absolute inset-0" />
      <div className="section relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <FadeIn>
          <span className="eyebrow">
            <Icon name="Sparkles" className="h-3.5 w-3.5" />
            Gestão sob medida para o seu ramo
          </span>
          <h1 className="text-balance mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
            Tudo o que o seu negócio precisa,{" "}
            <span className="gradient-text">em um só lugar</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Escolha o seu segmento e tenha agenda, clientes, serviços e financeiro com a linguagem
            do seu nicho. Cadastro em minutos
            {starterPrice != null ? `, a partir de R$ ${starterPrice.toFixed(2).replace(".", ",")}/mês` : ""}
            {" "}— acesso após confirmação do pagamento.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/signup">
                Assinar agora
                <Icon name="ArrowRight" className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/precos">
                Ver planos
                <Icon name="ArrowRight" className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="Check" className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> A partir de R$ 39,90/mês
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="Check" className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Sem fidelidade
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="Check" className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Suporte em português
            </span>
          </div>
        </FadeIn>
        <HeroMockup />
      </div>
    </section>
  );
}
