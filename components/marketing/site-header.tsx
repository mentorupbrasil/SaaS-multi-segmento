import Link from "next/link";
import { Logo } from "./logo";
import { SegmentsMenu } from "./segments-menu";
import { FeaturesMenu } from "./features-menu";
import { SolutionsMenu } from "./solutions-menu";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { ScrollProgress } from "@/components/scroll-progress";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <>
      <ScrollProgress />
      <header className="glass sticky top-0 z-50">
        <div className="section flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo />
            <MobileNav />
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground lg:flex" aria-label="Principal">
            <SegmentsMenu />
            <FeaturesMenu />
            <SolutionsMenu />
            <Link href="/precos" className="transition-colors hover:text-foreground">
              Preços
            </Link>
            <Link href="/integracoes" className="transition-colors hover:text-foreground">
              Integrações
            </Link>
            <Link href="/blog" className="transition-colors hover:text-foreground">
              Blog
            </Link>
            <Link href="/suporte" className="transition-colors hover:text-foreground">
              Suporte
            </Link>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle className="hidden sm:inline-flex" />
            <Link
              href="/login"
              className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline"
            >
              Entrar
            </Link>
            <Button asChild size="sm" className="whitespace-nowrap">
              <Link href="/signup">Assinar agora</Link>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
