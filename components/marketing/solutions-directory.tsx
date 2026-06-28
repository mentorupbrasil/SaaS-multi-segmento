"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SOLUTIONS } from "@/lib/solutions";
import { filterSolutions } from "@/lib/solution-vitrine";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

interface SolutionsDirectoryProps {
  initialQuery?: string;
}

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
      <div className="sticky top-16 z-40 -mx-4 border-b border-slate-200/80 bg-white/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar solução..."
            className="min-w-0 flex-1 rounded-xl border border-slate-200 py-2.5 px-4 text-sm outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
          />
          <p className="shrink-0 text-sm text-slate-500">
            {filtered.length} de {SOLUTIONS.length} soluções
          </p>
        </div>

        <div className="mx-auto mt-3 flex max-w-6xl gap-2 overflow-x-auto pb-1">
          {SOLUTIONS.map((s) => (
            <a
              key={s.slug}
              href={`#${s.slug}`}
              onClick={() => setActiveSlug(s.slug)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                activeSlug === s.slug
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              )}
            >
              <Icon name={s.icon} className="h-3.5 w-3.5" />
              {s.title}
            </a>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-6xl space-y-12 py-10">
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
            <div
              key={s.slug}
              id={s.slug}
              className="grid scroll-mt-36 items-center gap-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:grid-cols-2"
            >
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100">
                  <Icon name={s.icon} className="h-6 w-6" />
                </span>
                <p className="mt-5 text-lg font-medium italic text-slate-500">{s.pain}</p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {s.headline}
                </h2>
                <p className="mt-3 text-slate-600">{s.description}</p>
                <Link href="/signup" className="btn-primary mt-6">
                  Começar agora
                  <Icon name="ArrowRight" className="h-4 w-4" />
                </Link>
              </div>
              <ul className={`space-y-3 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                    <Icon name="Check" className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                    <span className="text-sm font-medium text-slate-700">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </section>
    </>
  );
}
