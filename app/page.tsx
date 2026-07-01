import type { Metadata } from "next";
import { PLANS } from "@/lib/plans";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { HomeHero } from "@/components/marketing/home-hero";
import { SegmentsShowcase } from "@/components/marketing/segments-showcase";
import { IntegrationsShowcase } from "@/components/marketing/integrations-showcase";
import { Testimonials } from "@/components/marketing/testimonials";
import { LogosStrip } from "@/components/marketing/social-proof-strip";
import { HowItWorks } from "@/components/marketing/how-it-works";
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
      <LogosStrip />
      <SegmentsShowcase />
      <HowItWorks />
      <FeaturesShowcase />
      <SolutionsShowcase />
      <AiShowcase enabled={featureIaEnabled} />
      <IntegrationsShowcase />
      <Testimonials />
      <Faq
        groups={getHomeFaqGroups()}
        title="Perguntas frequentes"
        subtitle="Dúvidas"
        description="Planos, limites, pagamento e como o GestorPro se adapta ao seu segmento."
      />
      <SiteFooter />
    </div>
  );
}
