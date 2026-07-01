"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import {
  filterSegments,
  getFeaturedSegments,
  getMenuSegmentGroups,
  getSegmentTotal,
  SEGMENT_CATEGORY_ICONS,
} from "@/lib/segment-vitrine";
import type { SegmentTemplate } from "@/segments/types";
import { Icon } from "@/components/icon";
import { HoveredLink } from "@/components/ui/navbar-menu";
import { Input } from "@/components/ui/input";

function SegmentLink({ segment, onClose }: { segment: SegmentTemplate; onClose?: () => void }) {
  return (
    <Link
      href={`/${segment.slug}`}
      onClick={onClose}
      className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-accent/60"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground ring-1 ring-border transition-all group-hover:bg-primary/10 group-hover:text-primary group-hover:ring-primary/20">
        <Icon name={segment.icon} className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground group-hover:text-primary">{segment.label}</span>
        <span className="mt-0.5 block text-xs font-medium text-muted-foreground">{segment.tagline}</span>
      </span>
      <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground/40 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-primary group-hover:opacity-100" />
    </Link>
  );
}

export function SegmentsMenuPanel({ onClose }: { onClose?: () => void }) {
  const groups = getMenuSegmentGroups();
  const featured = getFeaturedSegments();
  const total = getSegmentTotal();
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const isSearching = query.trim().length > 0;
  const searchResults = useMemo(
    () => (isSearching ? filterSegments(query).slice(0, 10) : []),
    [isSearching, query],
  );

  return (
    <div className="w-[min(820px,calc(100vw-2rem))]">
      <div className="border-b border-border px-5 pb-4 pt-4">
        <p className="text-sm font-semibold text-foreground">Encontre o segmento do seu negócio</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Barbearia, clínica, restaurante, oficina, pet… · {total} segmentos
        </p>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={searchRef}
            id="segments-menu-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex.: barbearia, clínica, pet shop"
            className="pl-10"
          />
        </div>
      </div>

      {isSearching ? (
        <div className="p-5">
          {searchResults.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nenhum resultado para &ldquo;{query}&rdquo;.
            </p>
          ) : (
            <ul className="grid gap-1 sm:grid-cols-2">
              {searchResults.map((segment) => (
                <li key={segment.id}>
                  <SegmentLink segment={segment} onClose={onClose} />
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 border-t border-border pt-4 text-center">
            <Link
              href={`/segmentos?q=${encodeURIComponent(query.trim())}`}
              onClick={onClose}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Ver todos na página de segmentos →
            </Link>
          </p>
        </div>
      ) : (
        <div className="grid divide-x divide-border sm:grid-cols-3">
          {groups.map((group) => (
            <div key={group.category} className="bg-muted/20 p-4">
              <div className="mb-3 flex items-start gap-2.5 px-1">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                  <Icon name={SEGMENT_CATEGORY_ICONS[group.category] ?? "Layers"} className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-bold text-foreground">{group.label}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{group.description}</p>
                </div>
              </div>
              <ul className="space-y-0.5">
                {group.segments.slice(0, 4).map((segment) => (
                  <li key={segment.id}>
                    <HoveredLink href={`/${segment.slug}`} onClick={onClose}>
                      {segment.label}
                    </HoveredLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-border px-5 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Destaques</span>
            {featured.slice(0, 4).map((segment) => (
              <Link
                key={segment.id}
                href={`/${segment.slug}`}
                onClick={onClose}
                className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              >
                {segment.label}
              </Link>
            ))}
          </div>
          <Link href="/segmentos" onClick={onClose} className="shrink-0 text-xs font-semibold text-primary hover:underline">
            Ver catálogo ({total}) →
          </Link>
        </div>
      </div>
    </div>
  );
}
