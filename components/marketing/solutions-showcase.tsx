"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { SOLUTIONS } from "@/lib/solutions";
import type { Solution } from "@/lib/solutions";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

const ACCENTS = [
  "from-brand-500/10 via-violet-500/5 to-transparent",
  "from-violet-500/10 via-fuchsia-500/5 to-transparent",
  "from-emerald-500/10 via-brand-500/5 to-transparent",
  "from-amber-500/10 via-orange-500/5 to-transparent",
] as const;

function SolutionPreview({ solution, accent }: { solution: Solution; accent: string }) {
  return (
    <div className={cn("relative h-full overflow-hidden p-6 sm:p-8 lg:p-10", "bg-gradient-to-br", accent)}>
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-400/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-violet-400/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
          <Quote className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" />
          <p className="text-sm italic leading-relaxed text-slate-600">{solution.pain}</p>
        </div>

        <h3 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {solution.headline}
        </h3>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600">{solution.description}</p>

        <ul className="mt-6 space-y-2.5">
          {solution.bullets.slice(0, 3).map((bullet) => (
            <li key={bullet} className="flex items-start gap-2.5 text-sm text-slate-700">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
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
    <section className="section-premium relative border-y border-slate-200/60 py-16 lg:py-24">
      <div className="section-glow pointer-events-none" aria-hidden />

      <div className="section relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">Soluções</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            Problemas reais,{" "}
            <span className="gradient-text">resolvidos no dia a dia</span>
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Mais do que um sistema — uma forma de organizar, vender e crescer o negócio.
          </p>
        </div>

        {/* Painel interativo — desktop */}
        <div className="card-elevated mt-12 hidden overflow-hidden lg:block">
          <div className="grid min-h-[420px] grid-cols-[300px_1fr]">
            <nav className="border-r border-slate-100 bg-slate-50/80 p-3">
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
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
                            ? "bg-white text-brand-700 shadow-md shadow-slate-200/60 ring-1 ring-slate-200/80"
                            : "text-slate-600 hover:bg-white/70 hover:text-slate-900",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                            isActive
                              ? "bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-lg shadow-brand-500/25"
                              : "bg-white text-slate-500 ring-1 ring-slate-200/80",
                          )}
                        >
                          <Icon name={solution.icon} className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 pt-0.5">
                          <span className="block text-sm font-semibold leading-snug">{solution.title}</span>
                          <span className="mt-1 block line-clamp-2 text-xs leading-snug text-slate-400">
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
                    ? "bg-brand-600 text-white shadow-md"
                    : "bg-white text-slate-600 ring-1 ring-slate-200",
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
                  ? "border-brand-200 bg-white shadow-lg shadow-brand-500/10 ring-1 ring-brand-100"
                  : "border-slate-200/80 bg-white/80 hover:border-brand-200 hover:shadow-md",
              )}
            >
              <div
                className={cn(
                  "absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100",
                  i === 0 && "from-brand-500 to-violet-500",
                  i === 1 && "from-violet-500 to-fuchsia-500",
                  i === 2 && "from-emerald-500 to-brand-500",
                  i === 3 && "from-amber-500 to-orange-500",
                  solution.slug === activeSlug && "opacity-100",
                )}
              />
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100">
                <Icon name={solution.icon} className="h-4 w-4" />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-slate-900 group-hover:text-brand-700">
                {solution.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">{solution.headline}</p>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-center">
          <Link
            href="/solucoes"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            Ver todas as soluções
            <ArrowRight className="h-4 w-4" />
          </Link>
        </p>
      </div>
    </section>
  );
}
