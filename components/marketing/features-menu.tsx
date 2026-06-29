"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import {
  filterFeatures,
  getFeatureGroups,
  getFeatureTotal,
  FEATURE_GROUP_ICONS,
} from "@/lib/feature-vitrine";
import type { FeatureItem } from "@/lib/features";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

const GROUP_SHORT: Record<string, string> = {
  gestao: "Gestão",
  operacao: "Operação",
  tecnologia: "Tecnologia",
};
  if (!item.planGated) return null;
  return (
    <span className="rounded bg-brand-100 px-1 py-px text-[8px] font-bold uppercase text-brand-700">
      Pro+
    </span>
  );
}

function FeatureRow({ item, onClose }: { item: FeatureItem; onClose: () => void }) {
  return (
    <Link
      href={`/funcionalidades#${item.id}`}
      onClick={onClose}
      className="flex items-center gap-2 rounded-md px-1.5 py-1 text-sm hover:bg-slate-50"
    >
      <Icon name={item.icon} className="h-3.5 w-3.5 shrink-0 text-slate-400" />
      <span className="min-w-0 truncate font-medium text-slate-800">{item.name}</span>
      <FeatureBadge item={item} />
    </Link>
  );
}

export function FeaturesMenu() {
  const groups = getFeatureGroups();
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

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  const isSearching = query.trim().length > 0;
  const searchResults = useMemo(
    () => (isSearching ? filterFeatures(query).slice(0, 6) : []),
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
          className="absolute left-0 top-full z-50 mt-2 w-[480px] max-w-[calc(100vw-1.5rem)]"
          onMouseEnter={openMenu}
          onMouseLeave={scheduleClose}
        >
          <div className="rounded-xl border border-slate-200/80 bg-white shadow-xl shadow-slate-300/20 ring-1 ring-slate-100">
            <div className="p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="features-menu-search"
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar funcionalidade…"
                  aria-label="Buscar funcionalidade"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-brand-300 focus:bg-white focus:ring-2 focus:ring-brand-100"
                />
              </div>

              {isSearching ? (
                searchResults.length === 0 ? (
                  <p className="py-5 text-center text-xs text-slate-500">
                    Nada para &ldquo;{query}&rdquo;.{" "}
                    <Link
                      href={`/funcionalidades?q=${encodeURIComponent(query.trim())}`}
                      onClick={close}
                      className="font-semibold text-brand-700"
                    >
                      Ver catálogo
                    </Link>
                  </p>
                ) : (
                  <ul className="mt-2 space-y-0.5">
                    {searchResults.map((item) => (
                      <li key={item.id}>
                        <FeatureRow item={item} onClose={close} />
                      </li>
                    ))}
                  </ul>
                )
              ) : (
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {groups.map((group) => (
                    <div key={group.id}>
                      <p className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        <Icon
                          name={FEATURE_GROUP_ICONS[group.id] ?? "Layers"}
                          className="h-3 w-3"
                        />
                        <span className="truncate">{GROUP_SHORT[group.id] ?? group.label}</span>
                      </p>
                      <ul className="space-y-0.5">
                        {group.items.map((item) => (
                          <li key={item.id}>
                            <FeatureRow item={item} onClose={close} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 px-3 py-2">
              <Link
                href={
                  isSearching
                    ? `/funcionalidades?q=${encodeURIComponent(query.trim())}`
                    : "/funcionalidades"
                }
                onClick={close}
                className="block text-center text-xs font-semibold text-brand-700 hover:text-brand-800"
              >
                Ver todas as {total} funcionalidades →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
