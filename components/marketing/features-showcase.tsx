"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  getFeatureGroups,
  getFeatureTotal,
  getHomepageFeatures,
  FEATURE_GROUP_ICONS,
} from "@/lib/feature-vitrine";
import type { FeatureItem } from "@/lib/features";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./section-header";

function FeatureBadge({ item }: { item: FeatureItem }) {
  if (item.status === "soon") {
    return (
      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-700">
        Em breve
      </span>
    );
  }
  if (item.planGated) {
    return (
      <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-brand-700">
        Pro+
      </span>
    );
  }
  return null;
}

function FeatureCard({ item, large }: { item: FeatureItem; large?: boolean }) {
  return (
    <Link
      href={`/funcionalidades#${item.id}`}
      className={cn(
        "group relative flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/5",
        large && "sm:p-6",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100 transition-transform group-hover:scale-105">
          <Icon name={item.icon} className="h-5 w-5" />
        </span>
        <FeatureBadge item={item} />
      </div>
      <h3 className="mt-4 flex items-center gap-1 font-semibold text-slate-900 group-hover:text-brand-700">
        {item.name}
        <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
      </h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">{item.short}</p>
    </Link>
  );
}

export function FeaturesShowcase() {
  const groups = getFeatureGroups();
  const essentials = getHomepageFeatures();
  const total = getFeatureTotal();
  const [activeGroup, setActiveGroup] = useState(groups[0]?.id ?? "gestao");

  const active = groups.find((g) => g.id === activeGroup) ?? groups[0];

  return (
    <section className="section-premium relative border-y border-slate-200/60 py-12 lg:py-16">
      <div className="section-glow pointer-events-none" aria-hidden />
      <div className="section relative">
        <SectionHeader
          eyebrow="Tudo em um só lugar"
          title={
            <>
              O que você controla com o{" "}
              <span className="gradient-text">GestorPro</span>
            </>
          }
          description="Pare de juntar caderno, planilha e WhatsApp. Centralize a operação do seu negócio."
        />
        <p className="mx-auto mt-3 max-w-xl text-center text-sm font-medium text-slate-500">
          {total} recursos · {groups.length} categorias · Adaptados ao seu segmento
        </p>

        {/* Essenciais — grid principal */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {essentials.map((item) => (
            <FeatureCard key={item.id} item={item} />
          ))}
        </div>

        {/* Preview por categoria — tabs */}
        <div className="mt-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Explore por categoria</p>
              <p className="mt-0.5 text-xs text-slate-500">
                Veja o que mais o GestorPro oferece além do essencial
              </p>
            </div>
            <Link
              href="/funcionalidades"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              Ver catálogo completo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {groups.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => setActiveGroup(group.id)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors",
                  activeGroup === group.id
                    ? "bg-brand-600 text-white shadow-sm"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50",
                )}
              >
                <Icon name={FEATURE_GROUP_ICONS[group.id] ?? "Layers"} className="h-3.5 w-3.5" />
                {group.label}
              </button>
            ))}
          </div>

          {active && (
            <div className="card-elevated mt-5 p-5 sm:p-6">
              <div className="mb-4 flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100">
                  <Icon name={FEATURE_GROUP_ICONS[active.id] ?? "Layers"} className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900">{active.label}</h3>
                  <p className="mt-0.5 text-sm text-slate-500">{active.description}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {active.items.map((item) => (
                  <Link
                    key={item.id}
                    href={`/funcionalidades#${item.id}`}
                    className="group flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition-all hover:border-brand-200 hover:bg-white hover:shadow-sm"
                  >
                    <Icon
                      name={item.icon}
                      className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 group-hover:text-brand-600"
                    />
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-slate-800 group-hover:text-brand-700">
                          {item.name}
                        </span>
                        <FeatureBadge item={item} />
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-500">{item.short}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <Link href="/funcionalidades" className="btn-primary px-6 py-3">
            Ver todas as funcionalidades
            <Icon name="ArrowRight" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}