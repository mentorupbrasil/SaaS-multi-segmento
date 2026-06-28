"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, Search, Star } from "lucide-react";
import { CATEGORY_META, type SegmentCategory } from "@/segments/types";
import {
  getSegmentGroupsForVitrine,
  getFeaturedSegments,
  getSegmentTotal,
  filterSegments,
  MENU_SEGMENT_PREVIEW_LIMIT,
} from "@/lib/segment-vitrine";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

type MenuView = "home" | "category";

export function SegmentsMenu() {
  const groups = getSegmentGroupsForVitrine();
  const featured = getFeaturedSegments();
  const total = getSegmentTotal();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<MenuView>("home");
  const [activeCategory, setActiveCategory] = useState<SegmentCategory | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const resetMenu = () => {
    setQuery("");
    setView("home");
    setActiveCategory(null);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      resetMenu();
    }, 150);
  };

  const close = () => {
    setOpen(false);
    resetMenu();
  };

  const isSearching = query.trim().length > 0;

  const searchResults = useMemo(
    () => (isSearching ? filterSegments(query).slice(0, 8) : []),
    [isSearching, query],
  );

  const activeGroup = groups.find((g) => g.category === activeCategory);
  const activeMeta = activeCategory ? CATEGORY_META[activeCategory] : null;
  const previewSegments = activeGroup?.segments.slice(0, MENU_SEGMENT_PREVIEW_LIMIT) ?? [];
  const hiddenCount = (activeGroup?.segments.length ?? 0) - previewSegments.length;

  const openCategory = (category: SegmentCategory) => {
    setActiveCategory(category);
    setView("category");
    setQuery("");
  };

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
          className="absolute left-0 top-full z-50 mt-2 w-[600px] max-w-[calc(100vw-1.5rem)]"
          onMouseEnter={openMenu}
          onMouseLeave={scheduleClose}
        >
          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-300/25 ring-1 ring-slate-100">
            {/* Busca em destaque */}
            <div className="border-b border-slate-100 px-4 pb-4 pt-4">
              <label htmlFor="segments-menu-search" className="block text-sm font-semibold text-slate-900">
                Encontre o segmento do seu negócio
              </label>
              <p className="mt-0.5 text-xs text-slate-500">
                Digite barbearia, restaurante, clínica… · {total} opções
              </p>
              <div className="relative mt-3">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="segments-menu-search"
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (e.target.value.trim()) {
                      setView("home");
                      setActiveCategory(null);
                    }
                  }}
                  placeholder="Ex.: pizzaria, pet shop, escola de idiomas"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-brand-300 focus:bg-white focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>

            <div className="p-4">
              {isSearching ? (
                /* Resultados da busca */
                <>
                  {searchResults.length === 0 ? (
                    <p className="py-4 text-center text-sm text-slate-500">
                      Nenhum segmento para &ldquo;{query}&rdquo;. Tente outro termo ou veja o catálogo.
                    </p>
                  ) : (
                    <ul className="grid grid-cols-2 gap-1">
                      {searchResults.map((seg) => (
                        <li key={seg.id}>
                          <Link
                            href={`/${seg.slug}`}
                            onClick={close}
                            className="group flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-slate-50"
                          >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                              <Icon name={seg.icon} className="h-4 w-4" />
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-xs font-medium text-slate-800 group-hover:text-brand-700">
                                {seg.label}
                              </span>
                              <span className="block truncate text-[10px] text-slate-400">
                                {CATEGORY_META[seg.category].label}
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-3 text-center">
                    <Link
                      href={`/segmentos?q=${encodeURIComponent(query.trim())}`}
                      onClick={close}
                      className="text-xs font-semibold text-brand-700 hover:text-brand-800"
                    >
                      Ver todos no catálogo →
                    </Link>
                  </p>
                </>
              ) : view === "category" && activeGroup && activeMeta ? (
                /* Detalhe da categoria */
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setView("home");
                      setActiveCategory(null);
                    }}
                    className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-brand-700"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Todas as categorias
                  </button>
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100">
                      <Icon name={activeMeta.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{activeMeta.label}</h3>
                      <p className="mt-0.5 text-xs text-slate-500">{activeMeta.description}</p>
                      <p className="mt-1 text-[11px] font-medium text-brand-600">
                        {activeGroup.segments.length} segmentos nesta área
                      </p>
                    </div>
                  </div>
                  <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1">
                    {previewSegments.map((seg) => (
                      <li key={seg.id}>
                        <Link
                          href={`/${seg.slug}`}
                          onClick={close}
                          className="group flex items-center gap-1.5 rounded-md py-1 transition-colors"
                        >
                          <Icon
                            name={seg.icon}
                            className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-brand-600"
                          />
                          <span className="truncate text-xs text-slate-700 group-hover:text-brand-700">
                            {seg.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/segmentos#${activeCategory}`}
                    onClick={close}
                    className="mt-3 inline-flex text-xs font-semibold text-brand-700 hover:text-brand-800"
                  >
                    {hiddenCount > 0
                      ? `Ver mais ${hiddenCount} em ${activeMeta.label} →`
                      : `Ver categoria completa →`}
                  </Link>
                </>
              ) : (
                /* Home: populares + categorias */
                <>
                  <div className="mb-1 flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <p className="text-xs font-semibold text-slate-800">Mais escolhidos</p>
                  </div>
                  <p className="mb-2 text-[11px] text-slate-500">
                    Os segmentos mais usados — clique e comece direto.
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {featured.map((seg) => (
                      <Link
                        key={seg.id}
                        href={`/${seg.slug}`}
                        onClick={close}
                        className="group flex flex-col items-center rounded-xl border border-slate-200/80 bg-white px-2 py-2.5 text-center transition-all hover:border-brand-200 hover:shadow-sm"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100/80">
                          <Icon name={seg.icon} className="h-4 w-4" />
                        </span>
                        <span className="mt-1.5 line-clamp-2 text-[11px] font-medium leading-tight text-slate-700 group-hover:text-brand-700">
                          {seg.label}
                        </span>
                      </Link>
                    ))}
                  </div>

                  <div className="my-4 border-t border-slate-100" />

                  <p className="text-xs font-semibold text-slate-800">Ou navegue por categoria</p>
                  <p className="mt-0.5 mb-2 text-[11px] text-slate-500">
                    Escolha a área que mais se aproxima do seu ramo.
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {groups.map((group) => {
                      const meta = CATEGORY_META[group.category];
                      return (
                        <button
                          key={group.category}
                          type="button"
                          onClick={() => openCategory(group.category)}
                          className="group rounded-xl border border-slate-200/80 p-2.5 text-left transition-all hover:border-brand-200 hover:bg-brand-50/30"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500 ring-1 ring-slate-100 group-hover:bg-white group-hover:text-brand-600">
                            <Icon name={meta.icon} className="h-4 w-4" />
                          </span>
                          <p className="mt-2 text-[11px] font-semibold leading-tight text-slate-800 group-hover:text-brand-700">
                            {meta.label}
                          </p>
                          <p className="mt-0.5 text-[10px] text-slate-400">{group.segments.length} segmentos</p>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-slate-100 px-4 py-2.5 text-center">
              <Link
                href="/segmentos"
                onClick={close}
                className="text-xs font-semibold text-brand-700 hover:text-brand-800"
              >
                Ver catálogo completo ({total} segmentos) →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
