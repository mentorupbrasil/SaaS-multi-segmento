import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { INTEGRATIONS, type Integration } from "@/lib/integrations";
import { Icon } from "@/components/icon";

function IntegrationBadge({ item }: { item: Integration }) {
  if (item.status === "soon") {
    return (
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        Em breve
      </span>
    );
  }
  if (item.planGated) {
    return (
      <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-700">
        Pro+
      </span>
    );
  }
  return (
    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-700">
      Ativo
    </span>
  );
}

export function IntegrationsShowcase() {
  const available = INTEGRATIONS.filter((i) => i.status === "available");
  const upcoming = INTEGRATIONS.filter((i) => i.status === "soon");

  return (
    <section className="section py-16 lg:py-20">
      <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
        {/* Intro */}
        <div>
          <span className="eyebrow">Integrações</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Conecte com o que você já usa
          </h2>
          <p className="mt-4 text-slate-600">
            Menos trabalho manual entre sistemas. Ative integrações no painel{" "}
            <strong className="font-medium text-slate-800">Conexões</strong> conforme o seu plano.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">
              <p className="text-2xl font-bold text-green-700">{available.length}</p>
              <p className="text-xs font-medium text-green-800">disponíveis hoje</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-2xl font-bold text-slate-700">{upcoming.length}</p>
              <p className="text-xs font-medium text-slate-600">no roadmap</p>
            </div>
          </div>

          <Link href="/integracoes" className="btn-secondary mt-8 inline-flex">
            Ver integrações
            <Icon name="ArrowRight" className="h-4 w-4" />
          </Link>
        </div>

        {/* Disponíveis — destaque */}
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Disponíveis agora
          </p>
          {available.map((item) => (
            <Link
              key={item.name}
              href="/integracoes"
              className="group flex items-start gap-4 rounded-2xl border border-brand-200/60 bg-gradient-to-br from-white to-brand-50/30 p-5 shadow-sm transition-all hover:border-brand-300 hover:shadow-md"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm ring-1 ring-brand-100">
                <Icon name={item.icon} className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-slate-900 group-hover:text-brand-700">
                    {item.name}
                  </h3>
                  <IntegrationBadge item={item} />
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                    {item.category}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </div>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-brand-600" />
            </Link>
          ))}
        </div>
      </div>

      {/* Roadmap — compacto */}
      {upcoming.length > 0 && (
        <div className="mt-12">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Próximas integrações
            </p>
            <p className="text-xs text-slate-500">Em desenvolvimento — sem prazo fixo</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {upcoming.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-400 ring-1 ring-slate-200">
                    <Icon name={item.icon} className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-700">{item.name}</p>
                    <p className="text-[10px] text-slate-400">{item.category}</p>
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
