import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { getFeaturedSegments, getSegmentTotal } from "@/lib/segment-vitrine";
import { Icon } from "@/components/icon";
import { SegmentSearch } from "./segment-search";

export function SegmentsShowcase() {
  const featured = getFeaturedSegments();
  const total = getSegmentTotal();

  return (
    <section id="segmentos" className="border-b border-border bg-muted/30">
      <div className="section py-12 lg:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">Para o seu segmento</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Qual é o seu negócio?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Escolha o tipo que mais se aproxima do seu ramo — menus, nomenclatura e módulos já
            configurados.{" "}
            <strong className="font-semibold text-foreground">{total} segmentos</strong> prontos.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-xl">
          <SegmentSearch
            id="home-segment-search"
            size="large"
            label=""
            hint=""
            placeholder='Digite "restaurante", "clínica", "barbearia"...'
          />
        </div>

        <div className="mt-8">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <div>
                <p className="text-sm font-semibold text-foreground">Mais escolhidos</p>
                <p className="text-xs text-muted-foreground">Acesso direto aos segmentos mais usados</p>
              </div>
            </div>
            <Link
              href="/segmentos"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80"
            >
              Ver todos os {total} segmentos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {featured.map((seg) => (
              <Link
                key={seg.id}
                href={`/${seg.slug}`}
                className="group flex flex-col items-center rounded-2xl border border-border bg-card px-3 py-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary ring-1 ring-primary/20">
                  <Icon name={seg.icon} className="h-5 w-5" />
                </span>
                <span className="mt-2 line-clamp-2 text-xs font-semibold leading-tight text-foreground group-hover:text-primary">
                  {seg.label}
                </span>
              </Link>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Não encontrou o seu?{" "}
            <Link href="/segmentos" className="font-semibold text-primary hover:text-primary/80">
              Explore o catálogo completo por categoria →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
