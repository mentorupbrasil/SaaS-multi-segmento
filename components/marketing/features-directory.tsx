"use client";

import { useMemo, useState } from "react";
import { FEATURE_GROUPS } from "@/lib/features";
import { filterFeatures, FEATURE_GROUP_ICONS } from "@/lib/feature-vitrine";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

interface FeaturesDirectoryProps {
  initialQuery?: string;
}

export function FeaturesDirectory({ initialQuery = "" }: FeaturesDirectoryProps) {
  const [query, setQuery] = useState(initialQuery);
  const [activeGroup, setActiveGroup] = useState<string | "all">("all");

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
  const total = FEATURE_GROUPS.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <>
      <div className="sticky top-16 z-40 -mx-4 border-b border-slate-200/80 bg-white/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar funcionalidade..."
            className="min-w-0 flex-1 rounded-xl border border-slate-200 py-2.5 px-4 text-sm outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
          />
          <p className="shrink-0 text-sm text-slate-500">
            {visibleCount} de {total} recursos
          </p>
        </div>

        <div className="mx-auto mt-3 flex max-w-6xl gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveGroup("all")}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
              activeGroup === "all"
                ? "bg-brand-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200",
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
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              )}
            >
              <Icon name={FEATURE_GROUP_ICONS[group.id] ?? "Layers"} className="h-3.5 w-3.5" />
              {group.label}
            </button>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-6xl space-y-16 py-10">
        {filteredGroups.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <p className="text-slate-600">Nenhuma funcionalidade encontrada.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveGroup("all");
              }}
              className="mt-3 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          filteredGroups.map((group) => (
            <div key={group.id} id={group.id} className="scroll-mt-36">
              <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">{group.label}</h2>
                <p className="mt-1 text-slate-600">{group.description}</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <div key={item.id} id={item.id} className="card scroll-mt-36 p-6">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100">
                        <Icon name={item.icon} className="h-5 w-5" />
                      </div>
                      {item.status === "soon" && (
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                          Em breve
                        </span>
                      )}
                      {item.status === "available" && item.planGated && (
                        <span className="rounded-full bg-brand-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-700">
                          Plano Pro+
                        </span>
                      )}
                    </div>
                    <h3 className="mt-4 font-semibold text-slate-900">{item.name}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </>
  );
}
