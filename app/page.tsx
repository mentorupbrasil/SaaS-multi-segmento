import Link from "next/link";
import { ALL_SEGMENTS } from "@/segments";
import { PLANS } from "@/lib/plans";
import { Icon } from "@/components/icon";
import { formatCurrency } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="text-lg font-bold text-brand-700">SaaS Multi-Segmento</span>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/login" className="text-slate-600 hover:text-slate-900">
            Entrar
          </Link>
          <Link href="/signup" className="btn-primary">
            Comecar gratis
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Um sistema que fala a lingua do seu negocio
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
          Escolha o seu segmento e tenha uma plataforma sob medida: agenda, clientes, servicos e
          financeiro. Tudo adaptado ao seu nicho, por R$ 39,90/mes.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/signup" className="btn-primary px-6 py-3 text-base">
            Criar conta gratis
          </Link>
          <Link href="/login" className="btn-secondary px-6 py-3 text-base">
            Ja sou cliente
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">
          Feito para o seu segmento
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ALL_SEGMENTS.map((seg) => (
            <Link
              key={seg.id}
              href={`/${seg.slug}`}
              className="card flex flex-col items-center gap-3 p-6 text-center transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50">
                <Icon name={seg.icon} className="h-6 w-6 text-brand-600" />
              </div>
              <span className="font-semibold text-slate-900">{seg.label}</span>
              <span className="text-sm text-slate-500">{seg.tagline}</span>
            </Link>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
          E muitos outros nichos: clinica, restaurante, academia, imobiliaria, petshop e mais.
        </p>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">Planos simples</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {PLANS.map((plan) => (
              <div key={plan.id} className="card p-6">
                <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                <p className="mt-2">
                  <span className="text-3xl font-bold">{formatCurrency(plan.priceMonthly)}</span>
                  <span className="text-sm text-slate-500">/mes</span>
                </p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                      <Icon name="Check" className="h-4 w-4 text-green-600" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-slate-400">
        SaaS Multi-Segmento &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
