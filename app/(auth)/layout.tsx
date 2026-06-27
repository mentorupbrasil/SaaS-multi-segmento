import Link from "next/link";
import { Logo } from "@/components/marketing/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-violet-50">
      <header className="section flex h-16 items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/login" className="font-medium text-slate-600 hover:text-slate-900">
            Entrar
          </Link>
          <Link href="/signup" className="btn-primary">
            Criar conta
          </Link>
        </nav>
      </header>
      <main className="section flex items-center justify-center py-10">{children}</main>
    </div>
  );
}
