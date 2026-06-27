import Link from "next/link";
import type { Metadata } from "next";
import { SOLUTIONS } from "@/lib/solutions";
import { Icon } from "@/components/icon";
import { MarketingShell, PageHero } from "@/components/marketing/marketing-shell";

export const metadata: Metadata = {
  title: "Soluções",
  description:
    "Organize o financeiro, controle seus clientes, venda mais e reduza o trabalho manual. Veja como o GestorPro resolve os problemas do seu dia a dia.",
};

export default function SolucoesPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Soluções"
        title="Resolvemos os problemas do seu dia a dia"
        description="Mais do que um sistema: uma forma de organizar, profissionalizar e crescer o seu negócio."
      />

      <section className="section space-y-12 py-16">
        {SOLUTIONS.map((s, i) => (
          <div
            key={s.slug}
            id={s.slug}
            className="grid scroll-mt-24 items-center gap-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:grid-cols-2"
          >
            <div className={i % 2 === 1 ? "lg:order-2" : ""}>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100">
                <Icon name={s.icon} className="h-6 w-6" />
              </span>
              <p className="mt-5 text-lg font-medium italic text-slate-500">{s.pain}</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {s.headline}
              </h2>
              <p className="mt-3 text-slate-600">{s.description}</p>
              <Link href="/signup" className="btn-primary mt-6">
                Começar agora
                <Icon name="ArrowRight" className="h-4 w-4" />
              </Link>
            </div>
            <ul className={`space-y-3 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
              {s.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                  <Icon name="Check" className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                  <span className="text-sm font-medium text-slate-700">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </MarketingShell>
  );
}
