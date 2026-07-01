"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { filterSolutions, getSolutions, getSolutionTotal } from "@/lib/solution-vitrine";
import type { Solution } from "@/lib/solutions";
import { Icon } from "@/components/icon";
import { HoveredLink } from "@/components/ui/navbar-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function SolutionPreview({ solution, onNavigate }: { solution: Solution; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
          <Icon name={solution.icon} className="h-5 w-5" />
        </span>
        <p className="mt-4 text-sm italic leading-relaxed text-muted-foreground">{solution.pain}</p>
        <h3 className="mt-2 text-base font-bold leading-snug text-foreground">{solution.headline}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{solution.description}</p>
      </div>
      <ul className="mb-4 space-y-2">
        {solution.bullets.slice(0, 3).map((bullet) => (
          <li key={bullet} className="flex items-start gap-2 text-sm text-foreground/90">
            <Icon name="Check" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      <Link
        href={`/solucoes#${solution.slug}`}
        onClick={onNavigate}
        className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
      >
        Ver solução completa
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export function SolutionsMenuPanel({ onClose }: { onClose?: () => void }) {
  const solutions = getSolutions();
  const total = getSolutionTotal();
  const [query, setQuery] = useState("");
  const [activeSlug, setActiveSlug] = useState(solutions[0]?.slug ?? "");
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => filterSolutions(query), [query]);
  const isSearching = query.trim().length > 0;

  const activeSolution = useMemo(() => {
    if (isSearching) return filtered[0];
    return solutions.find((s) => s.slug === activeSlug) ?? solutions[0];
  }, [isSearching, filtered, activeSlug, solutions]);

  return (
    <div className="w-[min(600px,calc(100vw-2rem))]">
      <div className="border-b border-border px-4 pb-4 pt-4">
        <p className="text-sm font-semibold text-foreground">Qual problema você quer resolver?</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Financeiro, clientes, vendas… · {total} soluções</p>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={searchRef}
            id="solutions-menu-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex.: fluxo de caixa, faltas na agenda"
            className="pl-10"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-8 text-center text-sm text-muted-foreground">
          Nenhuma solução encontrada para &ldquo;{query}&rdquo;.
        </div>
      ) : (
        <div className="flex">
          <nav className="w-[168px] shrink-0 border-r border-border bg-muted/20 p-2">
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
                          ? "bg-card text-primary shadow-sm ring-1 ring-border"
                          : "text-muted-foreground hover:bg-card/70 hover:text-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                          active || highlighted ? "bg-primary/10 text-primary" : "bg-card text-muted-foreground ring-1 ring-border",
                        )}
                      >
                        <Icon name={solution.icon} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-semibold leading-tight">{solution.title}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="min-w-0 flex-1 p-5">
            {activeSolution && <SolutionPreview solution={activeSolution} onNavigate={onClose} />}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
        <p className="text-xs text-muted-foreground">{total} soluções para organizar, vender e crescer.</p>
        <div className="flex flex-wrap items-center gap-3">
          <HoveredLink href="/solucoes" onClick={onClose} className="inline text-sm font-semibold text-primary">
            Ver todas
          </HoveredLink>
          <Button asChild size="sm">
            <Link href="/signup" onClick={onClose}>
              Assinar agora
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
