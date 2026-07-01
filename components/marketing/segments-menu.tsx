"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { getFeaturedSegments, getSegmentTotal, filterSegments } from "@/lib/segment-vitrine";
import { Icon } from "@/components/icon";
import { HoveredLink, ProductItem } from "@/components/ui/navbar-menu";
import { Input } from "@/components/ui/input";

const FEATURED_IMAGES: Record<string, string> = {
  barbearia: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=280&h=140",
  clinica: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=280&h=140",
  restaurante: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=280&h=140",
};

export function SegmentsMenuPanel({ onClose }: { onClose?: () => void }) {
  const featured = getFeaturedSegments();
  const total = getSegmentTotal();
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const isSearching = query.trim().length > 0;
  const searchResults = useMemo(
    () => (isSearching ? filterSegments(query).slice(0, 6) : []),
    [isSearching, query],
  );

  const spotlight = featured.slice(0, 2);

  return (
    <div className="w-[min(420px,calc(100vw-2rem))] p-3">
      {!isSearching && (
        <div className="mb-3 grid gap-2 sm:grid-cols-2">
          {spotlight.map((seg) => (
            <ProductItem
              key={seg.id}
              title={seg.label}
              description={seg.tagline}
              href={`/${seg.slug}`}
              src={FEATURED_IMAGES[seg.id] ?? FEATURED_IMAGES.barbearia}
              onNavigate={onClose}
            />
          ))}
        </div>
      )}

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={searchRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar segmento…"
          aria-label="Buscar segmento"
          className="pl-9"
        />
      </div>

      {isSearching ? (
        searchResults.length === 0 ? (
          <p className="py-5 text-center text-xs text-muted-foreground">
            Nada para &ldquo;{query}&rdquo;.{" "}
            <Link
              href={`/segmentos?q=${encodeURIComponent(query.trim())}`}
              onClick={onClose}
              className="font-semibold text-primary hover:underline"
            >
              Ver catálogo
            </Link>
          </p>
        ) : (
          <ul className="mt-2 space-y-0.5">
            {searchResults.map((seg) => (
              <li key={seg.id}>
                <HoveredLink href={`/${seg.slug}`} onClick={onClose} className="flex items-center gap-2">
                  <Icon name={seg.icon} className="h-4 w-4 shrink-0 text-primary" />
                  <span className="truncate font-medium">{seg.label}</span>
                </HoveredLink>
              </li>
            ))}
          </ul>
        )
      ) : (
        <>
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Populares</p>
          <ul className="mt-1.5 space-y-0.5">
            {featured.map((seg) => (
              <li key={seg.id}>
                <HoveredLink href={`/${seg.slug}`} onClick={onClose} className="flex items-center gap-2">
                  <Icon name={seg.icon} className="h-4 w-4 shrink-0 text-primary" />
                  <span className="truncate font-medium">{seg.label}</span>
                </HoveredLink>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-3 border-t border-border pt-2">
        <Link
          href={isSearching ? `/segmentos?q=${encodeURIComponent(query.trim())}` : "/segmentos"}
          onClick={onClose}
          className="block text-center text-xs font-semibold text-primary hover:underline"
        >
          Ver todos os {total} segmentos →
        </Link>
      </div>
    </div>
  );
}