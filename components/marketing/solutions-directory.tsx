"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Quote, Search } from "lucide-react";
import { SOLUTIONS } from "@/lib/solutions";
import { filterSolutions } from "@/lib/solution-vitrine";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import { CtaBand } from "./cta-band";

interface SolutionsDirectoryProps {
  initialQuery?: string;
}

const ACCENTS = [
  "from-brand-500/8 via-violet-500/5 to-white",
  "from-violet-500/8 via-fuchsia-500/5 to-white",
  "from-emerald-500/8 via-brand-500/5 to-white",
  "from-amber-500/8 via-orange-500/5 to-white",
] as const;

export function SolutionsDirectory({ initialQuery = "" }: SolutionsDirectoryProps) {
  const [query, setQuery] = useState(initialQuery);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const filtered = filterSolutions(query);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && SOLUTIONS.some((s) => s.slug === hash)) {
      setActiveSlug(hash);
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <>
      <div className="sticky top-16 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="section py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar financeiro, clientes, vendas..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-brand-300 focus:bg-white focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <p className="shrink-0 text-sm text-slate-500">
              {filtered.length} de {SOLUTIONS.length} soluções
            </p>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {SOLUTIONS.map((s) => (
              <a
                key={s.slug}
                href={`#${s.slug}`}
                onClick={() => setActiveSlug(s.slug)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  activeSlug === s.slug
                    ? "bg-brand-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                )}
              >
                <Icon name={s.icon} className="h-3.5 w-3.5" />
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      <section className="section space-y-8 py-10 lg:py-12">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <p className="text-slate-600">Nenhuma solução encontrada.</p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-3 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              Limpar busca
            </button>
          </div>
        ) : (
          filtered.map((s, i) => (
            <article
              key={s.slug}
              id={s.slug}
              className={cn(
                "card-elevated scroll-mt-36 overflow-hidden",
                "grid items-stretch lg:grid-cols-2",
              )}
            >
              <div
                className={cn(
                  "relative p-8 sm:p-10 lg:p-12",
                  "bg-gradient-to-br",
                  ACCENTS[i % ACCENTS.length],
                  i % 2 === 1 && "lg:order-2",
                )}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-lg shadow-brand-500/25">
                  <Icon name={s.icon} className="h-6 w-6" />
                </span>

                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
                  <Quote className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" />
                  <p className="text-sm italic leading-relaxed text-slate-600">{s.pain}</p>
                </div>

                <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {s.headline}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-slate-600">{s.description}</p>

                <Link href="/signup" className="btn-primary mt-8 shadow-md shadow-brand-600/20">
                  Assinar agora
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <ul
                className={cn(
                  "flex flex-col justify-center gap-3 bg-white p-8 sm:p-10 lg:p-12",
                  i % 2 === 1 && "lg:order-1",
                )}
              >
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  O que você ganha
                </p>
                {s.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-4 transition-colors hover:border-brand-100 hover:bg-brand-50/30"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                      <Icon name="Check" className="h-3 w-3" />
                    </span>
                    <span className="text-sm font-medium text-slate-700">{b}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))
        )}
      </section>

      <CtaBand
        title="Qual problema você quer resolver primeiro?"
        description="Assine e veja o GestorPro se adaptar ao seu segmento em minutos."
      />
    </>
  );
}
