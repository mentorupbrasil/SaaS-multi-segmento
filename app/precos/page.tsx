import type { Metadata } from "next";
import { Pricing, PricingTrustBar } from "@/components/marketing/pricing";
import { Faq } from "@/components/marketing/faq";
import { CtaBand } from "@/components/marketing/cta-band";
import { MarketingShell, PageHero } from "@/components/marketing/marketing-shell";
import { PLANS } from "@/lib/plans";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Preços e planos",
  description:
    "Planos do GestorPro a partir de R$ 39,90/mês. Sem fidelidade. PIX, boleto e cartão. Escolha o plano ideal para o seu negócio.",
};

const starter = PLANS.find((p) => p.id === "starter")!;

function buildPricingFaq() {
  const billingConfigured = Boolean(process.env.ASAAS_API_KEY?.trim());
  return [
    {
      q: "Posso trocar de plano depois?",
      a: "Sim. Você pode subir ou descer de plano quando quiser, direto na área de assinatura da sua conta.",
    },
    {
      q: "Tem fidelidade ou multa de cancelamento?",
      a: "Não. A cobrança é mensal e você cancela quando quiser, sem multa. O acesso permanece até o fim do período já pago.",
    },
    {
      q: "Como funciona o plano Enterprise?",
      a: "O Enterprise é sob medida para redes e franquias. Fale com o nosso time para um orçamento e onboarding personalizados.",
    },
    {
      q: "Quais formas de pagamento?",
      a: billingConfigured
        ? "Aceitamos PIX, boleto e cartão via Asaas. Após o cadastro, você conclui o pagamento e o acesso é liberado na confirmação."
        : "PIX, boleto e cartão via Asaas. O pagamento é feito após o cadastro, na área de assinatura.",
    },
    {
      q: "O plano Inicial inclui tudo do meu segmento?",
      a: "O Inicial cobre o essencial: agenda, clientes, serviços, financeiro, caixa e equipe (até 2 usuários). Módulos avançados do segmento — como PDV, pets, turmas ou orçamentos — liberam no Profissional. Estoque e ordens de serviço ficam no Premium.",
    },
  ];
}

export default function PrecosPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Planos e preços"
        title={
          <>
            Um plano para cada fase do{" "}
            <span className="gradient-text">seu negócio</span>
          </>
        }
        description={`A partir de ${formatCurrency(starter.priceMonthly!)} por mês. Sem fidelidade, sem surpresas — escolha o plano, assine e comece a organizar sua operação.`}
        primaryCta={{ href: "/signup", label: "Assinar agora" }}
        secondaryCta={{ href: "/suporte", label: "Falar com vendas" }}
      />

      <PricingTrustBar />

      <Pricing showHeader={false} variant="premium" withComparison />

      <CtaBand
        variant="light"
        title="Ainda em dúvida qual plano escolher?"
        description="Comece pelo Inicial e suba quando precisar. Você troca de plano a qualquer momento, sem burocracia."
        primaryHref="/signup"
        primaryLabel="Começar agora"
        secondaryHref="/suporte"
        secondaryLabel="Tirar dúvidas"
      />

      <div className="border-t border-slate-100 bg-white">
        <Faq items={buildPricingFaq()} title="Dúvidas sobre planos e cobrança" />
      </div>
    </MarketingShell>
  );
}
