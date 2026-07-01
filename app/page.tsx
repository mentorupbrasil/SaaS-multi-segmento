import type { Metadata } from "next";
import { PLANS } from "@/lib/plans";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { HomeHero } from "@/components/marketing/home-hero";
import { SegmentsShowcase } from "@/components/marketing/segments-showcase";
import { IntegrationsShowcase } from "@/components/marketing/integrations-showcase";
import { SecurityShowcase } from "@/components/marketing/security-showcase";
import { Testimonials } from "@/components/marketing/testimonials";
import { StatsBar } from "@/components/marketing/stats-bar";
import { LogosStrip } from "@/components/marketing/social-proof-strip";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { CtaBand } from "@/components/marketing/cta-band";
import { FeaturesShowcase } from "@/components/marketing/features-showcase";
import { SolutionsShowcase } from "@/components/marketing/solutions-showcase";
import { AiShowcase } from "@/components/marketing/ai-showcase";
import { Faq } from "@/components/marketing/faq";
import { getHomeFaqGroups } from "@/lib/platform-faq";

export const metadata: Metadata = {
  title: "GestorPro | A plataforma de gestão que entende o seu negócio",
  description:
    "Sistema de gestão que se adapta ao seu segmento: barbearia, salão, clínica, oficina, petshop, academia e muito mais. Agenda, clientes, financeiro e equipe. Planos a partir de R$ 39,90/mês.",
};

const starterPrice = PLANS.find((p) => p.id === "starter")?.priceMonthly;

export default function HomePage() {
  const featureIaEnabled = process.env.FEATURE_IA === "true";

  return (
    <div className="bg-background">
      <SiteHeader />
      <HomeHero starterPrice={starterPrice ?? undefined} />
      <StatsBar />
      <LogosStrip />
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
      <div className="border-t border-border bg-muted/30">
        <Faq
          groups={getHomeFaqGroups()}
          title="Perguntas frequentes"
          description="Planos, limites, pagamento e como o GestorPro se adapta ao seu segmento."
        />
      </div>
      <SiteFooter />
    </div>
  );
}
