import type { Metadata } from "next";
import { Pricing, PricingTrustBar } from "@/components/marketing/pricing";
import { Faq } from "@/components/marketing/faq";
import { CtaBand } from "@/components/marketing/cta-band";
import { MarketingShell, PageHero } from "@/components/marketing/marketing-shell";
import { PLANS } from "@/lib/plans";
import { getPricingFaqItems } from "@/lib/platform-faq";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Preços e planos",
  description:
    "Planos GestorPro: Inicial R$ 39,90 com integrações e relatórios · Profissional R$ 79,90. Sem fidelidade. PIX, boleto e cartão via Asaas.",
};

const starter = PLANS.find((p) => p.id === "starter")!;
const pro = PLANS.find((p) => p.id === "pro")!;

export default function PrecosPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Planos e preços"
        title={
          <>
            Tudo que você precisa por{" "}
            <span className="gradient-text">{formatCurrency(starter.priceMonthly!)}</span>
          </>
        }
        description={`Inicial ${formatCurrency(starter.priceMonthly!)} com módulos do segmento, WhatsApp, Google Agenda, pagamentos e relatórios · Profissional ${formatCurrency(pro.priceMonthly!)} para estoque e multi-unidade. Sem fidelidade.`}
        primaryCta={{ href: "/signup?plan=starter", label: "Assinar por R$ 39,90" }}
        secondaryCta={{ href: "/suporte", label: "Falar com vendas" }}
      />

      <PricingTrustBar />

      <Pricing showHeader={false} variant="premium" withComparison />

      <CtaBand
        variant="light"
        title="Comece completo, cresça no seu ritmo"
        description="O Inicial já inclui integrações, relatórios e todos os módulos do seu segmento. O Profissional adiciona estoque, OS e filiais ilimitadas."
        primaryHref="/signup?plan=starter"
        primaryLabel="Começar pelo Inicial"
        secondaryHref="/suporte"
        secondaryLabel="Tirar dúvidas"
      />

      <div className="border-t border-border bg-background">
        <Faq
          items={getPricingFaqItems()}
          title="Dúvidas sobre planos e cobrança"
          description="Limites reais de cada plano, pagamento Asaas e o que libera em cada upgrade."
        />
      </div>
    </MarketingShell>
  );
}
