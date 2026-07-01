import Link from "next/link";
import { Logo } from "@/components/marketing/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="section-glow pointer-events-none absolute inset-0" />

      <header className="section relative flex h-16 items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <Link
            href="/login"
            className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            Entrar
          </Link>
          <Button asChild size="sm">
            <Link href="/signup">Criar conta</Link>
          </Button>
        </nav>
      </header>

      <main className="section relative flex items-center justify-center py-10">
        <FadeIn className="w-full">{children}</FadeIn>
      </main>
    </div>
  );
}
