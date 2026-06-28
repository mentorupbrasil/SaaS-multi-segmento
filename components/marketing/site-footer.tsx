import Link from "next/link";
import { Logo } from "./logo";
import { Icon } from "@/components/icon";
import { CATEGORY_ORDER, CATEGORY_META } from "@/segments/types";
import { getSegmentGroupsForVitrine, getFeaturedSegments, getSegmentTotal } from "@/lib/segment-vitrine";

const PRODUTO = [
  { href: "/funcionalidades", label: "Funcionalidades" },
  { href: "/solucoes", label: "Soluções" },
  { href: "/segmentos", label: "Segmentos" },
  { href: "/precos", label: "Preços e planos" },
  { href: "/integracoes", label: "Integrações" },
];

const RECURSOS = [
  { href: "/blog", label: "Blog" },
  { href: "/suporte", label: "Central de ajuda" },
  { href: "/casos", label: "Casos de uso" },
  { href: "/segmentos", label: "Catálogo de segmentos" },
];

const EMPRESA = [
  { href: "/sobre", label: "Sobre nós" },
  { href: "/casos", label: "Histórias de clientes" },
  { href: "/suporte", label: "Contato" },
];

const CONFIANCA = [
  { href: "/integracoes", label: "Integrações" },
  { href: "/funcionalidades", label: "Recursos e segurança" },
  { href: "/termos", label: "Termos de uso" },
  { href: "/privacidade", label: "Privacidade" },
];

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm text-slate-400 transition-colors hover:text-white">
      {children}
    </Link>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <FooterLink href={l.href}>{l.label}</FooterLink>
          </li>
        ))}
      </ul>
    </div>
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
      {/* CTA final — padrão Notion/Monday */}
      <div className="border-b border-slate-800/80 bg-gradient-to-r from-brand-950/40 to-violet-950/30">
        <div className="section flex flex-col items-start justify-between gap-5 py-12 sm:flex-row sm:items-center">
          <div>
            <p className="text-xl font-bold text-white">Comece grátis hoje</p>
            <p className="mt-1 text-sm text-slate-400">
              Conta ativa na hora · A partir de R$ 39,90/mês · Sem fidelidade
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
            >
              Começar grátis
              <Icon name="ArrowRight" className="h-4 w-4" />
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
          <div className="lg:col-span-3">
            <Logo light />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              A plataforma de gestão que se adapta ao seu segmento — agenda, clientes, financeiro
              e equipe com a linguagem do seu negócio.
            </p>
            <Link
              href="/login"
              className="mt-5 inline-block text-sm font-medium text-slate-300 underline-offset-4 hover:text-white hover:underline"
            >
              Já tenho conta →
            </Link>
          </div>

          <div className="lg:col-span-2">
            <FooterColumn title="Produto" links={PRODUTO} />
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Segmentos
            </h3>
            <ul className="mt-4 space-y-2.5">
              {CATEGORY_ORDER.slice(0, 6).map((cat) => {
                const meta = CATEGORY_META[cat];
                const count = categoryCounts[cat];
                if (!count) return null;
                return (
                  <li key={cat}>
                    <Link
                      href={`/segmentos#${cat}`}
                      className="text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      {meta.label}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  href="/segmentos"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-brand-400 hover:text-brand-300"
                >
                  Todos ({total})
                  <Icon name="ArrowRight" className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <FooterColumn title="Recursos" links={RECURSOS} />
          </div>

          <div className="lg:col-span-3">
            <FooterColumn title="Empresa" links={EMPRESA} />
            <h3 className="mt-8 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Confiança
            </h3>
            <ul className="mt-4 space-y-2.5">
              {CONFIANCA.map((l) => (
                <li key={l.href + l.label}>
                  <FooterLink href={l.href}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

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

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            GestorPro &copy; {new Date().getFullYear()}. Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <FooterLink href="/termos">
              <span className="text-xs">Termos</span>
            </FooterLink>
            <FooterLink href="/privacidade">
              <span className="text-xs">Privacidade</span>
            </FooterLink>
            <FooterLink href="/login">
              <span className="text-xs">Entrar</span>
            </FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
