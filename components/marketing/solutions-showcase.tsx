"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { SOLUTIONS } from "@/lib/solutions";
import type { Solution } from "@/lib/solutions";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

const ACCENTS = [
  "from-brand-500/10 via-brand-400/5 to-transparent",
  "from-brand-400/10 via-brand-500/5 to-transparent",
  "from-emerald-500/10 via-brand-500/5 to-transparent",
  "from-amber-500/10 via-orange-500/5 to-transparent",
] as const;

function SolutionPreview({ solution, accent }: { solution: Solution; accent: string }) {
  return (
    <div className={cn("relative h-full overflow-hidden p-6 sm:p-8 lg:p-10", "bg-gradient-to-br", accent)}>
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-400/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-brand-400/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-start gap-3 rounded-2xl border border-border bg-card/90 p-4 shadow-sm backdrop-blur-sm">
          <Quote className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" />
          <p className="text-sm italic leading-relaxed text-muted-foreground">{solution.pain}</p>
        </div>

        <h3 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {solution.headline}
        </h3>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">{solution.description}</p>

        <ul className="mt-6 space-y-2.5">
          {solution.bullets.slice(0, 3).map((bullet) => (
            <li key={bullet} className="flex items-start gap-2.5 text-sm text-foreground">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Icon name="Check" className="h-3 w-3" />
              </span>
              {bullet}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/solucoes#${solution.slug}`}
            className="btn-primary px-5 py-2.5 shadow-md shadow-brand-600/20"
          >
            Ver solução completa
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/signup" className="btn-secondary px-5 py-2.5">
            Assinar agora
          </Link>
        </div>
      </div>
    </div>
  );
}

export function SolutionsShowcase() {
  const [activeSlug, setActiveSlug] = useState(SOLUTIONS[0]?.slug ?? "");
  const active = SOLUTIONS.find((s) => s.slug === activeSlug) ?? SOLUTIONS[0];
  const activeIndex = SOLUTIONS.findIndex((s) => s.slug === activeSlug);

  return (
    <section className="section-premium relative border-y border-border py-16 lg:py-24">
      <div className="section-glow pointer-events-none" aria-hidden />

      <div className="section relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">Soluções</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            Problemas reais,{" "}
            <span className="gradient-text">resolvidos no dia a dia</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Mais do que um sistema — uma forma de organizar, vender e crescer o negócio.
          </p>
        </div>

        {/* Painel interativo — desktop */}
        <div className="card-elevated mt-12 hidden overflow-hidden lg:block">
          <div className="grid min-h-[420px] grid-cols-[300px_1fr]">
            <nav className="border-r border-border bg-muted/50 p-3">
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Escolha o desafio
              </p>
              <ul className="space-y-1">
                {SOLUTIONS.map((solution, i) => {
                  const isActive = solution.slug === activeSlug;
                  return (
                    <li key={solution.slug}>
                      <button
                        type="button"
                        onClick={() => setActiveSlug(solution.slug)}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-xl px-3 py-3.5 text-left transition-all",
                          isActive
                            ? "bg-card text-primary shadow-md shadow-black/10 ring-1 ring-border"
                            : "text-muted-foreground hover:bg-card/70 hover:text-foreground",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                            isActive
                              ? "bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-500/25"
                              : "bg-card text-muted-foreground ring-1 ring-border/80",
                          )}
                        >
                          <Icon name={solution.icon} className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 pt-0.5">
                          <span className="block text-sm font-semibold leading-snug">{solution.title}</span>
                          <span className="mt-1 block line-clamp-2 text-xs leading-snug text-muted-foreground">
                            {solution.headline}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {active && (
              <SolutionPreview
                solution={active}
                accent={ACCENTS[activeIndex >= 0 ? activeIndex % ACCENTS.length : 0]}
              />
            )}
          </div>
        </div>

        {/* Mobile — pills + preview */}
        <div className="mt-10 lg:hidden">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {SOLUTIONS.map((solution) => (
              <button
                key={solution.slug}
                type="button"
                onClick={() => setActiveSlug(solution.slug)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors",
                  solution.slug === activeSlug
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card text-muted-foreground ring-1 ring-border",
                )}
              >
                <Icon name={solution.icon} className="h-3.5 w-3.5" />
                {solution.title}
              </button>
            ))}
          </div>

          {active && (
            <div className="card-elevated mt-4 overflow-hidden">
              <SolutionPreview
                solution={active}
                accent={ACCENTS[activeIndex >= 0 ? activeIndex % ACCENTS.length : 0]}
              />
            </div>
          )}
        </div>

        {/* Cards compactos — visão geral */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SOLUTIONS.map((solution, i) => (
            <Link
              key={solution.slug}
              href={`/solucoes#${solution.slug}`}
              onMouseEnter={() => setActiveSlug(solution.slug)}
              className={cn(
                "group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300",
                solution.slug === activeSlug
                  ? "border-primary/30 bg-card shadow-lg shadow-brand-500/10 ring-1 ring-primary/20"
                  : "border-border bg-card/80 hover:border-primary/30 hover:shadow-md",
              )}
            >
              <div
                className={cn(
                  "absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100",
                  i === 0 && "from-brand-500 to-brand-400",
                  i === 1 && "from-brand-400 to-brand-500",
                  i === 2 && "from-emerald-500 to-brand-500",
                  i === 3 && "from-amber-500 to-orange-500",
                  solution.slug === activeSlug && "opacity-100",
                )}
              />
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary ring-1 ring-primary/20">
                <Icon name={solution.icon} className="h-4 w-4" />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-foreground group-hover:text-primary">
                {solution.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{solution.headline}</p>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-center">
          <Link
            href="/solucoes"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80"
          >
            Ver todas as soluções
            <ArrowRight className="h-4 w-4" />
          </Link>
        </p>
      </div>
    </section>
  );
}
