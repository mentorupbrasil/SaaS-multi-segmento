import type { Metadata } from "next";
import { MarketingShell, PageHero } from "@/components/marketing/marketing-shell";
import { IntegrationsDirectory } from "@/components/marketing/integrations-directory";
import { CtaBand } from "@/components/marketing/cta-band";
import { getIntegrationTotal } from "@/lib/integrations";

export const metadata: Metadata = {
  title: "Integrações",
  description:
    "Conecte o GestorPro com WhatsApp, PIX, Asaas, Google Agenda, Mercado Pago, NF-e e mais. Todas as integrações disponíveis — ative em Conexões no painel.",
};

export default async function IntegracoesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const total = getIntegrationTotal();

  return (
    <MarketingShell>
      <PageHero
        eyebrow="Integrações"
        title="Tudo conectado ao seu fluxo de trabalho"
        description={`${total} integrações ativas — WhatsApp, pagamentos, agenda, fiscal e mais. Ative no painel Conexões conforme o seu plano.`}
        primaryCta={{ href: "/signup", label: "Assinar agora" }}
        secondaryCta={{ href: "/precos", label: "Ver planos" }}
      />

      <IntegrationsDirectory initialQuery={q?.trim() ?? ""} />

      <CtaBand
        title="Menos planilha, mais automação"
        description="Assine, abra Conexões no painel e ligue só o que o seu negócio precisa."
        primaryLabel="Começar agora"
        secondaryLabel="Central de ajuda"
        secondaryHref="/suporte"
      />
    </MarketingShell>
  );
}
