"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { FEATURE_GROUPS } from "@/lib/features";
import {
  filterFeatures,
  FEATURE_GROUP_ICONS,
  getFeaturedFeatures,
  getFeatureTotal,
} from "@/lib/feature-vitrine";
import type { FeatureItem } from "@/lib/features";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

interface FeaturesDirectoryProps {
  initialQuery?: string;
}

function FeatureBadge({ item }: { item: FeatureItem }) {
  if (item.status === "soon") {
    return (
      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
        Em breve
      </span>
    );
  }
  if (item.planGated) {
    return (
      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
        Pro+
      </span>
    );
  }
  return null;
}

export function FeaturesDirectory({ initialQuery = "" }: FeaturesDirectoryProps) {
  const [query, setQuery] = useState(initialQuery);
  const [activeGroup, setActiveGroup] = useState<string | "all">("all");

  const featured = getFeaturedFeatures();
  const total = getFeatureTotal();
  const isSearching = query.trim().length > 0;

  const filteredGroups = useMemo(() => {
    const matches = filterFeatures(query, activeGroup === "all" ? undefined : activeGroup);
    if (activeGroup !== "all" && !query.trim()) {
      const group = FEATURE_GROUPS.find((g) => g.id === activeGroup);
      return group ? [{ ...group, items: group.items }] : [];
    }
    if (activeGroup !== "all") {
      const group = FEATURE_GROUPS.find((g) => g.id === activeGroup);
      return group ? [{ ...group, items: matches }] : [];
    }
    const ids = new Set(matches.map((m) => m.id));
    return FEATURE_GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((i) => ids.has(i.id)),
    })).filter((g) => g.items.length > 0);
  }, [query, activeGroup]);

  const visibleCount = filteredGroups.reduce((acc, g) => acc + g.items.length, 0);
  const showFeatured = !isSearching && activeGroup === "all";

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;

    const isGroup = FEATURE_GROUPS.some((g) => g.id === hash);
    if (isGroup) {
      setActiveGroup(hash);
      setQuery("");
    }

    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const scrollToGroup = (groupId: string) => {
    setActiveGroup("all");
    setQuery("");
    requestAnimationFrame(() => {
      document.getElementById(groupId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <>
      {/* Barra sticky — busca + filtros */}
      <div className="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="section py-4">
          <label htmlFor="features-directory-search" className="sr-only">
            Buscar funcionalidade
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="features-directory-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Buscar agenda, financeiro, PDV, portal...'
                className="w-full rounded-xl border border-border bg-muted py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <p className="shrink-0 text-sm text-muted-foreground">
              {visibleCount} de {total} recursos
            </p>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setActiveGroup("all")}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                activeGroup === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted",
              )}
            >
              Todas
            </button>
            {FEATURE_GROUPS.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => setActiveGroup(group.id)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  activeGroup === group.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted",
                )}
              >
                <Icon name={FEATURE_GROUP_ICONS[group.id] ?? "Layers"} className="h-3.5 w-3.5" />
                {group.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="section py-10 lg:py-12">
        <div className="lg:grid lg:grid-cols-[200px_1fr] lg:gap-10 xl:grid-cols-[220px_1fr]">
          {/* Sidebar — sumário (desktop) */}
          <aside className="hidden lg:block">
            <nav className="sticky top-36 space-y-1">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Categorias
              </p>
              {FEATURE_GROUPS.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => scrollToGroup(group.id)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                >
                  <Icon
                    name={FEATURE_GROUP_ICONS[group.id] ?? "Layers"}
                    className="h-4 w-4 shrink-0 text-muted-foreground"
                  />
                  <span className="min-w-0 truncate">{group.label}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground">{group.items.length}</span>
                </button>
              ))}
            </nav>
          </aside>

          <div className="min-w-0 space-y-12">
            {/* Destaques */}
            {showFeatured && (
              <section>
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Mais usados
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-foreground">
                    Recursos essenciais para começar
                  </h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {featured.map((item) => (
                    <Link
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="group flex items-start gap-3 rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary ring-1 ring-primary/20">
                        <Icon name={item.icon} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-1 font-semibold text-foreground group-hover:text-primary">
                          {item.name}
                          <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                        </span>
                        <span className="mt-0.5 block text-sm text-muted-foreground">{item.short}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {filteredGroups.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card py-16 text-center">
                <p className="text-muted-foreground">Nenhuma funcionalidade encontrada para &ldquo;{query}&rdquo;.</p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setActiveGroup("all");
                  }}
                  className="mt-3 text-sm font-semibold text-primary hover:text-primary/80"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              filteredGroups.map((group) => (
                <section key={group.id} id={group.id} className="scroll-mt-36">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary ring-1 ring-primary/20">
                      <Icon name={FEATURE_GROUP_ICONS[group.id] ?? "Layers"} className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-foreground">{group.label}</h2>
                      <p className="text-sm text-muted-foreground">
                        {group.description} · {group.items.length} recursos
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {group.items.map((item) => (
                      <article
                        key={item.id}
                        id={item.id}
                        className="group scroll-mt-36 rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary ring-1 ring-primary/20">
                            <Icon name={item.icon} className="h-4 w-4" />
                          </span>
                          <FeatureBadge item={item} />
                        </div>
                        <h3 className="mt-3 font-semibold text-foreground">{item.name}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                        <p className="mt-2 text-xs text-muted-foreground">{item.short}</p>
                      </article>
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
