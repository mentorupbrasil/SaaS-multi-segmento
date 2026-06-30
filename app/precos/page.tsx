import type { Metadata } from "next";
import { Pricing } from "@/components/marketing/pricing";
import { Faq } from "@/components/marketing/faq";
import { MarketingShell, PageHero } from "@/components/marketing/marketing-shell";

export const metadata: Metadata = {
  title: "Preços e planos",
  description:
    "Planos do GestorPro a partir de R$ 39,90/mês. Sem fidelidade, conta ativa na hora. Escolha o plano ideal para o seu negócio.",
};

function buildPricingFaq() {
  const billingConfigured = Boolean(process.env.ASAAS_API_KEY?.trim());
  return [
    {
      q: "Posso trocar de plano depois?",
      a: "Sim. Você pode subir ou descer de plano quando quiser, direto nas configurações da sua conta.",
    },
    {
      q: "Tem fidelidade ou multa de cancelamento?",
      a: "Não. A cobrança é mensal e você cancela quando quiser, sem multa.",
    },
    {
      q: "Como funciona o plano Enterprise?",
      a: "O Enterprise é sob medida para redes e franquias. Fale com o nosso time para um orçamento e onboarding personalizados.",
    },
    {
      q: "Quais formas de pagamento?",
      a: billingConfigured
        ? "Aceitamos PIX, boleto e cartão via Asaas. A confirmação do pagamento é automática após a aprovação."
        : "PIX, boleto e cartão via Asaas. Configure a integração em produção para cobrança automática.",
    },
  ];
}

export default function PrecosPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Planos"
        title="Preços simples e transparentes"
        description="Comece a usar na hora. Sem fidelidade — mude de plano ou cancele quando quiser."
      />
      <Pricing />
      <div className="border-t border-slate-100 bg-slate-50/60">
        <Faq items={buildPricingFaq()} title="Dúvidas sobre planos" />
      </div>
    </MarketingShell>
  );
}
