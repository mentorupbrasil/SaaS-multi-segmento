import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getSegmentGroups } from "@/segments";
import { CATEGORY_META } from "@/segments/types";
import { Icon } from "@/components/icon";
import { MarketingShell, PageHero } from "@/components/marketing/marketing-shell";

export const metadata: Metadata = {
  title: "Segmentos atendidos",
  description:
    "Conheça todos os segmentos atendidos pelo GestorPro. Um sistema que se adapta ao seu negócio: beleza, saúde, automotivo, alimentação, serviços e educação.",
};

export default function SegmentosPage() {
  const groups = getSegmentGroups();
  const total = groups.reduce((acc, g) => acc + g.segments.length, 0);

  return (
    <MarketingShell>
      <PageHero
        eyebrow="Segmentos"
        title="Um sistema sob medida para o seu negócio"
        description={`Escolha o seu segmento e tudo se adapta: menus, nomenclatura, campos e módulos. Já são ${total} segmentos prontos para usar.`}
      />

      <section className="section py-16">
        <div className="space-y-12">
          {groups.map((group) => {
            const meta = CATEGORY_META[group.category];
            return (
              <div key={group.category}>
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100">
                    <Icon name={meta.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">{group.label}</h2>
                    <p className="text-sm text-slate-500">{meta.description}</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.segments.map((seg) => (
                    <Link
                      key={seg.id}
                      href={`/${seg.slug}`}
                      className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100">
                        <Icon name={seg.icon} className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-1 font-semibold text-slate-900">
                          {seg.label}
                          <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                        </span>
                        <span className="mt-0.5 block text-sm text-slate-500">{seg.tagline}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <h3 className="text-lg font-semibold text-slate-900">Não encontrou o seu segmento?</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
            Sem problema. A plataforma é flexível e atende praticamente qualquer negócio que trabalhe
            com clientes, agenda, serviços e financeiro.
          </p>
          <Link href="/signup" className="btn-primary mt-5">
            Criar minha conta
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
