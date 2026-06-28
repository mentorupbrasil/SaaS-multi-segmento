import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { CATEGORY_META } from "@/segments/types";
import {
  getFeaturedSegments,
  getSegmentGroupsForVitrine,
  getSegmentTotal,
} from "@/lib/segment-vitrine";
import { Icon } from "@/components/icon";
import { SegmentSearch } from "./segment-search";

export function SegmentsShowcase() {
  const groups = getSegmentGroupsForVitrine();
  const featured = getFeaturedSegments();
  const total = getSegmentTotal();

  return (
    <section id="segmentos" className="border-b border-slate-100 bg-slate-50/40">
      <div className="section py-16 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">Para o seu segmento</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Qual é o seu negócio?
          </h2>
          <p className="mt-3 text-slate-600">
            Escolha o tipo que mais se aproxima do seu ramo — menus, nomenclatura e módulos já
            configurados.{" "}
            <strong className="font-semibold text-slate-900">{total} segmentos</strong> prontos.
          </p>
        </div>

        {/* Busca em destaque — padrão ClickUp/Notion */}
        <div className="mx-auto mt-8 max-w-xl">
          <SegmentSearch
            id="home-segment-search"
            size="large"
            label=""
            hint=""
            placeholder='Digite "restaurante", "clínica", "barbearia"...'
          />
        </div>

        {/* Populares primeiro */}
        <div className="mt-10">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Mais escolhidos</p>
                <p className="text-xs text-slate-500">Acesso direto aos segmentos mais usados</p>
              </div>
            </div>
            <Link
              href="/segmentos"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              Ver catálogo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {featured.map((seg) => (
              <Link
                key={seg.id}
                href={`/${seg.slug}`}
                className="group flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white px-3 py-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100">
                  <Icon name={seg.icon} className="h-5 w-5" />
                </span>
                <span className="mt-2 line-clamp-2 text-xs font-semibold leading-tight text-slate-800 group-hover:text-brand-700">
                  {seg.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="my-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Ou navegue por categoria
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Categorias com ícones e descrição */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {groups.map((group) => {
            const meta = CATEGORY_META[group.category];
            return (
              <Link
                key={group.category}
                href={`/segmentos#${group.category}`}
                className="group flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100">
                    <Icon name={meta.icon} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900 group-hover:text-brand-700">
                      {meta.label}
                    </h3>
                    <p className="mt-0.5 text-[11px] font-medium text-brand-600">
                      {group.segments.length} segmentos disponíveis
                    </p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-500">
                  {meta.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-700 opacity-0 transition-opacity group-hover:opacity-100">
                  Explorar
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h3 className="font-semibold text-slate-900">Não encontrou o seu segmento?</h3>
            <p className="mt-1 max-w-lg text-sm text-slate-600">
              Qualquer negócio com clientes, agenda e financeiro se encaixa na plataforma.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link href="/segmentos" className="btn-secondary">
              Explorar {total} segmentos
            </Link>
            <Link href="/signup" className="btn-primary">
              Começar grátis
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
