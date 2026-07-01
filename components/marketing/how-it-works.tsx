"use client";

import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { Icon } from "@/components/icon";
import {
  ContainerScroll,
  ContainerSticky,
  ProcessCard,
  ProcessCardBody,
  ProcessCardTitle,
} from "@/components/ui/container-scroll";
import { SectionHeader } from "./section-header";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    icon: "Search",
    step: "01",
    title: "Escolha o seu segmento",
    text: "Busque pelo ramo ou navegue pelas categorias. O sistema já vem com menus e termos do seu nicho — barbearia, clínica, oficina e dezenas de outros.",
    variant: "indigo" as const,
  },
  {
    icon: "LogIn",
    step: "02",
    title: "Assine e ative sua conta",
    text: "Escolha o plano (Inicial, Profissional ou Premium), conclua o cadastro e pague via Asaas. O painel libera na confirmação do pagamento.",
    variant: "light" as const,
  },
  {
    icon: "Rocket",
    step: "03",
    title: "Comece a operar",
    text: "Agenda, clientes, serviços e financeiro prontos. Convide a equipe, personalize cadastros e escale quando crescer.",
    variant: "light" as const,
  },
];

function StaticSteps() {
  return (
    <section className="border-y border-border bg-background py-16 lg:py-20">
      <div className="section">
        <SectionHeader
          eyebrow="Como funciona"
          title="Do cadastro à operação em minutos"
          description="Três passos diretos — escolha o segmento, assine e comece a operar."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((item) => (
            <div key={item.step} className="card-elevated relative flex flex-col p-6">
              <span className="text-4xl font-black text-muted-foreground/30">{item.step}</span>
              <span className="mt-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                <Icon name={item.icon} className="h-6 w-6" />
              </span>
              <p className="mt-5 text-xs font-bold uppercase tracking-wider text-primary">Passo {item.step}</p>
              <h3 className="mt-1 text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild size="lg">
            <Link href="/signup">
              Assinar agora
              <Icon name="ArrowRight" className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <StaticSteps />;
  }

  return (
    <section className="border-y border-border bg-background">
      <ContainerScroll className="bg-background">
        <div className="section pb-8 pt-16 lg:pt-20">
          <SectionHeader
            eyebrow="Como funciona"
            title="Do cadastro à operação em minutos"
            description="Role a página e veja os três passos — escolha o segmento, assine e comece a operar."
          />
        </div>

        <ContainerSticky className="flex h-[min(85vh,720px)] items-center">
          <div className="section flex w-full gap-4 pb-8">
            {STEPS.map((item, index) => (
              <ProcessCard
                key={item.step}
                index={index}
                itemsLength={STEPS.length}
                variant={item.variant}
                size="lg"
                className="min-h-[320px] flex-col sm:min-h-[360px]"
              >
                <ProcessCardTitle>
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={
                        item.variant === "indigo" ? "text-5xl font-black text-white/20" : "text-5xl font-black text-muted-foreground/20"
                      }
                    >
                      {item.step}
                    </span>
                    <span
                      className={
                        item.variant === "indigo"
                          ? "flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/20"
                          : "flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20"
                      }
                    >
                      <Icon name={item.icon} className="h-6 w-6" />
                    </span>
                  </div>
                  <p
                    className={
                      item.variant === "indigo"
                        ? "mt-4 text-xs font-bold uppercase tracking-wider text-brand-200"
                        : "mt-4 text-xs font-bold uppercase tracking-wider text-primary"
                    }
                  >
                    Passo {item.step}
                  </p>
                  <h3
                    className={
                      item.variant === "indigo"
                        ? "mt-2 text-2xl font-bold tracking-tight text-white"
                        : "mt-2 text-2xl font-bold tracking-tight text-foreground"
                    }
                  >
                    {item.title}
                  </h3>
                </ProcessCardTitle>
                <ProcessCardBody className="flex-1">
                  <p
                    className={
                      item.variant === "indigo" ? "text-base leading-relaxed text-slate-200" : "text-base leading-relaxed text-muted-foreground"
                    }
                  >
                    {item.text}
                  </p>
                  {index === STEPS.length - 1 && (
                    <Button asChild size="lg" className="mt-auto w-fit">
                      <Link href="/signup">
                        Assinar agora
                        <Icon name="ArrowRight" className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </ProcessCardBody>
              </ProcessCard>
            ))}
          </div>
        </ContainerSticky>
      </ContainerScroll>
    </section>
  );
}
