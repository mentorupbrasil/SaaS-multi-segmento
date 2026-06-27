import Link from "next/link";
import { Logo } from "./logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="section flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <Link href="/#segmentos" className="hover:text-slate-900">
            Segmentos
          </Link>
          <Link href="/#recursos" className="hover:text-slate-900">
            Recursos
          </Link>
          <Link href="/#precos" className="hover:text-slate-900">
            Precos
          </Link>
          <Link href="/#faq" className="hover:text-slate-900">
            Duvidas
          </Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/login" className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 sm:inline">
            Entrar
          </Link>
          <Link href="/signup" className="btn-primary">
            Comecar gratis
          </Link>
        </div>
      </div>
    </header>
  );
}
