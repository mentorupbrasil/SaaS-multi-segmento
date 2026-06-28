import type { Metadata } from "next";
import { MarketingShell, PageHero } from "@/components/marketing/marketing-shell";
import { FeaturesDirectory } from "@/components/marketing/features-directory";
import { CtaBand } from "@/components/marketing/cta-band";
import { getFeatureGroups, getFeatureTotal } from "@/lib/feature-vitrine";

export const metadata: Metadata = {
  title: "Funcionalidades",
  description:
    "Conheça as funcionalidades do GestorPro: clientes, agenda, financeiro, equipe, relatórios e muito mais — tudo adaptado ao seu segmento.",
};

export default async function FuncionalidadesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const total = getFeatureTotal();
  const groups = getFeatureGroups();

  return (
    <MarketingShell>
      <PageHero
        eyebrow="Funcionalidades"
        title="Tudo o que o seu negócio precisa, em um só lugar"
        description={`${total} recursos em ${groups.length} categorias — prontos para usar e adaptados à linguagem do seu segmento.`}
        primaryCta={{ href: "/signup", label: "Assinar agora" }}
        secondaryCta={{ href: "/precos", label: "Ver planos" }}
      />

      <FeaturesDirectory initialQuery={q?.trim() ?? ""} />

      <CtaBand
        title="Pronto para usar com a cara do seu negócio?"
        description="Escolha o seu segmento e veja todas essas funcionalidades adaptadas automaticamente."
        primaryLabel="Assinar agora"
        secondaryLabel="Explorar segmentos"
        secondaryHref="/segmentos"
      />
    </MarketingShell>
  );
}
