import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_SEGMENTS, getSegmentBySlug, CATEGORY_LABELS } from "@/segments";
import { MODULES } from "@/modules";
import { resolveTerms } from "@/lib/terms";
import { getSegmentExtras } from "@/lib/segment-capabilities";
import { formatCurrency, cn } from "@/lib/utils";
import { Icon } from "@/components/icon";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Pricing } from "@/components/marketing/pricing";
import { Faq } from "@/components/marketing/faq";
import { getSegmentLandingFaq } from "@/lib/platform-faq";
import { PlanModulesNotice } from "@/components/marketing/plan-modules-notice";

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


export default async function SegmentLandingPage({
  params,
}: {
  params: Promise<{ segment: string }>;
}) {
  const { segment } = await params;
  const seg = getSegmentBySlug(segment);
  if (!seg) notFound();

  const terms = resolveTerms(seg.id);

  // Rótulo de cada módulo adaptado ao nicho.
  const moduleLabel: Record<string, string> = {
    clients: terms.customer_plural,
    scheduling: terms.appointment_plural,
    services: terms.service_plural,
    work_orders: terms.work_order_plural ?? "Ordens de Serviço",
    records: terms.records ?? "Prontuário",
    financial: "Financeiro",
    team: "Equipe",
    inventory: terms.inventory ?? "Estoque",
  };

  // Descrição de cada módulo usando a nomenclatura exata do segmento.
  const moduleDescription: Record<string, string> = {
    clients: `Cadastro de ${terms.customer_plural.toLowerCase()} com histórico, contato e campos próprios do seu segmento.`,
    scheduling: `Agenda por ${terms.professional.toLowerCase()}, com horários, status e lembretes que reduzem faltas.`,
    services: `Tabela de ${terms.service_plural.toLowerCase()} e preços, pronta para usar no atendimento e no caixa.`,
    work_orders: `${terms.work_order_plural ?? "Ordens de serviço"} do início ao fim, com itens, valores e histórico.`,
    records: `${terms.records ?? "Prontuário"} por ${terms.customer.toLowerCase()}, com anotações e histórico organizados e seguros.`,
    financial: "Caixa, contas a pagar e a receber, fluxo de caixa e relatórios de faturamento.",
    team: `Cadastro de ${terms.professional_plural.toLowerCase()} com papéis e permissões de acesso.`,
    inventory: `${terms.inventory ?? "Estoque"} com entrada, saída, inventário e alerta de estoque mínimo.`,
  };

  // Mapeamento de nomenclatura (padrão -> termo do segmento).
  const nomenclature: { base: string; value: string }[] = [
    { base: "Clientes", value: terms.customer_plural },
    { base: "Profissionais", value: terms.professional_plural },
    { base: "Serviços", value: terms.service_plural },
  ];
  if (seg.modules.includes("scheduling")) {
    nomenclature.push({ base: "Agenda", value: terms.appointment_plural });
  }

  const related = ALL_SEGMENTS.filter(
    (s) => s.category === seg.category && s.id !== seg.id,
  ).slice(0, 3);

  const extras = getSegmentExtras(seg.category);

  const faqItems = getSegmentLandingFaq(seg);

  return (
    <div className="bg-card">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="section relative grid items-center gap-12 py-16 lg:grid-cols-2">
          <div>
            <span className="eyebrow">
              <Icon name={seg.icon} className="h-3.5 w-3.5" />
              {CATEGORY_LABELS[seg.category]}
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              {seg.seo.headline}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">{seg.seo.subheadline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="btn-primary px-6 py-3 text-base">
                Assinar agora
                <Icon name="ArrowRight" className="h-4 w-4" />
              </Link>
              <Link href="#precos" className="btn-secondary px-6 py-3 text-base">
                Ver planos
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="Check" className="h-4 w-4 text-green-600" /> Cadastro em minutos
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="Check" className="h-4 w-4 text-green-600" /> Sem fidelidade
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="Check" className="h-4 w-4 text-green-600" /> Pagamento seguro via Asaas
              </span>
            </div>
          </div>

          {/* Card de benefícios */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand-200/40 via-brand-200/40 to-brand-300/40 blur-2xl" />
            <div className="relative rounded-2xl border border-border bg-card p-7 shadow-2xl shadow-black/10/40">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 text-white">
                  <Icon name={seg.icon} className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-semibold text-foreground">{seg.label}</p>
                  <p className="text-sm text-muted-foreground">{seg.tagline}</p>
                </div>
              </div>
              <ul className="mt-6 space-y-3">
                {seg.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-foreground">
                    <Icon name="BadgeCheck" className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    {b}
                  </li>
                ))}
              </ul>
              <PlanModulesNotice className="mt-5" />
            </div>
          </div>
        </div>
      </section>

      {/* Módulos do nicho */}
      <section className="section py-16">
        <div className="text-center">
          <span className="eyebrow">O que está incluso</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {seg.label}: módulos do seu nicho
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Módulos prontos com os nomes do seu segmento — a liberação depende do plano contratado.
          </p>
        </div>
        <PlanModulesNotice className="mx-auto mt-8 max-w-3xl" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {seg.modules.map((id) => {
            const mod = MODULES[id];
            if (!mod) return null;
            return (
              <div key={id} className="card p-6 transition-shadow hover:shadow-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary ring-1 ring-primary/20">
                  <Icon name={mod.nav[0]?.icon ?? "Tag"} className="h-5 w-5" />
                </div>
                <h3 className="mt-4 flex items-center gap-2 font-semibold text-foreground">
                  {moduleLabel[id] ?? mod.name}
                  {mod.comingSoon && (
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                      em breve
                    </span>
                  )}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {moduleDescription[id] ?? mod.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Funcionalidades essenciais (catálogo da categoria) */}
      <section className="border-t border-border bg-muted/40">
        <div className="section py-16">
          <div className="text-center">
            <span className="eyebrow">Funcionalidades</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Um sistema completo para {CATEGORY_LABELS[seg.category].toLowerCase()}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{extras.intro}</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="Check" className="h-4 w-4 text-primary" /> Disponível
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="Clock" className="h-4 w-4 text-muted-foreground/80" /> No roadmap
              </span>
            </div>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {extras.groups.map((group) => (
              <div key={group.id} className="card p-6">
                <h3 className="flex items-center gap-2 font-semibold text-foreground">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 text-primary ring-1 ring-primary/20">
                    <Icon name={group.icon} className="h-5 w-5" />
                  </span>
                  {group.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((it) => (
                    <li key={it.label} className="flex items-start gap-2 text-sm">
                      <Icon
                        name={it.status === "available" ? "Check" : "Clock"}
                        className={cn(
                          "mt-0.5 h-4 w-4 shrink-0",
                          it.status === "available" ? "text-primary" : "text-muted-foreground/80",
                        )}
                      />
                      <span className={it.status === "available" ? "text-foreground" : "text-muted-foreground"}>
                        {it.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personalizado para o segmento */}
      <section className="border-y border-border bg-card">
        <div className="section py-16">
          <div className="text-center">
            <span className="eyebrow">Já vem pronto</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Configurado para {seg.label.toLowerCase()}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Ao escolher o seu segmento, a plataforma se adapta automaticamente — sem configuração técnica.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {/* Nomenclatura */}
            <div className="card p-6">
              <h3 className="flex items-center gap-2 font-semibold text-foreground">
                <Icon name="Languages" className="h-5 w-5 text-primary" />
                A linguagem do seu negócio
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Os menus e telas usam os termos que você já fala no dia a dia.
              </p>
              <ul className="mt-4 space-y-2.5">
                {nomenclature.map((n) => (
                  <li key={n.base} className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">{n.base}</span>
                    <Icon name="ArrowRight" className="h-3.5 w-3.5 text-muted-foreground/80" />
                    <span className="font-semibold text-foreground">{n.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Serviços padrão */}
            <div className="card p-6">
              <h3 className="flex items-center gap-2 font-semibold text-foreground">
                <Icon name="Tag" className="h-5 w-5 text-primary" />
                {terms.service_plural} já cadastrados
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Você começa com exemplos prontos e ajusta como quiser.
              </p>
              <ul className="mt-4 space-y-2.5">
                {(seg.defaultServices ?? []).map((s) => (
                  <li key={s.name} className="flex items-center justify-between gap-2 text-sm">
                    <span className="text-foreground">{s.name}</span>
                    <span className="font-medium text-foreground">
                      {s.price > 0 ? formatCurrency(s.price) : "—"}
                      {s.durationMin > 0 && (
                        <span className="ml-1 text-xs text-muted-foreground">· {s.durationMin}min</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ficha de cadastro */}
            <div className="card p-6">
              <h3 className="flex items-center gap-2 font-semibold text-foreground">
                <Icon name="ClipboardList" className="h-5 w-5 text-primary" />
                Ficha de {terms.customer.toLowerCase()}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Além de nome, telefone e e-mail, o cadastro inclui campos do seu segmento.
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                <li className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">Nome</li>
                <li className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">Telefone</li>
                <li className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">E-mail</li>
                {(seg.customerFields ?? []).map((f) => (
                  <li
                    key={f.key}
                    className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/20"
                  >
                    {f.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Recursos premium */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="section relative py-16">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-card/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-200">
              <Icon name="Sparkles" className="h-3.5 w-3.5" /> Recursos premium
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              O que torna o sistema referência
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground/80">
              Recursos avançados, em evolução contínua, para levar o seu negócio a outro nível.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {extras.premium.map((group) => (
              <div key={group.id} className="rounded-2xl border border-white/10 bg-card/5 p-6">
                <h3 className="flex items-center gap-2 font-semibold">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-card/10 text-brand-200">
                    <Icon name={group.icon} className="h-5 w-5" />
                  </span>
                  {group.title}
                </h3>
                <ul className="mt-4 space-y-2">
                  {group.items.map((it) => (
                    <li key={it.label} className="flex items-start gap-2 text-sm text-muted-foreground/80">
                      <Icon name="Sparkles" className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
                      {it.label}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="section py-16">
        <div className="text-center">
          <span className="eyebrow">Diferenciais</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Pensado para ser o melhor do setor
          </h2>
        </div>
        <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2">
          {extras.differentials.map((d) => (
            <div key={d} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <Icon name="BadgeCheck" className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span className="text-sm font-medium text-foreground">{d}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboards e integrações */}
      <section className="border-y border-border bg-muted/40">
        <div className="section grid gap-10 py-16 lg:grid-cols-2">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
              <Icon name="BarChart3" className="h-6 w-6 text-primary" />
              Dashboards e indicadores
            </h2>
            <p className="mt-2 text-muted-foreground">
              Acompanhe os números que importam para decidir com segurança.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {extras.dashboards.map((d) => (
                <li
                  key={d}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground"
                >
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
              <Icon name="Plug" className="h-6 w-6 text-primary" />
              Integrações
            </h2>
            <p className="mt-2 text-muted-foreground">
              Conecte o sistema com as ferramentas que você já usa. WhatsApp e PIX exigem plano
              Profissional+ e configuração em Conexões.
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {extras.integrations.map((i) => (
                <li key={i.label} className="flex items-center gap-2 rounded-xl border border-border bg-card p-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Icon name={i.icon} className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-medium text-foreground">{i.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="section py-16">
        <div className="text-center">
          <span className="eyebrow">Simples assim</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Comece em 3 passos
          </h2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            { icon: "Rocket", t: "Crie sua conta", d: `Cadastro rápido escolhendo "${seg.label}".` },
            { icon: "Layers", t: "Sistema personalizado", d: "Menus e termos do seu nicho já configurados." },
            { icon: "TrendingUp", t: "Gerencie e cresça", d: "Agenda, clientes e caixa em um lugar só." },
          ].map((s, i) => (
            <div key={s.t} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-card text-primary shadow-sm ring-1 ring-border">
                <Icon name={s.icon} className="h-6 w-6" />
              </div>
              <span className="mt-4 inline-block text-xs font-bold uppercase tracking-wider text-primary">
                Passo {i + 1}
              </span>
              <h3 className="mt-1 text-lg font-semibold text-foreground">{s.t}</h3>
              <p className="mx-auto mt-1.5 max-w-xs text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-border bg-muted/40">
        <Pricing />
      </div>

      <Faq
          items={faqItems}
          title={`Dúvidas sobre ${seg.label}`}
          description="Perguntas do nicho e o que cada plano libera para o seu segmento."
        />

      {/* Segmentos relacionados */}
      {related.length > 0 && (
        <section className="section pb-8">
          <h2 className="text-center text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Também em {CATEGORY_LABELS[seg.category]}
          </h2>
          <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-3">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/${r.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand-300 hover:text-primary"
              >
                <Icon name={r.icon} className="h-4 w-4 text-primary" />
                {r.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="section py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 px-8 py-16 text-center shadow-xl">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pronto para começar?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-brand-100">
              Crie a sua conta e comece a usar em menos de 2 minutos.
            </p>
            <Link href="/signup" className="btn-white mt-7 px-6 py-3 text-base">
              Assinar agora
              <Icon name="ArrowRight" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
