import Link from "next/link";
import type { Metadata } from "next";
import { SOLUTIONS } from "@/lib/solutions";
import { Icon } from "@/components/icon";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { HeroMockup } from "@/components/marketing/hero-mockup";
import { SegmentsShowcase } from "@/components/marketing/segments-showcase";
import { IntegrationsShowcase } from "@/components/marketing/integrations-showcase";
import { SecurityShowcase } from "@/components/marketing/security-showcase";
import { Testimonials } from "@/components/marketing/testimonials";
import { Faq } from "@/components/marketing/faq";
import { getHomeFaqGroups } from "@/lib/home-faq";

export const metadata: Metadata = {
  title: "GestorPro | A plataforma de gestão que entende o seu negócio",
  description:
    "Sistema de gestão que se adapta ao seu segmento: barbearia, salão, clínica, oficina, petshop, academia e muito mais. Agenda, clientes, financeiro e equipe. Planos a partir de R$ 39,90/mês.",
};

const CONTROL = [
  { icon: "Calendar", title: "Agenda", text: "Horários, profissionais e status de atendimento em uma agenda clara." },
  { icon: "Users", title: "Clientes", text: "Cadastro completo, histórico e campos específicos do seu segmento." },
  { icon: "Wallet", title: "Financeiro", text: "Entradas, saídas, fluxo de caixa e relatórios de faturamento." },
  { icon: "Tag", title: "Serviços e preços", text: "Catálogo com valores e duração, já pré-configurado para o seu nicho." },
  { icon: "UserCog", title: "Equipe", text: "Profissionais com papéis e níveis de acesso diferentes." },
  { icon: "LayoutDashboard", title: "Relatórios", text: "Os números que importam para decidir com segurança." },
];

export default function HomePage() {
  const featureIaEnabled = process.env.FEATURE_IA === "true";

  return (
    <div className="bg-white">
      <SiteHeader />

      {/* 1. Hero */}
      <section className="relative overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="section relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="eyebrow">
              <Icon name="Sparkles" className="h-3.5 w-3.5" />
              A plataforma que entende o seu negócio
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              O sistema feito para o{" "}
              <span className="gradient-text">seu segmento</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">
              Escolha o seu ramo e tenha uma plataforma sob medida: agenda, clientes, serviços e
              financeiro com a linguagem do seu negócio. Conta ativa na hora, a partir de R$ 39,90/mês.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="btn-primary px-6 py-3 text-base">
                Assinar agora
                <Icon name="ArrowRight" className="h-4 w-4" />
              </Link>
              <Link href="/precos" className="btn-secondary px-6 py-3 text-base">
                Ver planos
                <Icon name="ArrowRight" className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="Check" className="h-4 w-4 text-green-600" /> Conta ativa na hora
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="Check" className="h-4 w-4 text-green-600" /> Sem fidelidade
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="Check" className="h-4 w-4 text-green-600" /> Suporte em português
              </span>
            </div>
          </div>
          <HeroMockup />
        </div>
      </section>

      {/* 2. Segmentos atendidos */}
      <SegmentsShowcase />

      {/* 3. O que você controla */}
      <section className="border-y border-slate-100 bg-slate-50/60">
        <div className="section py-16">
          <div className="text-center">
            <span className="eyebrow">Tudo em um só lugar</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              O que você controla com o GestorPro
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Pare de juntar caderno, planilha e WhatsApp. Centralize a operação do seu negócio.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CONTROL.map((f) => (
              <div key={f.title} className="card p-6 transition-shadow hover:shadow-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100">
                  <Icon name={f.icon} className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{f.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/funcionalidades" className="btn-secondary">
              Ver todas as funcionalidades
              <Icon name="ArrowRight" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Problemas que resolve */}
      <section className="section py-16">
        <div className="text-center">
          <span className="eyebrow">Soluções</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Resolvemos os problemas do seu dia a dia
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Mais do que um sistema, uma forma de organizar e crescer o negócio.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {SOLUTIONS.map((s) => (
            <Link
              key={s.slug}
              href={`/solucoes#${s.slug}`}
              className="card group flex flex-col p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100">
                  <Icon name={s.icon} className="h-5 w-5" />
                </span>
                <h3 className="font-semibold text-slate-900">{s.title}</h3>
              </div>
              <p className="mt-4 text-sm italic text-slate-500">{s.pain}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 group-hover:gap-2 transition-all">
                Ver solução <Icon name="ArrowRight" className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Inteligência Artificial */}
      <section className="section py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-xl">
              <Icon name="Sparkles" className="h-8 w-8 text-brand-300" />
              <p className="mt-4 text-sm text-slate-300">Resumo do dia</p>
              <p className="mt-1 text-lg font-semibold">
                “Hoje você tem 12 atendimentos. 3 clientes inativos há mais de 60 dias — que tal um
                lembrete?”
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="text-slate-300">Horário sugerido</p>
                  <p className="font-semibold">14h30</p>
                </div>
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="text-slate-300">Faturamento previsto</p>
                  <p className="font-semibold">R$ 1.240</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="eyebrow">
              <Icon name="Sparkles" className="h-3.5 w-3.5" /> Inteligência artificial
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Inteligência que trabalha por você
            </h2>
            <p className="mt-4 text-slate-600">
              A IA do GestorPro resume o seu dia, sugere horários e aponta clientes para retornar —
              ajudando você a vender mais sem esforço extra.
            </p>
            {featureIaEnabled ? (
              <Link href="/funcionalidades#ia" className="btn-secondary mt-5 inline-flex">
                Conhecer a IA
                <Icon name="ArrowRight" className="h-4 w-4" />
              </Link>
            ) : (
              <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
                Em breve
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 7. Aplicativo */}
      <section className="border-y border-slate-100 bg-slate-50/60">
        <div className="section grid items-center gap-12 py-16 lg:grid-cols-2">
          <div>
            <span className="eyebrow">
              <Icon name="Smartphone" className="h-3.5 w-3.5" /> Aplicativo
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              O seu negócio no bolso
            </h2>
            <p className="mt-4 text-slate-600">
              Acesse a agenda, os clientes e o caixa pelo celular, de onde estiver. Hoje a plataforma
              já funciona no navegador do celular; o aplicativo dedicado vem a caminho.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
              App dedicado em breve
            </span>
          </div>
          <div className="flex justify-center">
            <div className="flex h-72 w-40 flex-col rounded-[2rem] border-4 border-slate-900 bg-white p-3 shadow-2xl">
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-200" />
              <div className="space-y-2">
                <div className="h-8 rounded-lg bg-gradient-to-r from-brand-500 to-violet-500" />
                <div className="h-12 rounded-lg bg-slate-100" />
                <div className="h-12 rounded-lg bg-slate-100" />
                <div className="h-12 rounded-lg bg-slate-100" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <IntegrationsShowcase />

      <SecurityShowcase />

      {/* Depoimentos */}
      <Testimonials />

      <Faq
        groups={getHomeFaqGroups()}
        title="Perguntas frequentes"
        description="O que muda por segmento, limites de cada plano e como funciona na prática."
        showSupportLinks
      />

      {/* 13. CTA final */}
      <section className="section pb-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-violet-700 px-8 py-16 text-center shadow-xl">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pronto para organizar o seu negócio?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-brand-100">
              Crie sua conta, escolha o plano e veja o sistema se adaptar ao seu segmento em minutos.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/signup" className="btn-white px-6 py-3 text-base">
                Assinar agora
                <Icon name="ArrowRight" className="h-4 w-4" />
              </Link>
              <Link
                href="/precos"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
              >
                Ver planos
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
