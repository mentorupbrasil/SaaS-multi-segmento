import Link from "next/link";
import { Logo } from "./logo";
import { SegmentsMenu } from "./segments-menu";
import { FeaturesMenu } from "./features-menu";
import { SolutionsMenu } from "./solutions-menu";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="section flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
          <SegmentsMenu />
          <FeaturesMenu />
          <SolutionsMenu />
          <Link href="/precos" className="hover:text-slate-900">
            Preços
          </Link>
          <Link href="/blog" className="hover:text-slate-900">
            Blog
          </Link>
          <Link href="/suporte" className="hover:text-slate-900">
            Suporte
          </Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 sm:inline"
          >
            Entrar
          </Link>
          <Link href="/signup" className="btn-primary">
            Assinar agora
          </Link>
        </div>
      </div>
    </header>
  );
}
