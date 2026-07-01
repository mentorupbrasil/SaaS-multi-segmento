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
      <header className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="section">
          <div className="flex h-16 items-center gap-6 lg:gap-8">
            <Logo />
            <DesktopNav />

            <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
              <ThemeToggle compact className="sm:hidden" />
              <ThemeToggle className="hidden sm:inline-flex" />
              <Link
                href="/login"
                className="hidden text-sm font-normal text-muted-foreground transition-colors hover:text-foreground sm:inline"
              >
                Entrar
              </Link>
              <Button asChild size="sm" className="whitespace-nowrap rounded-lg">
                <Link href="/signup">Assinar agora</Link>
              </Button>
              <MobileNav />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
