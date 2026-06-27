import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-100">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-lg font-bold text-brand-700">
          SaaS Multi-Segmento
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/login" className="text-slate-600 hover:text-slate-900">
            Entrar
          </Link>
          <Link href="/signup" className="font-medium text-brand-700 hover:text-brand-800">
            Criar conta
          </Link>
        </nav>
      </header>
      <main className="mx-auto flex max-w-6xl items-center justify-center px-6 py-10">
        {children}
      </main>
    </div>
  );
}
