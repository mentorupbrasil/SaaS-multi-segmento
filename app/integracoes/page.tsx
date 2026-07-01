import Link from "next/link";
import type { Metadata } from "next";
import { INTEGRATIONS } from "@/lib/integrations";
import { Icon } from "@/components/icon";
import { MarketingShell, PageHero } from "@/components/marketing/marketing-shell";

export const metadata: Metadata = {
  title: "Integrações",
  description:
    "Conecte o GestorPro com WhatsApp, PIX, pagamentos online, Google Agenda e mais. Tire o trabalho manual da sua rotina.",
};

export default function IntegracoesPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Integrações"
        title="Conecte com as ferramentas que você já usa"
        description="WhatsApp e PIX no plano Profissional ou superior — configure em Conexões no painel. Outras integrações chegam em breve."
      />

      <section className="section py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INTEGRATIONS.map((i) => (
            <div key={i.name} className="card p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <Icon name={i.icon} className="h-5 w-5" />
                </span>
                {i.status === "available" ? (
                  i.planGated ? (
                    <span className="rounded-full bg-brand-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-700">
                      Plano Pro+
                    </span>
                  ) : (
                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-green-700">
                      Disponível
                    </span>
                  )
                ) : (
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                    Em breve
                  </span>
                )}
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{i.name}</h3>
              <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
                {i.category}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{i.description}</p>
              {i.status === "available" && i.planGated && (
                <p className="mt-2 text-xs text-slate-500">
                  Ative em Conexões após assinar o plano Profissional ou superior.
                </p>
              )}
              {i.status === "available" && i.planGated && (
                <Link href="/signup" className="btn-primary mt-4 inline-flex w-full justify-center text-sm">
                  Assinar plano Profissional
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <h3 className="text-lg font-semibold text-slate-900">Precisa de uma integração específica?</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
            No plano Enterprise desenvolvemos integrações personalizadas para a sua operação.
          </p>
          <Link href="/suporte" className="btn-primary mt-5">
            Falar com o time
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
