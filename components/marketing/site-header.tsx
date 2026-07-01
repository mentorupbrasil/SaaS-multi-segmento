import Link from "next/link";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { DesktopNav } from "./desktop-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { ScrollProgress } from "@/components/scroll-progress";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <>
      <ScrollProgress />
      <header className="glass sticky top-0 z-50">
        <div className="section flex h-16 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Logo />
            <MobileNav />
          </div>

          <div className="hidden flex-1 justify-center px-4 lg:flex">
            <DesktopNav />
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <ThemeToggle compact className="sm:hidden" />
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
