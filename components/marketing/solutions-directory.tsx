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
  "from-brand-500/8 via-brand-400/5 to-background",
  "from-brand-400/8 via-brand-500/5 to-background",
  "from-emerald-500/8 via-brand-500/5 to-background",
  "from-amber-500/8 via-orange-500/5 to-background",
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
      <div className="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="section py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar financeiro, clientes, vendas..."
                className="w-full rounded-xl border border-border bg-muted py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <p className="shrink-0 text-sm text-muted-foreground">
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
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted",
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
          <div className="rounded-2xl border border-dashed border-border bg-card py-16 text-center">
            <p className="text-muted-foreground">Nenhuma solução encontrada.</p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-3 text-sm font-semibold text-primary hover:text-primary/80"
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
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-500/25">
                  <Icon name={s.icon} className="h-6 w-6" />
                </span>

                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/80 bg-card/90 p-4 shadow-sm backdrop-blur-sm">
                  <Quote className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" />
                  <p className="text-sm italic leading-relaxed text-muted-foreground">{s.pain}</p>
                </div>

                <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {s.headline}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{s.description}</p>

                <Link href="/signup" className="btn-primary mt-8 shadow-md shadow-brand-600/20">
                  Assinar agora
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <ul
                className={cn(
                  "flex flex-col justify-center gap-3 bg-card p-8 sm:p-10 lg:p-12",
                  i % 2 === 1 && "lg:order-1",
                )}
              >
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  O que você ganha
                </p>
                {s.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 rounded-xl border border-border bg-muted/50 p-4 transition-colors hover:border-primary/20 hover:bg-brand-50/30"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <Icon name="Check" className="h-3 w-3" />
                    </span>
                    <span className="text-sm font-medium text-foreground">{b}</span>
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
