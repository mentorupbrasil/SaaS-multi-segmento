import Link from "next/link";
import { Logo } from "./logo";
import { Icon } from "@/components/icon";
import { CATEGORY_ORDER, CATEGORY_META } from "@/segments/types";
import { getSegmentGroupsForVitrine, getFeaturedSegments, getSegmentTotal } from "@/lib/segment-vitrine";

const PRODUTO = [
  { href: "/funcionalidades", label: "Funcionalidades" },
  { href: "/solucoes", label: "Soluções" },
  { href: "/segmentos", label: "Segmentos" },
  { href: "/precos", label: "Preços" },
  { href: "/integracoes", label: "Integrações" },
];

const EMPRESA = [
  { href: "/sobre", label: "Sobre nós" },
  { href: "/blog", label: "Blog" },
  { href: "/suporte", label: "Suporte" },
  { href: "/casos", label: "Casos de uso" },
];

const LEGAL = [
  { href: "/termos", label: "Termos de uso" },
  { href: "/privacidade", label: "Privacidade" },
];

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm text-slate-400 transition-colors hover:text-white"
    >
      {children}
    </Link>
  );
}

export function SiteFooter() {
  const groups = getSegmentGroupsForVitrine();
  const featured = getFeaturedSegments();
  const total = getSegmentTotal();

  const categoryCounts = Object.fromEntries(
    groups.map((g) => [g.category, g.segments.length]),
  ) as Record<string, number>;

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      {/* Faixa CTA */}
      <div className="border-b border-slate-800/80">
        <div className="section flex flex-col items-start justify-between gap-5 py-10 sm:flex-row sm:items-center">
          <div>
            <p className="text-lg font-semibold text-white">Comece a usar hoje</p>
            <p className="mt-1 text-sm text-slate-400">
              Conta ativa na hora · {total} segmentos · Sem fidelidade
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
            >
              Criar conta grátis
            </Link>
            <Link
              href="/precos"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-slate-500 hover:bg-slate-900"
            >
              Ver planos
            </Link>
          </div>
        </div>
      </div>

      <div className="section py-12 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Marca */}
          <div className="lg:col-span-4">
            <Logo light />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Plataforma de gestão que se adapta ao seu segmento — agenda, clientes, financeiro,
              equipe e módulos específicos do seu ramo.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-slate-300 underline-offset-4 hover:text-white hover:underline"
              >
                Já tenho conta
              </Link>
            </div>
          </div>

          {/* Produto */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Produto
            </h3>
            <ul className="mt-4 space-y-2.5">
              {PRODUTO.map((l) => (
                <li key={l.href}>
                  <FooterLink href={l.href}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Segmentos por área */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Segmentos
            </h3>
            <ul className="mt-4 space-y-2.5">
              {CATEGORY_ORDER.map((cat) => {
                const meta = CATEGORY_META[cat];
                const count = categoryCounts[cat];
                if (!count) return null;
                return (
                  <li key={cat}>
                    <Link
                      href={`/segmentos#${cat}`}
                      className="group flex items-center justify-between gap-2 text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      <span>{meta.label}</span>
                      <span className="rounded-full bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 group-hover:bg-slate-700 group-hover:text-slate-300">
                        {count}
                      </span>
                    </Link>
                  </li>
                );
              })}
              <li className="pt-1">
                <Link
                  href="/segmentos"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-brand-400 hover:text-brand-300"
                >
                  Catálogo completo
                  <Icon name="ArrowRight" className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Empresa */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Empresa
            </h3>
            <ul className="mt-4 space-y-2.5">
              {EMPRESA.map((l) => (
                <li key={l.href}>
                  <FooterLink href={l.href}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Populares */}
        <div className="mt-12 border-t border-slate-800 pt-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Segmentos populares
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {featured.map((seg) => (
              <Link
                key={seg.id}
                href={`/${seg.slug}`}
                className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:border-slate-700 hover:text-white"
              >
                {seg.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-10 flex flex-col gap-4 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            GestorPro &copy; {new Date().getFullYear()}. Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {LEGAL.map((l) => (
              <FooterLink key={l.href} href={l.href}>
                <span className="text-xs">{l.label}</span>
              </FooterLink>
            ))}
            <FooterLink href="/login">
              <span className="text-xs">Entrar</span>
            </FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
