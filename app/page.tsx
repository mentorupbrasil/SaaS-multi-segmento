import Link from "next/link";
import type { Metadata } from "next";
import { ALL_SEGMENTS } from "@/segments";
import { Icon } from "@/components/icon";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { HeroMockup } from "@/components/marketing/hero-mockup";
import { SegmentsShowcase } from "@/components/marketing/segments-showcase";
import { Testimonials } from "@/components/marketing/testimonials";
import { Pricing } from "@/components/marketing/pricing";
import { Faq } from "@/components/marketing/faq";

export const metadata: Metadata = {
  title: "GestorPro | O sistema de gestão sob medida para o seu segmento",
  description:
    "Plataforma completa de gestão que se adapta ao seu negócio: barbearia, salão, clínica, oficina, petshop, academia e muito mais. Agenda, clientes e financeiro. Teste 14 dias grátis.",
};

const FEATURES = [
  { icon: "Calendar", title: "Agenda inteligente", text: "Agendamentos, horários e status de atendimento em uma agenda clara e organizada." },
  { icon: "Users", title: "Clientes e CRM", text: "Cadastro completo, histórico de atendimentos e campos específicos do seu segmento." },
  { icon: "Wallet", title: "Financeiro e caixa", text: "Contas a pagar e a receber, fluxo de caixa e relatórios de faturamento." },
  { icon: "UserCog", title: "Equipe e permissões", text: "Adicione profissionais com papéis e níveis de acesso diferentes." },
  { icon: "Layers", title: "Adapta ao seu nicho", text: "Menus, nomes e módulos mudam conforme o segmento que você escolher." },
  { icon: "Smartphone", title: "Acesso de qualquer lugar", text: "Funciona no computador e no celular, na nuvem, sem instalar nada." },
];

const STEPS = [
  { icon: "Rocket", title: "Crie sua conta", text: "Cadastro em 2 minutos e escolha o segmento do seu negócio." },
  { icon: "Layers", title: "O sistema se adapta", text: "Tudo se personaliza para o seu nicho automaticamente." },
  { icon: "TrendingUp", title: "Organize e venda mais", text: "Gerencie agenda, clientes e caixa em um lugar só." },
];

const FAQ_ITEMS = [
  { q: "Preciso instalar algo?", a: "Não. O GestorPro funciona 100% online, no navegador do computador ou do celular. Seus dados ficam seguros na nuvem." },
  { q: "Serve para o meu tipo de negócio?", a: "Atendemos diversos segmentos e a plataforma é flexível para praticamente qualquer negócio que trabalhe com clientes, agenda, serviços e financeiro." },
  { q: "Como funciona o teste grátis?", a: "Você tem 14 dias gratuitos para testar tudo, sem precisar de cartão de crédito. Depois, basta assinar para continuar." },
  { q: "Posso cancelar quando quiser?", a: "Sim. Não há fidelidade. Você pode cancelar a assinatura a qualquer momento." },
  { q: "Meus dados ficam seguros?", a: "Sim. Cada negócio tem o ambiente isolado e os dados são protegidos, acessíveis apenas pela sua equipe." },
];

export default function HomePage() {
  return (
    <div className="bg-white">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="section relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="eyebrow">
              <Icon name="Sparkles" className="h-3.5 w-3.5" />
              Gestão para qualquer segmento
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              O sistema que fala a{" "}
              <span className="gradient-text">língua do seu negócio</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">
              Escolha o seu segmento e tenha uma plataforma sob medida: agenda, clientes, serviços e
              financeiro. Tudo adaptado ao seu nicho, a partir de R$ 39,90/mês.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="btn-primary px-6 py-3 text-base">
                Começar grátis por 14 dias
                <Icon name="ArrowRight" className="h-4 w-4" />
              </Link>
              <Link href="#segmentos" className="btn-secondary px-6 py-3 text-base">
                Ver segmentos
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="Check" className="h-4 w-4 text-green-600" /> Sem cartão de crédito
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="Check" className="h-4 w-4 text-green-600" /> Cancele quando quiser
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="Check" className="h-4 w-4 text-green-600" /> Suporte em português
              </span>
            </div>
          </div>
          <HeroMockup />
        </div>
      </section>

      {/* Faixa de confiança */}
      <section className="border-b border-slate-100 bg-slate-50/60">
        <div className="section grid grid-cols-2 gap-6 py-8 text-center sm:grid-cols-4">
          {[
            { n: `${ALL_SEGMENTS.length}+`, l: "Segmentos atendidos" },
            { n: "14 dias", l: "Grátis para testar" },
            { n: "R$ 39,90", l: "A partir de, por mês" },
            { n: "100%", l: "Online e na nuvem" },
          ].map((s) => (
            <div key={s.l}>
              <p className="text-2xl font-bold text-slate-900">{s.n}</p>
              <p className="mt-1 text-sm text-slate-500">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recursos */}
      <section id="recursos" className="section py-16">
        <div className="text-center">
          <span className="eyebrow">Recursos</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Tudo para gerenciar o seu negócio
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Os recursos essenciais, prontos para usar e adaptados ao seu segmento.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6 transition-shadow hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100">
                <Icon name={f.icon} className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section className="border-y border-slate-100 bg-slate-50/60">
        <div className="section py-16">
          <div className="text-center">
            <span className="eyebrow">Simples assim</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Comece em 3 passos
            </h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm ring-1 ring-slate-200">
                  <Icon name={s.icon} className="h-6 w-6" />
                </div>
                <span className="mt-4 inline-block text-xs font-bold uppercase tracking-wider text-brand-600">
                  Passo {i + 1}
                </span>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">{s.title}</h3>
                <p className="mx-auto mt-1.5 max-w-xs text-sm text-slate-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SegmentsShowcase />

      <div className="border-y border-slate-100 bg-slate-50/60">
        <Testimonials />
      </div>

      <Pricing />

      <Faq items={FAQ_ITEMS} />

      {/* CTA final */}
      <section className="section pb-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-violet-700 px-8 py-16 text-center shadow-xl">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pronto para organizar o seu negócio?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-brand-100">
              Crie sua conta grátis e veja o sistema se adaptar ao seu segmento em minutos.
            </p>
            <Link href="/signup" className="btn-white mt-7 px-6 py-3 text-base">
              Começar grátis agora
              <Icon name="ArrowRight" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
