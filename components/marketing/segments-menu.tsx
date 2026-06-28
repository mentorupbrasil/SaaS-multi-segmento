"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import { CATEGORY_META, CATEGORY_ORDER, type SegmentCategory } from "@/segments/types";
import { getSegmentGroupsForVitrine, getFeaturedSegments, getSegmentTotal, filterSegments } from "@/lib/segment-vitrine";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

export function SegmentsMenu() {
  const groups = getSegmentGroupsForVitrine();
  const featured = getFeaturedSegments();
  const total = getSegmentTotal();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<SegmentCategory>(CATEGORY_ORDER[0]);
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

  const isSearching = query.trim().length > 0;

  const searchResults = useMemo(
    () => (isSearching ? filterSegments(query).slice(0, 14) : []),
    [isSearching, query],
  );

  const activeSegments = useMemo(() => {
    const group = groups.find((g) => g.category === activeCategory);
    return group?.segments ?? [];
  }, [groups, activeCategory]);

  const activeMeta = CATEGORY_META[activeCategory];

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
        Segmentos
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          className="absolute left-1/2 top-full z-50 mt-3 w-[min(94vw,820px)] -translate-x-1/2"
          onMouseEnter={openMenu}
          onMouseLeave={scheduleClose}
        >
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-300/30 ring-1 ring-slate-100">
            {/* Header */}
            <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    ref={searchRef}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar barbearia, restaurante, clínica..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 outline-none transition-shadow placeholder:text-slate-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
                  />
                </div>
                <span className="hidden shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200 sm:inline">
                  {total} segmentos
                </span>
              </div>
            </div>

            {/* Body */}
            {isSearching ? (
              <div className="max-h-[min(60vh,420px)] overflow-y-auto p-4">
                {searchResults.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-500">
                    Nenhum segmento encontrado para &ldquo;{query}&rdquo;.
                  </p>
                ) : (
                  <ul className="grid gap-1 sm:grid-cols-2">
                    {searchResults.map((seg) => (
                      <li key={seg.id}>
                        <Link
                          href={`/${seg.slug}`}
                          onClick={() => setOpen(false)}
                          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100/80">
                            <Icon name={seg.icon} className="h-4 w-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium text-slate-800 group-hover:text-brand-700">
                              {seg.label}
                            </span>
                            <span className="block truncate text-xs text-slate-400">
                              {CATEGORY_META[seg.category].label}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                {searchResults.length > 0 && (
                  <div className="mt-3 border-t border-slate-100 pt-3 text-center">
                    <Link
                      href={`/segmentos?q=${encodeURIComponent(query.trim())}`}
                      onClick={() => setOpen(false)}
                      className="text-sm font-semibold text-brand-700 hover:text-brand-800"
                    >
                      Ver todos os resultados
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex max-h-[min(60vh,420px)]">
                {/* Categories */}
                <nav className="w-[210px] shrink-0 overflow-y-auto border-r border-slate-100 bg-slate-50/50 p-2">
                  <ul className="space-y-0.5">
                    {groups.map((group) => {
                      const meta = CATEGORY_META[group.category];
                      const active = group.category === activeCategory;
                      return (
                        <li key={group.category}>
                          <button
                            type="button"
                            onMouseEnter={() => setActiveCategory(group.category)}
                            onFocus={() => setActiveCategory(group.category)}
                            onClick={() => setActiveCategory(group.category)}
                            className={cn(
                              "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors",
                              active
                                ? "bg-white text-brand-700 shadow-sm ring-1 ring-slate-200/80"
                                : "text-slate-600 hover:bg-white/70 hover:text-slate-900",
                            )}
                          >
                            <span
                              className={cn(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                                active
                                  ? "bg-brand-100 text-brand-700"
                                  : "bg-white text-slate-500 ring-1 ring-slate-200/60",
                              )}
                            >
                              <Icon name={meta.icon} className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-xs font-semibold leading-tight">
                                {meta.label}
                              </span>
                              <span className="text-[10px] text-slate-400">{group.segments.length}</span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                {/* Segments panel */}
                <div className="min-w-0 flex-1 overflow-y-auto p-4">
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-slate-900">{activeMeta.label}</p>
                    <p className="text-xs text-slate-500">{activeMeta.description}</p>
                  </div>
                  <ul className="grid gap-1 sm:grid-cols-2">
                    {activeSegments.map((seg) => (
                      <li key={seg.id}>
                        <Link
                          href={`/${seg.slug}`}
                          onClick={() => setOpen(false)}
                          className="group flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors hover:bg-slate-50"
                        >
                          <Icon
                            name={seg.icon}
                            className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-brand-600"
                          />
                          <span className="truncate text-sm text-slate-700 group-hover:text-brand-700">
                            {seg.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/segmentos#${activeCategory}`}
                    onClick={() => setOpen(false)}
                    className="mt-3 inline-flex text-xs font-semibold text-brand-700 hover:text-brand-800"
                  >
                    Ver todos em {activeMeta.label} →
                  </Link>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-slate-100 bg-white px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                  <span className="mr-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Populares
                  </span>
                  {featured.map((seg) => (
                    <Link
                      key={seg.id}
                      href={`/${seg.slug}`}
                      onClick={() => setOpen(false)}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
                    >
                      {seg.label}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/segmentos"
                  onClick={() => setOpen(false)}
                  className="shrink-0 text-sm font-semibold text-brand-700 hover:text-brand-800"
                >
                  Ver catálogo completo
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
