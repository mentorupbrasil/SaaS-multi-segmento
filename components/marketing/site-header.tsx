import Link from "next/link";
import { Logo } from "./logo";
import { SegmentsMenu } from "./segments-menu";
import { FeaturesMenu } from "./features-menu";
import { SolutionsMenu } from "./solutions-menu";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="section flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo />
          <MobileNav />
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
          <SegmentsMenu />
          <FeaturesMenu />
          <SolutionsMenu />
          <Link href="/precos" className="transition-colors hover:text-slate-900">
            Preços
          </Link>
          <Link href="/integracoes" className="transition-colors hover:text-slate-900">
            Integrações
          </Link>
          <Link href="/blog" className="transition-colors hover:text-slate-900">
            Blog
          </Link>
          <Link href="/suporte" className="transition-colors hover:text-slate-900">
            Suporte
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 sm:inline"
          >
            Entrar
          </Link>
          <Link href="/signup" className="btn-primary whitespace-nowrap">
            Começar grátis
          </Link>
        </div>
      </div>
    </header>
  );
}
