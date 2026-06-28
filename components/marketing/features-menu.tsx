"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import {
  filterFeatures,
  getFeaturedFeatures,
  getFeatureGroups,
  getFeatureTotal,
  FEATURE_GROUP_ICONS,
} from "@/lib/feature-vitrine";
import type { FeatureItem } from "@/lib/features";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

function FeatureBadge({ item }: { item: FeatureItem }) {
  if (item.status === "soon") {
    return (
      <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-700">
        Em breve
      </span>
    );
  }
  if (item.planGated) {
    return (
      <span className="shrink-0 rounded bg-brand-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-brand-700">
        Pro+
      </span>
    );
  }
  return null;
}

export function FeaturesMenu() {
  const groups = getFeatureGroups();
  const featured = getFeaturedFeatures();
  const total = getFeatureTotal();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeGroupId, setActiveGroupId] = useState(groups[0]?.id ?? "gestao");
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
    () => (isSearching ? filterFeatures(query).slice(0, 10) : []),
    [isSearching, query],
  );

  const activeGroup = groups.find((g) => g.id === activeGroupId) ?? groups[0];
  const activeItems = activeGroup?.items ?? [];

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
        Funcionalidades
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          className="absolute left-1/2 top-full z-50 mt-3 w-[min(94vw,780px)] -translate-x-1/2"
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
                    placeholder="Buscar agenda, financeiro, PDV..."
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 outline-none transition-shadow placeholder:text-slate-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
                  />
                </div>
                <span className="hidden shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200 sm:inline">
                  {total} recursos
                </span>
              </div>
            </div>

            {/* Body */}
            {isSearching ? (
              <div className="max-h-[min(56vh,380px)] overflow-y-auto p-4">
                {searchResults.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-500">
                    Nenhuma funcionalidade encontrada para &ldquo;{query}&rdquo;.
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {searchResults.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={`/funcionalidades#${item.id}`}
                          onClick={() => setOpen(false)}
                          className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100/80">
                            <Icon name={item.icon} className="h-4 w-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-medium text-slate-800 group-hover:text-brand-700">
                                {item.name}
                              </span>
                              <FeatureBadge item={item} />
                            </span>
                            <span className="block text-xs text-slate-400">{item.short}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                {searchResults.length > 0 && (
                  <div className="mt-3 border-t border-slate-100 pt-3 text-center">
                    <Link
                      href={`/funcionalidades?q=${encodeURIComponent(query.trim())}`}
                      onClick={() => setOpen(false)}
                      className="text-sm font-semibold text-brand-700 hover:text-brand-800"
                    >
                      Ver na página de funcionalidades
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex max-h-[min(56vh,380px)]">
                {/* Groups */}
                <nav className="w-[200px] shrink-0 overflow-y-auto border-r border-slate-100 bg-slate-50/50 p-2">
                  <ul className="space-y-0.5">
                    {groups.map((group) => {
                      const active = group.id === activeGroupId;
                      const icon = FEATURE_GROUP_ICONS[group.id] ?? "Layers";
                      return (
                        <li key={group.id}>
                          <button
                            type="button"
                            onMouseEnter={() => setActiveGroupId(group.id)}
                            onFocus={() => setActiveGroupId(group.id)}
                            onClick={() => setActiveGroupId(group.id)}
                            className={cn(
                              "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition-colors",
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
                              <Icon name={icon} className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-xs font-semibold leading-tight">
                                {group.label}
                              </span>
                              <span className="text-[10px] text-slate-400">{group.items.length} recursos</span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                {/* Features panel */}
                <div className="min-w-0 flex-1 overflow-y-auto p-4">
                  {activeGroup && (
                    <>
                      <div className="mb-3">
                        <p className="text-sm font-semibold text-slate-900">{activeGroup.label}</p>
                        <p className="text-xs text-slate-500">{activeGroup.description}</p>
                      </div>
                      <ul className="space-y-1">
                        {activeItems.map((item) => (
                          <li key={item.id}>
                            <Link
                              href={`/funcionalidades#${item.id}`}
                              onClick={() => setOpen(false)}
                              className="group flex items-start gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-slate-50"
                            >
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100/80">
                                <Icon name={item.icon} className="h-4 w-4" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="flex flex-wrap items-center gap-2">
                                  <span className="text-sm font-medium text-slate-800 group-hover:text-brand-700">
                                    {item.name}
                                  </span>
                                  <FeatureBadge item={item} />
                                </span>
                                <span className="mt-0.5 block text-xs leading-snug text-slate-500">
                                  {item.short}
                                </span>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={`/funcionalidades#${activeGroup.id}`}
                        onClick={() => setOpen(false)}
                        className="mt-3 inline-flex text-xs font-semibold text-brand-700 hover:text-brand-800"
                      >
                        Ver seção completa →
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-slate-100 bg-white px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                  <span className="mr-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Destaques
                  </span>
                  {featured.map((item) => (
                    <Link
                      key={item.id}
                      href={`/funcionalidades#${item.id}`}
                      onClick={() => setOpen(false)}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/funcionalidades"
                  onClick={() => setOpen(false)}
                  className="shrink-0 text-sm font-semibold text-brand-700 hover:text-brand-800"
                >
                  Ver todas
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
