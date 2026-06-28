import Link from "next/link";
import type { Metadata } from "next";
import { getSegmentGroups } from "@/segments";
import { MarketingShell, PageHero } from "@/components/marketing/marketing-shell";
import { SegmentsDirectory } from "@/components/marketing/segments-directory";

export const metadata: Metadata = {
  title: "Segmentos atendidos",
  description:
    "Conheça todos os segmentos atendidos pelo GestorPro. Um sistema que se adapta ao seu negócio: beleza, saúde, automotivo, alimentação, serviços e educação.",
};

export default async function SegmentosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const groups = getSegmentGroups();
  const total = groups.reduce((acc, g) => acc + g.segments.length, 0);

  return (
    <MarketingShell>
      <PageHero
        eyebrow="Segmentos"
        title="Um sistema sob medida para o seu negócio"
        description={`Escolha o seu segmento e tudo se adapta: menus, nomenclatura, campos e módulos. ${total} segmentos organizados por área de atuação.`}
      />

      <SegmentsDirectory groups={groups} total={total} initialQuery={q?.trim() ?? ""} />

      <section className="section pb-16">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <h3 className="text-lg font-semibold text-slate-900">Não encontrou o seu segmento?</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
            A plataforma é flexível e atende praticamente qualquer negócio com clientes, agenda,
            serviços e financeiro.
          </p>
          <Link href="/signup" className="btn-primary mt-5">
            Criar minha conta
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
