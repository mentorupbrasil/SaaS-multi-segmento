import Link from "next/link";
import type { Metadata } from "next";
import { PLANS } from "@/lib/plans";
import { Icon } from "@/components/icon";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { HeroMockup } from "@/components/marketing/hero-mockup";
import { SegmentsShowcase } from "@/components/marketing/segments-showcase";
import { IntegrationsShowcase } from "@/components/marketing/integrations-showcase";
import { SecurityShowcase } from "@/components/marketing/security-showcase";
import { Testimonials } from "@/components/marketing/testimonials";
import { StatsBar } from "@/components/marketing/stats-bar";
import { SocialProofStrip } from "@/components/marketing/social-proof-strip";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { CtaBand } from "@/components/marketing/cta-band";
import { FeaturesShowcase } from "@/components/marketing/features-showcase";
import { SolutionsShowcase } from "@/components/marketing/solutions-showcase";
import { AiShowcase } from "@/components/marketing/ai-showcase";

export const metadata: Metadata = {
  title: "GestorPro | A plataforma de gestão que entende o seu negócio",
  description:
    "Sistema de gestão que se adapta ao seu segmento: barbearia, salão, clínica, oficina, petshop, academia e muito mais. Agenda, clientes, financeiro e equipe. Planos a partir de R$ 39,90/mês.",
};

const starterPrice = PLANS.find((p) => p.id === "starter")?.priceMonthly;

export default function HomePage() {
  const featureIaEnabled = process.env.FEATURE_IA === "true";

  return (
    <div className="bg-white">
      <SiteHeader />

      {/* Hero — outcome + dual CTA (Notion / ClickUp) */}
      <section className="relative overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="section relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="eyebrow">
              <Icon name="Sparkles" className="h-3.5 w-3.5" />
              Gestão sob medida para o seu ramo
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem]">
              Tudo o que o seu negócio precisa,{" "}
              <span className="gradient-text">em um só lugar</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              Escolha o seu segmento e tenha agenda, clientes, serviços e financeiro com a linguagem
              do seu nicho. Conta ativa na hora
              {starterPrice != null ? `, a partir de R$ ${starterPrice.toFixed(2).replace(".", ",")}/mês` : ""}.
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
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="Check" className="h-4 w-4 text-green-600" /> A partir de R$ 39,90/mês
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

      <StatsBar />
      <SocialProofStrip />

      {/* Segmentos — busca + populares (Asana use-case tiles) */}
      <SegmentsShowcase />

      <HowItWorks />

      <FeaturesShowcase />

      <CtaBand
        variant="light"
        title="Escolha seu plano e comece hoje"
        description="Assine em minutos e veja o sistema se adaptar ao seu segmento."
      />

      <SolutionsShowcase />

      <AiShowcase enabled={featureIaEnabled} />

      <IntegrationsShowcase />
      <SecurityShowcase />
      <Testimonials />

      <CtaBand
        title="Organize o seu negócio hoje"
        description="Escolha o segmento, assine o plano e comece a operar com agenda, clientes e financeiro prontos."
      />

      <SiteFooter />
    </div>
  );
}
