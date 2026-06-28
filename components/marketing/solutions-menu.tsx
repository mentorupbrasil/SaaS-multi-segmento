"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Search } from "lucide-react";
import { filterSolutions, getSolutions, getSolutionTotal } from "@/lib/solution-vitrine";
import type { Solution } from "@/lib/solutions";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

function SolutionPreview({ solution, onNavigate }: { solution: Solution; onNavigate: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100">
          <Icon name={solution.icon} className="h-5 w-5" />
        </span>
        <p className="mt-4 text-sm italic leading-relaxed text-slate-500">{solution.pain}</p>
        <h3 className="mt-2 text-base font-bold leading-snug text-slate-900">{solution.headline}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{solution.description}</p>
      </div>

      <ul className="mb-4 space-y-2">
        {solution.bullets.slice(0, 3).map((bullet) => (
          <li key={bullet} className="flex items-start gap-2 text-sm text-slate-700">
            <Icon name="Check" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <Link
        href={`/solucoes#${solution.slug}`}
        onClick={onNavigate}
        className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
      >
        Ver solução completa
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export function SolutionsMenu() {
  const solutions = getSolutions();
  const total = getSolutionTotal();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeSlug, setActiveSlug] = useState(solutions[0]?.slug ?? "");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setQuery("");
    }, 150);
  };

  const close = () => setOpen(false);

  const filtered = useMemo(() => filterSolutions(query), [query]);
  const isSearching = query.trim().length > 0;

  const activeSolution = useMemo(() => {
    if (isSearching) return filtered[0];
    return solutions.find((s) => s.slug === activeSlug) ?? solutions[0];
  }, [isSearching, filtered, activeSlug, solutions]);

  return (
    <div className="relative" onMouseEnter={openMenu} onMouseLeave={scheduleClose}>
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (!open) setTimeout(() => searchRef.current?.focus(), 50);
        }}
        aria-expanded={open}
        className={cn(
          "flex items-center gap-1 transition-colors hover:text-slate-900",
          open && "text-slate-900",
        )}
      >
        Soluções
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          className="absolute left-1/2 top-full z-50 mt-3 w-[min(94vw,720px)] -translate-x-1/2"
          onMouseEnter={openMenu}
          onMouseLeave={scheduleClose}
        >
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-300/30 ring-1 ring-slate-100">
            {/* Header */}
            <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3">
              <div className="mb-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Soluções
                </p>
                <p className="text-sm text-slate-600">Problemas reais do seu negócio, resolvidos.</p>
              </div>
              <div className="relative mt-2">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar financeiro, clientes, vendas..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>

            {/* Body */}
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                Nenhuma solução encontrada para &ldquo;{query}&rdquo;.
              </div>
            ) : (
              <div className="flex">
                <nav className="w-[200px] shrink-0 border-r border-slate-100 bg-slate-50/50 p-2">
                  <ul className="space-y-0.5">
                    {filtered.map((solution) => {
                      const active = !isSearching && solution.slug === activeSlug;
                      const highlighted = isSearching && solution.slug === activeSolution?.slug;
                      return (
                        <li key={solution.slug}>
                          <button
                            type="button"
                            onMouseEnter={() => !isSearching && setActiveSlug(solution.slug)}
                            onFocus={() => !isSearching && setActiveSlug(solution.slug)}
                            onClick={() => setActiveSlug(solution.slug)}
                            className={cn(
                              "flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition-colors",
                              active || highlighted
                                ? "bg-white text-brand-700 shadow-sm ring-1 ring-slate-200/80"
                                : "text-slate-600 hover:bg-white/70 hover:text-slate-900",
                            )}
                          >
                            <span
                              className={cn(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                                active || highlighted
                                  ? "bg-brand-100 text-brand-700"
                                  : "bg-white text-slate-500 ring-1 ring-slate-200/60",
                              )}
                            >
                              <Icon name={solution.icon} className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-xs font-semibold leading-tight">
                                {solution.title}
                              </span>
                              <span className="mt-0.5 block line-clamp-2 text-[10px] leading-snug text-slate-400">
                                {solution.headline}
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                {/* Preview */}
                <div className="min-w-0 flex-1 p-5">
                  {activeSolution && (
                    <SolutionPreview solution={activeSolution} onNavigate={close} />
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-white px-4 py-3">
              <p className="text-xs text-slate-500">
                {total} soluções para organizar, vender e crescer.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/solucoes"
                  onClick={close}
                  className="text-sm font-semibold text-brand-700 hover:text-brand-800"
                >
                  Ver todas
                </Link>
                <Link href="/signup" onClick={close} className="btn-primary py-2 text-sm">
                  Começar grátis
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
