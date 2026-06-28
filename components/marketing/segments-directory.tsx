"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import type { SegmentGroup } from "@/segments";
import { CATEGORY_META, type SegmentCategory } from "@/segments/types";
import { filterSegments } from "@/lib/segment-vitrine";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

interface SegmentsDirectoryProps {
  groups: SegmentGroup[];
  total: number;
  initialQuery?: string;
}

export function SegmentsDirectory({ groups, total, initialQuery = "" }: SegmentsDirectoryProps) {
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<SegmentCategory | "all">("all");

  const isSearching = query.trim().length > 0;

  const filteredGroups = useMemo(() => {
    if (!isSearching && activeCategory === "all") return groups;

    const matches = filterSegments(
      query,
      activeCategory === "all" ? undefined : activeCategory,
    );
    const byCategory = new Map<SegmentCategory, typeof matches>();
    for (const seg of matches) {
      const list = byCategory.get(seg.category) ?? [];
      list.push(seg);
      byCategory.set(seg.category, list);
    }

    return groups
      .filter((g) => byCategory.has(g.category))
      .map((g) => ({
        ...g,
        segments: byCategory.get(g.category) ?? [],
      }));
  }, [groups, query, activeCategory, isSearching]);

  const visibleCount = filteredGroups.reduce((acc, g) => acc + g.segments.length, 0);

  return (
    <>
      <div className="sticky top-16 z-40 -mx-4 border-b border-slate-200/80 bg-white/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar segmento..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <p className="shrink-0 text-sm text-slate-500">
            {visibleCount} de {total} segmentos
          </p>
        </div>

        <div className="mx-auto mt-3 flex max-w-6xl gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
              activeCategory === "all"
                ? "bg-brand-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200",
            )}
          >
            Todos
          </button>
          {groups.map((group) => {
            const meta = CATEGORY_META[group.category];
            return (
              <button
                key={group.category}
                type="button"
                onClick={() => setActiveCategory(group.category)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  activeCategory === group.category
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                )}
              >
                <Icon name={meta.icon} className="h-3.5 w-3.5" />
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-12 py-10">
        {filteredGroups.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <p className="text-slate-600">Nenhum segmento encontrado.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveCategory("all");
              }}
              className="mt-3 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          filteredGroups.map((group) => {
            const meta = CATEGORY_META[group.category];
            return (
              <section key={group.category} id={group.category} className="scroll-mt-36">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100">
                    <Icon name={meta.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">{group.label}</h2>
                    <p className="text-sm text-slate-500">{meta.description}</p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.segments.map((seg) => (
                    <Link
                      key={seg.id}
                      href={`/${seg.slug}`}
                      className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100">
                        <Icon name={seg.icon} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-1 font-semibold text-slate-900">
                          {seg.label}
                          <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                        </span>
                        <span className="mt-0.5 block text-sm text-slate-500">{seg.tagline}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
    </>
  );
}
