import Link from "next/link";
import type { Metadata } from "next";
import { FEATURE_GROUPS } from "@/lib/features";
import { Icon } from "@/components/icon";
import { MarketingShell, PageHero } from "@/components/marketing/marketing-shell";

export const metadata: Metadata = {
  title: "Funcionalidades",
  description:
    "Conheça as funcionalidades do GestorPro: clientes, agenda, financeiro, equipe, relatórios e muito mais — tudo adaptado ao seu segmento.",
};

export default function FuncionalidadesPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Funcionalidades"
        title="Tudo o que o seu negócio precisa, em um só lugar"
        description="Recursos essenciais prontos para usar e adaptados à linguagem do seu segmento."
      />

      <section className="section space-y-16 py-16">
        {FEATURE_GROUPS.map((group) => (
          <div key={group.id} id={group.id}>
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">{group.label}</h2>
              <p className="mt-1 text-slate-600">{group.description}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <div key={item.id} id={item.id} className="card scroll-mt-24 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100">
                      <Icon name={item.icon} className="h-5 w-5" />
                    </div>
                    {item.status === "soon" && (
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                        Em breve
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900">{item.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-violet-700 px-8 py-12 text-center text-white shadow-xl">
          <h2 className="text-2xl font-bold sm:text-3xl">Pronto para usar com a cara do seu negócio</h2>
          <p className="mx-auto mt-2 max-w-xl text-brand-100">
            Escolha o seu segmento e veja tudo isso adaptado automaticamente.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/signup" className="btn-white">
              Assinar agora
            </Link>
            <Link
              href="/precos"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Ver planos
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
