"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import { getFeaturedSegments, getSegmentTotal, filterSegments } from "@/lib/segment-vitrine";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

export function SegmentsMenu() {
  const featured = getFeaturedSegments();
  const total = getSegmentTotal();

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
    () => (isSearching ? filterSegments(query).slice(0, 6) : []),
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
        Segmentos
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-2 w-[420px] max-w-[calc(100vw-1.5rem)]"
          onMouseEnter={openMenu}
          onMouseLeave={scheduleClose}
        >
          <div className="rounded-xl border border-slate-200/80 bg-white shadow-xl shadow-slate-300/20 ring-1 ring-slate-100">
            <div className="p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="segments-menu-search"
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar segmento…"
                  aria-label="Buscar segmento"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-brand-300 focus:bg-white focus:ring-2 focus:ring-brand-100"
                />
              </div>

              {isSearching ? (
                <>
                  {searchResults.length === 0 ? (
                    <p className="py-5 text-center text-xs text-slate-500">
                      Nada para &ldquo;{query}&rdquo;.{" "}
                      <Link
                        href={`/segmentos?q=${encodeURIComponent(query.trim())}`}
                        onClick={close}
                        className="font-semibold text-brand-700"
                      >
                        Ver catálogo
                      </Link>
                    </p>
                  ) : (
                    <ul className="mt-2 space-y-0.5">
                      {searchResults.map((seg) => (
                        <li key={seg.id}>
                          <Link
                            href={`/${seg.slug}`}
                            onClick={close}
                            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-slate-50"
                          >
                            <Icon name={seg.icon} className="h-4 w-4 shrink-0 text-brand-600" />
                            <span className="truncate font-medium text-slate-800">{seg.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <>
                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Populares
                  </p>
                  <ul className="mt-1.5 space-y-0.5">
                    {featured.map((seg) => (
                      <li key={seg.id}>
                        <Link
                          href={`/${seg.slug}`}
                          onClick={close}
                          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-slate-50"
                        >
                          <Icon name={seg.icon} className="h-4 w-4 shrink-0 text-brand-600" />
                          <span className="truncate font-medium text-slate-800">{seg.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="border-t border-slate-100 px-3 py-2">
              <Link
                href={isSearching ? `/segmentos?q=${encodeURIComponent(query.trim())}` : "/segmentos"}
                onClick={close}
                className="block text-center text-xs font-semibold text-brand-700 hover:text-brand-800"
              >
                Ver todos os {total} segmentos →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
