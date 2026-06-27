import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_SEGMENTS, getSegmentBySlug, CATEGORY_LABELS } from "@/segments";
import { MODULES } from "@/modules";
import { resolveTerms } from "@/lib/terms";
import { Icon } from "@/components/icon";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Pricing } from "@/components/marketing/pricing";
import { Faq } from "@/components/marketing/faq";

export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_SEGMENTS.map((s) => ({ segment: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ segment: string }>;
}): Promise<Metadata> {
  const { segment } = await params;
  const seg = getSegmentBySlug(segment);
  if (!seg) return {};
  return {
    title: seg.seo.title,
    description: seg.seo.description,
    keywords: seg.seo.keywords,
    openGraph: { title: seg.seo.title, description: seg.seo.description },
  };
}

const GENERIC_FAQ = [
  { q: "Preciso instalar algo?", a: "Nao. Funciona online no computador e no celular, com seus dados seguros na nuvem." },
  { q: "Como funciona o teste gratis?", a: "Sao 14 dias gratuitos, sem cartao de credito. Depois e so assinar para continuar." },
  { q: "Posso cancelar quando quiser?", a: "Sim, sem fidelidade. Voce cancela a qualquer momento." },
];

export default async function SegmentLandingPage({
  params,
}: {
  params: Promise<{ segment: string }>;
}) {
  const { segment } = await params;
  const seg = getSegmentBySlug(segment);
  if (!seg) notFound();

  const terms = resolveTerms(seg.id);

  // Rotulo de cada modulo adaptado ao nicho.
  const moduleLabel: Record<string, string> = {
    clients: terms.customer_plural,
    scheduling: terms.appointment_plural,
    services: terms.service_plural,
    work_orders: terms.work_order_plural ?? "Ordens de Servico",
    records: terms.records ?? "Prontuario",
    financial: "Financeiro",
    team: "Equipe",
    inventory: terms.inventory ?? "Estoque",
  };

  const related = ALL_SEGMENTS.filter(
    (s) => s.category === seg.category && s.id !== seg.id,
  ).slice(0, 3);

  const faqItems = [...(seg.faq ?? []), ...GENERIC_FAQ];

  return (
    <div className="bg-white">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="section relative grid items-center gap-12 py-20 lg:grid-cols-2">
          <div>
            <span className="eyebrow">
              <Icon name={seg.icon} className="h-3.5 w-3.5" />
              {CATEGORY_LABELS[seg.category]}
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              {seg.seo.headline}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">{seg.seo.subheadline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="btn-primary px-6 py-3 text-base">
                Testar gratis por 14 dias
                <Icon name="ArrowRight" className="h-4 w-4" />
              </Link>
              <Link href="#precos" className="btn-secondary px-6 py-3 text-base">
                Ver precos
              </Link>
            </div>
          </div>

          {/* Card de beneficios */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand-200/40 via-violet-200/40 to-fuchsia-200/40 blur-2xl" />
            <div className="relative rounded-2xl border border-slate-200 bg-white p-7 shadow-2xl shadow-slate-300/40">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-fuchsia-600 text-white">
                  <Icon name={seg.icon} className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{seg.label}</p>
                  <p className="text-sm text-slate-500">{seg.tagline}</p>
                </div>
              </div>
              <ul className="mt-6 space-y-3">
                {seg.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-slate-700">
                    <Icon name="BadgeCheck" className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Modulos do nicho */}
      <section className="section py-20">
        <div className="text-center">
          <span className="eyebrow">O que esta incluso</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Tudo que a sua {seg.label.toLowerCase()} precisa
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Modulos prontos e ja com os nomes do seu segmento.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {seg.modules.map((id) => {
            const mod = MODULES[id];
            if (!mod) return null;
            return (
              <div key={id} className="card p-6 transition-shadow hover:shadow-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100">
                  <Icon name={mod.nav[0]?.icon ?? "Tag"} className="h-5 w-5" />
                </div>
                <h3 className="mt-4 flex items-center gap-2 font-semibold text-slate-900">
                  {moduleLabel[id] ?? mod.name}
                  {mod.comingSoon && (
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                      em breve
                    </span>
                  )}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{mod.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Como funciona */}
      <section className="border-y border-slate-100 bg-slate-50/60">
        <div className="section py-20">
          <div className="text-center">
            <span className="eyebrow">Simples assim</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Comece em 3 passos
            </h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { icon: "Rocket", t: "Crie sua conta", d: `Cadastro rapido escolhendo "${seg.label}".` },
              { icon: "Layers", t: "Sistema personalizado", d: "Menus e termos do seu nicho ja configurados." },
              { icon: "TrendingUp", t: "Gerencie e cresca", d: "Agenda, clientes e caixa em um lugar so." },
            ].map((s, i) => (
              <div key={s.t} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm ring-1 ring-slate-200">
                  <Icon name={s.icon} className="h-6 w-6" />
                </div>
                <span className="mt-4 inline-block text-xs font-bold uppercase tracking-wider text-brand-600">
                  Passo {i + 1}
                </span>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">{s.t}</h3>
                <p className="mx-auto mt-1.5 max-w-xs text-sm text-slate-600">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Pricing />

      <Faq items={faqItems} title={`Duvidas sobre o sistema para ${seg.label.toLowerCase()}`} />

      {/* Segmentos relacionados */}
      {related.length > 0 && (
        <section className="section pb-8">
          <h2 className="text-center text-sm font-bold uppercase tracking-wider text-slate-500">
            Tambem em {CATEGORY_LABELS[seg.category]}
          </h2>
          <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-3">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/${r.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-brand-300 hover:text-brand-700"
              >
                <Icon name={r.icon} className="h-4 w-4 text-brand-600" />
                {r.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="section py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-violet-700 px-8 py-16 text-center shadow-xl">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pronto para comecar?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-brand-100">
              Crie a conta da sua {seg.label.toLowerCase()} em menos de 2 minutos.
            </p>
            <Link href="/signup" className="btn-white mt-7 px-6 py-3 text-base">
              Criar conta gratis
              <Icon name="ArrowRight" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
