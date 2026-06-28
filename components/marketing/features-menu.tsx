"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import {
  filterFeatures,
  getFeaturedFeatures,
  getFeatureGroups,
  getFeatureTotal,
} from "@/lib/feature-vitrine";
import type { FeatureItem } from "@/lib/features";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

function FeatureBadge({ item }: { item: FeatureItem }) {
  if (item.status === "soon") {
    return (
      <span className="shrink-0 rounded bg-amber-100 px-1 py-0.5 text-[9px] font-semibold uppercase text-amber-700">
        Em breve
      </span>
    );
  }
  if (item.planGated) {
    return (
      <span className="shrink-0 rounded bg-brand-100 px-1 py-0.5 text-[9px] font-semibold uppercase text-brand-700">
        Pro+
      </span>
    );
  }
  return null;
}

function FeatureLink({
  item,
  onClose,
  compact = false,
}: {
  item: FeatureItem;
  onClose: () => void;
  compact?: boolean;
}) {
  return (
    <Link
      href={`/funcionalidades#${item.id}`}
      onClick={onClose}
      className={cn(
        "group flex items-start gap-2 rounded-lg transition-colors hover:bg-slate-50",
        compact ? "px-2 py-1.5" : "gap-3 px-3 py-2",
      )}
    >
      <Icon
        name={item.icon}
        className={cn(
          "shrink-0 text-slate-400 group-hover:text-brand-600",
          compact ? "mt-0.5 h-3.5 w-3.5" : "mt-0.5 h-4 w-4",
        )}
      />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-1.5">
          <span
            className={cn(
              "font-medium text-slate-800 group-hover:text-brand-700",
              compact ? "text-xs" : "text-sm",
            )}
          >
            {item.name}
          </span>
          <FeatureBadge item={item} />
        </span>
        {!compact && (
          <span className="mt-0.5 block text-xs leading-snug text-slate-500">{item.short}</span>
        )}
      </span>
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
    () => (isSearching ? filterFeatures(query).slice(0, 8) : []),
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
          className="absolute left-1/2 top-full z-50 mt-3 w-[min(94vw,760px)] -translate-x-1/2"
          onMouseEnter={openMenu}
          onMouseLeave={scheduleClose}
        >
          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-300/30 ring-1 ring-slate-100">
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
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
                  />
                </div>
                <span className="hidden shrink-0 text-xs text-slate-500 sm:inline">{total} recursos</span>
              </div>
            </div>

            {isSearching ? (
              <div className="p-4">
                {searchResults.length === 0 ? (
                  <p className="py-6 text-center text-sm text-slate-500">
                    Nenhum resultado para &ldquo;{query}&rdquo;.
                  </p>
                ) : (
                  <ul className="grid gap-0.5 sm:grid-cols-2">
                    {searchResults.map((item) => (
                      <li key={item.id}>
                        <FeatureLink item={item} onClose={close} />
                      </li>
                    ))}
                  </ul>
                )}
                {searchResults.length > 0 && (
                  <p className="mt-3 text-center">
                    <Link
                      href={`/funcionalidades?q=${encodeURIComponent(query.trim())}`}
                      onClick={close}
                      className="text-sm font-semibold text-brand-700 hover:text-brand-800"
                    >
                      Ver todos na página de funcionalidades
                    </Link>
                  </p>
                )}
              </div>
            ) : (
              /* Três colunas — tudo visível, sem scroll (padrão mega-menu) */
              <div className="grid gap-0 divide-x divide-slate-100 sm:grid-cols-3">
                {groups.map((group) => (
                  <div key={group.id} className="p-4">
                    <p className="text-xs font-semibold text-slate-900">{group.label}</p>
                    <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-slate-400">
                      {group.description}
                    </p>
                    <ul className="mt-3 space-y-0.5">
                      {group.items.map((item) => (
                        <li key={item.id}>
                          <FeatureLink item={item} onClose={close} compact />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-2.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Destaques
                </span>
                {featured.map((item) => (
                  <Link
                    key={item.id}
                    href={`/funcionalidades#${item.id}`}
                    onClick={close}
                    className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-700"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <Link
                href="/funcionalidades"
                onClick={close}
                className="text-xs font-semibold text-brand-700 hover:text-brand-800"
              >
                Ver todas
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
