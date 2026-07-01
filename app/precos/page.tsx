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
    "Planos GestorPro: Inicial R$ 39,90, Profissional R$ 79,90 e Premium R$ 149,90/mês. Sem fidelidade. PIX, boleto e cartão via Asaas.",
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
            Do essencial ao completo —{" "}
            <span className="gradient-text">sem pagar a mais</span>
          </>
        }
        description={`Inicial ${formatCurrency(starter.priceMonthly!)} · Profissional ${formatCurrency(pro.priceMonthly!)} · Premium ${formatCurrency(PLANS.find((p) => p.id === "premium")!.priceMonthly!)}. Sem fidelidade. Escolha o que cabe na sua fase e faça upgrade quando crescer.`}
        primaryCta={{ href: "/signup", label: "Assinar agora" }}
        secondaryCta={{ href: "/suporte", label: "Falar com vendas" }}
      />

      <PricingTrustBar />

      <Pricing showHeader={false} variant="premium" withComparison />

      <CtaBand
        variant="light"
        title="Comece enxuto, cresça no seu ritmo"
        description="O Inicial cobre agenda e caixa. O Profissional libera todo o segmento. O Premium adiciona estoque, OS e filiais. Troque de plano em Assinatura, sem burocracia."
        primaryHref="/signup"
        primaryLabel="Começar pelo Inicial"
        secondaryHref="/suporte"
        secondaryLabel="Tirar dúvidas"
      />

      <div className="border-t border-slate-100 bg-white">
        <Faq
          items={getPricingFaqItems()}
          title="Dúvidas sobre planos e cobrança"
          description="Limites reais de cada plano, pagamento Asaas e o que libera em cada upgrade."
        />
      </div>
    </MarketingShell>
  );
}
