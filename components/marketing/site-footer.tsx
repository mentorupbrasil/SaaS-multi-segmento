import Link from "next/link";
import { Logo } from "./logo";
import { getSegmentGroups } from "@/segments";

const PRODUTO = [
  { href: "/funcionalidades", label: "Funcionalidades" },
  { href: "/solucoes", label: "Soluções" },
  { href: "/precos", label: "Preços" },
  { href: "/integracoes", label: "Integrações" },
  { href: "/demonstracao", label: "Demonstração" },
];

const EMPRESA = [
  { href: "/sobre", label: "Sobre" },
  { href: "/casos", label: "Clientes" },
  { href: "/blog", label: "Blog" },
  { href: "/suporte", label: "Suporte" },
];

export function SiteFooter() {
  const groups = getSegmentGroups();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="section py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-slate-500">
              A plataforma de gestão que entende o seu negócio. Agenda, clientes, financeiro e muito
              mais, adaptados ao seu segmento.
            </p>
            <Link href="/signup" className="btn-primary mt-5">
              Criar minha conta
            </Link>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Produto</h3>
            <ul className="mt-3 space-y-2">
              {PRODUTO.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-500 hover:text-brand-700">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Empresa</h3>
            <ul className="mt-3 space-y-2">
              {EMPRESA.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-500 hover:text-brand-700">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Segmentos</h3>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
              {groups.flatMap((g) => g.segments).slice(0, 10).map((seg) => (
                <li key={seg.id}>
                  <Link href={`/${seg.slug}`} className="text-sm text-slate-500 hover:text-brand-700">
                    {seg.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/segmentos" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
                  Ver todos
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-sm text-slate-400 sm:flex-row">
          <p>GestorPro &copy; {new Date().getFullYear()}. Todos os direitos reservados.</p>
          <div className="flex flex-wrap gap-5">
            <Link href="/termos" className="hover:text-slate-700">
              Termos de uso
            </Link>
            <Link href="/privacidade" className="hover:text-slate-700">
              Privacidade
            </Link>
            <Link href="/login" className="hover:text-slate-700">
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
