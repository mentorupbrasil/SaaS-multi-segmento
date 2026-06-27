import Link from "next/link";
import { Logo } from "./logo";
import { getSegmentGroups } from "@/segments";

export function SiteFooter() {
  const groups = getSegmentGroups();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="section py-14">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_3fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-slate-500">
              Uma plataforma que se adapta ao seu segmento. Agenda, clientes, financeiro e muito
              mais, do jeito do seu negocio.
            </p>
            <Link href="/signup" className="btn-primary mt-5">
              Criar conta gratis
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {groups.slice(0, 3).map((group) => (
              <div key={group.category}>
                <h3 className="text-sm font-semibold text-slate-900">{group.label}</h3>
                <ul className="mt-3 space-y-2">
                  {group.segments.map((seg) => (
                    <li key={seg.id}>
                      <Link
                        href={`/${seg.slug}`}
                        className="text-sm text-slate-500 hover:text-brand-700"
                      >
                        {seg.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-sm text-slate-400 sm:flex-row">
          <p>GestorPro &copy; {new Date().getFullYear()}. Todos os direitos reservados.</p>
          <div className="flex gap-5">
            <Link href="/login" className="hover:text-slate-700">
              Entrar
            </Link>
            <Link href="/signup" className="hover:text-slate-700">
              Criar conta
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
