"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Search } from "lucide-react";
import {
  INTEGRATIONS,
  INTEGRATION_GROUPS,
  filterIntegrations,
  getIntegrationTotal,
  type Integration,
  type IntegrationGroupId,
} from "@/lib/integrations";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

interface IntegrationsDirectoryProps {
  initialQuery?: string;
}

function IntegrationCard({ item }: { item: Integration }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/5">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-lg shadow-brand-500/25 transition-transform group-hover:scale-105">
          <Icon name={item.icon} className="h-5 w-5" />
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-100">
          <Check className="h-3 w-3" />
          Disponível
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-brand-700">{item.name}</h3>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
          {item.category}
        </span>
      </div>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{item.description}</p>

      <ul className="mt-4 space-y-1.5">
        {item.highlights.map((h) => (
          <li key={h} className="flex items-center gap-2 text-xs text-slate-500">
            <Icon name="Check" className="h-3.5 w-3.5 shrink-0 text-brand-600" />
            {h}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <span className="text-xs font-medium text-slate-500">
          Plano: <span className="font-semibold text-brand-700">{item.planLabel}</span>
        </span>
        <Link
          href="/signup"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 opacity-0 transition-opacity group-hover:opacity-100"
        >
          Assinar
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}

export function IntegrationsDirectory({ initialQuery = "" }: IntegrationsDirectoryProps) {
  const [query, setQuery] = useState(initialQuery);
  const [activeGroup, setActiveGroup] = useState<IntegrationGroupId | "all">("all");

  const total = getIntegrationTotal();
  const isSearching = query.trim().length > 0;

  const filtered = useMemo(
    () => filterIntegrations(query, activeGroup === "all" ? undefined : activeGroup),
    [query, activeGroup],
  );

  const featured = INTEGRATIONS.slice(0, 3);
  const showFeatured = !isSearching && activeGroup === "all";

  const gridItems = useMemo(() => {
    if (!showFeatured) return filtered;
    const featuredIds = new Set(featured.map((i) => i.id));
    return filtered.filter((i) => !featuredIds.has(i.id));
  }, [filtered, showFeatured, featured]);

  return (
    <div className="section pb-16">
      {/* Stats + busca */}
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="flex flex-wrap gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
            <p className="text-2xl font-bold tabular-nums text-slate-900">{total}</p>
            <p className="text-xs text-slate-500">integrações ativas</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 px-5 py-3">
            <p className="text-sm font-semibold text-emerald-800">100% operacionais</p>
            <p className="text-xs text-emerald-700">Ative em Conexões no painel</p>
          </div>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar integração..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none ring-brand-500 transition-shadow placeholder:text-slate-400 focus:border-brand-300 focus:ring-2"
          />
        </div>
      </div>

      {/* Destaques */}
      {showFeatured && (
        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Mais usadas</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {featured.map((item) => (
              <IntegrationCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Filtros por categoria */}
      <div className="mt-10 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveGroup("all")}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
            activeGroup === "all"
              ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
              : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50",
          )}
        >
          Todas ({total})
        </button>
        {INTEGRATION_GROUPS.map((g) => {
          const count = INTEGRATIONS.filter((i) => i.group === g.id).length;
          if (count === 0) return null;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setActiveGroup(g.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                activeGroup === g.id
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50",
              )}
            >
              <Icon name={g.icon} className="h-3.5 w-3.5" />
              {g.label}
              <span className="opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="mt-8">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-16 text-center">
            <p className="font-medium text-slate-700">Nenhuma integração encontrada</p>
            <p className="mt-1 text-sm text-slate-500">Tente outro termo ou limpe os filtros.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveGroup("all");
              }}
              className="btn-secondary mt-4 text-sm"
            >
              Limpar busca
            </button>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-slate-500">
              {gridItems.length} {gridItems.length === 1 ? "integração" : "integrações"}
              {showFeatured ? " adicionais" : ""}
              {isSearching ? ` para “${query.trim()}”` : activeGroup !== "all" ? " nesta categoria" : ""}
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {gridItems.map((item) => (
                <IntegrationCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Como ativar */}
      <div className="card-elevated mt-14 overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="border-b border-slate-100 p-8 lg:border-b-0 lg:border-r lg:p-10">
            <span className="eyebrow">Como ativar</span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              Três passos e está conectado
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Todas as integrações são ligadas no painel interno. Sem instalação, sem técnico de
              plantão.
            </p>
            <ol className="mt-8 space-y-5">
              {[
                {
                  n: "1",
                  title: "Assine o plano certo",
                  text: "Profissional ou superior para a maioria; Premium para channel manager e multi-unidade.",
                },
                {
                  n: "2",
                  title: "Abra Conexões",
                  text: "No menu do painel: Conexões → escolha WhatsApp, PIX, Google Agenda e demais.",
                },
                {
                  n: "3",
                  title: "Configure e use",
                  text: "Cole tokens, chaves ou autorize OAuth. O webhook já vem documentado na tela.",
                },
              ].map((step) => (
                <li key={step.n} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                    {step.n}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">{step.title}</p>
                    <p className="mt-0.5 text-sm text-slate-600">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link href="/signup" className="btn-primary mt-8 inline-flex">
              Criar conta
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-violet-950 p-8 text-white lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">
              Enterprise
            </p>
            <h3 className="mt-2 text-xl font-bold">Integração sob medida</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Redes, franquias e operações com ERP, PDV ou API própria: desenvolvemos conectores
              personalizados com SLA e gerente de conta.
            </p>
            <ul className="mt-6 space-y-3">
              {["API REST documentada", "Webhooks por evento", "Suporte prioritário"].map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm text-slate-200">
                  <Icon name="Check" className="h-4 w-4 text-brand-300" />
                  {t}
                </li>
              ))}
            </ul>
            <Link href="/suporte" className="btn-white mt-8 inline-flex text-sm">
              Falar com o time
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
