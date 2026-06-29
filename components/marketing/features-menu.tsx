"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Search } from "lucide-react";
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
  if (item.planGated) {
    return (
      <span className="shrink-0 rounded-full bg-brand-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-brand-700">
        Pro+
      </span>
    );
  }
  return null;
}

function FeatureLink({ item, onClose }: { item: FeatureItem; onClose: () => void }) {
  return (
    <Link
      href={`/funcionalidades#${item.id}`}
      onClick={onClose}
      className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-white"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-200/80 transition-all group-hover:bg-brand-50 group-hover:text-brand-600 group-hover:ring-brand-200">
        <Icon name={item.icon} className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-1.5">
          <span className="text-sm font-semibold text-slate-800 group-hover:text-brand-700">
            {item.name}
          </span>
          <FeatureBadge item={item} />
        </span>
        <span className="mt-0.5 block text-xs font-medium text-slate-600">{item.short}</span>
        <span className="mt-1 block line-clamp-2 text-[11px] leading-snug text-slate-400">
          {item.description}
        </span>
      </span>
      <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-slate-300 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-brand-600 group-hover:opacity-100" />
    </Link>
  );
}

export function FeaturesMenu() {
  const groups = getFeatureGroups();
  const featured = getFeaturedFeatures();
  const total = getFeatureTotal();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
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
  const isSearching = query.trim().length > 0;

  const searchResults = useMemo(
    () => (isSearching ? filterFeatures(query).slice(0, 10) : []),
    [isSearching, query],
  );

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
          className="absolute left-0 top-full z-50 mt-2 w-[820px] max-w-[calc(100vw-1.5rem)]"
          onMouseEnter={openMenu}
          onMouseLeave={scheduleClose}
        >
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-300/25 ring-1 ring-slate-100">
            <div className="border-b border-slate-100 bg-slate-50/50 px-5 pb-4 pt-4">
              <label htmlFor="features-menu-search" className="block text-sm font-semibold text-slate-900">
                Encontre a funcionalidade que precisa
              </label>
              <p className="mt-0.5 text-xs text-slate-500">
                Clientes, agenda, financeiro, PDV, automações, portal… · {total} recursos no catálogo
              </p>
              <div className="relative mt-3">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="features-menu-search"
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ex.: comissões, estoque, WhatsApp, ordens de serviço"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>

            {isSearching ? (
              <div className="p-5">
                {searchResults.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-500">
                    Nenhum resultado para &ldquo;{query}&rdquo;.
                  </p>
                ) : (
                  <ul className="grid gap-1 sm:grid-cols-2">
                    {searchResults.map((item) => (
                      <li key={item.id}>
                        <FeatureLink item={item} onClose={close} />
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-4 border-t border-slate-100 pt-4 text-center">
                  <Link
                    href={`/funcionalidades?q=${encodeURIComponent(query.trim())}`}
                    onClick={close}
                    className="text-sm font-semibold text-brand-700 hover:text-brand-800"
                  >
                    Ver todos na página de funcionalidades →
                  </Link>
                </p>
              </div>
            ) : (
              <div className="grid divide-x divide-slate-100 sm:grid-cols-3">
                {groups.map((group) => (
                  <div key={group.id} className="bg-slate-50/30 p-4">
                    <div className="mb-3 flex items-start gap-2.5 px-1">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100">
                        <Icon name={FEATURE_GROUP_ICONS[group.id] ?? "Layers"} className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{group.label}</p>
                        <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{group.description}</p>
                        <p className="mt-1 text-[10px] font-medium text-brand-600">
                          {group.items.length} recursos
                        </p>
                      </div>
                    </div>
                    <ul className="space-y-0.5">
                      {group.items.map((item) => (
                        <li key={item.id}>
                          <FeatureLink item={item} onClose={close} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-slate-100 bg-white px-5 py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Destaques
                  </span>
                  {featured.map((item) => (
                    <Link
                      key={item.id}
                      href={`/funcionalidades#${item.id}`}
                      onClick={close}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/funcionalidades"
                  onClick={close}
                  className="shrink-0 text-xs font-semibold text-brand-700 hover:text-brand-800"
                >
                  Ver catálogo completo ({total}) →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
