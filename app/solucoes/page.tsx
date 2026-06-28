import type { Metadata } from "next";
import { MarketingShell, PageHero } from "@/components/marketing/marketing-shell";
import { SolutionsDirectory } from "@/components/marketing/solutions-directory";

export const metadata: Metadata = {
  title: "Soluções",
  description:
    "Organize o financeiro, controle seus clientes, venda mais e reduza o trabalho manual. Veja como o GestorPro resolve os problemas do seu dia a dia.",
};

export default async function SolucoesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <MarketingShell>
      <PageHero
        eyebrow="Soluções"
        title="Resolvemos os problemas do seu dia a dia"
        description="Mais do que um sistema: uma forma de organizar, profissionalizar e crescer o seu negócio."
      />

      <SolutionsDirectory initialQuery={q?.trim() ?? ""} />
    </MarketingShell>
  );
}
