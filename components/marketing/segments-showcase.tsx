import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSegmentGroups } from "@/segments";
import { Icon } from "@/components/icon";

export function SegmentsShowcase() {
  const groups = getSegmentGroups();

  return (
    <section id="segmentos" className="section py-20">
      <div className="text-center">
        <span className="eyebrow">Para o seu segmento</span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Um sistema sob medida para o seu negocio
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
          Escolha o seu segmento e tudo se adapta: menus, nomenclatura, campos e modulos. Veja
          alguns dos nichos que ja atendemos.
        </p>
      </div>

      <div className="mt-14 space-y-12">
        {groups.map((group) => (
          <div key={group.category}>
            <div className="mb-4 flex items-center gap-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                {group.label}
              </h3>
              <span className="h-px flex-1 bg-slate-200" />
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
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <h3 className="text-lg font-semibold text-slate-900">Nao encontrou o seu segmento?</h3>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
          Sem problema. A plataforma e flexivel e atende praticamente qualquer tipo de negocio que
          trabalhe com clientes, agenda, servicos e financeiro. Crie sua conta e personalize.
        </p>
        <Link href="/signup" className="btn-primary mt-5">
          Comecar gratis
        </Link>
      </div>
    </section>
  );
}
