import Link from "next/link";
import type { Metadata } from "next";
import { MarketingShell, PageHero } from "@/components/marketing/marketing-shell";
import { FeaturesDirectory } from "@/components/marketing/features-directory";

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

  return (
    <MarketingShell>
      <PageHero
        eyebrow="Funcionalidades"
        title="Tudo o que o seu negócio precisa, em um só lugar"
        description="Recursos essenciais prontos para usar e adaptados à linguagem do seu segmento."
      />

      <FeaturesDirectory initialQuery={q?.trim() ?? ""} />

      <section className="section pb-16">
        <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-violet-700 px-8 py-12 text-center text-white shadow-xl">
          <h2 className="text-2xl font-bold sm:text-3xl">Pronto para usar com a cara do seu negócio</h2>
          <p className="mx-auto mt-2 max-w-xl text-brand-100">
            Escolha o seu segmento e veja tudo isso adaptado automaticamente.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/signup" className="btn-white">
              Assinar agora
            </Link>
            <Link
              href="/precos"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Ver planos
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
