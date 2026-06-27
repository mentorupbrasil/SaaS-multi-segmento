import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { HeroMockup } from "@/components/marketing/hero-mockup";
import { MarketingShell, PageHero } from "@/components/marketing/marketing-shell";

export const metadata: Metadata = {
  title: "Demonstração",
  description:
    "Veja o GestorPro em ação: agenda, clientes, financeiro e relatórios, com a linguagem do seu segmento. Crie sua conta e explore.",
};

const SCREENS = [
  { icon: "LayoutDashboard", title: "Painel inicial", text: "Os números do seu negócio assim que você entra: faturamento, atendimentos e clientes." },
  { icon: "Calendar", title: "Agenda", text: "Agendamentos por profissional, com status e visão do dia inteiro." },
  { icon: "Users", title: "Clientes", text: "Histórico completo e campos específicos do seu segmento." },
  { icon: "Wallet", title: "Financeiro", text: "Entradas, saídas e fluxo de caixa, sem planilha." },
];

export default function DemonstracaoPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Demonstração"
        title="Veja o GestorPro em ação"
        description="Uma interface clara e objetiva, adaptada ao seu segmento. Conheça as principais telas."
      />

      <section className="section py-16">
        <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6 sm:p-10">
          <HeroMockup />
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {SCREENS.map((s) => (
            <div key={s.title} className="card flex items-start gap-4 p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100">
                <Icon name={s.icon} className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-gradient-to-br from-brand-600 to-violet-700 px-8 py-12 text-center text-white shadow-xl">
          <h2 className="text-2xl font-bold sm:text-3xl">Quer ver com a cara do seu negócio?</h2>
          <p className="mx-auto mt-2 max-w-xl text-brand-100">
            Crie sua conta, escolha o segmento e veja a plataforma se adaptar na hora.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/signup" className="btn-white">
              Criar minha conta
            </Link>
            <Link
              href="/segmentos"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Ver segmentos
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
