import Link from "next/link";
import { Icon } from "@/components/icon";

interface CtaBandProps {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  variant?: "light" | "gradient";
}

export function CtaBand({
  title = "Pronto para organizar o seu negócio?",
  description = "Crie sua conta, escolha o plano e veja o sistema se adaptar ao seu segmento em minutos.",
  primaryHref = "/signup",
  primaryLabel = "Começar grátis",
  secondaryHref = "/precos",
  secondaryLabel = "Ver planos",
  variant = "gradient",
}: CtaBandProps) {
  if (variant === "light") {
    return (
      <section className="section py-10">
        <div className="flex flex-col items-center justify-between gap-5 rounded-2xl border border-slate-200 bg-slate-50/80 px-6 py-8 sm:flex-row">
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <p className="mt-1 max-w-lg text-sm text-slate-600">{description}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link href={secondaryHref} className="btn-secondary">
              {secondaryLabel}
            </Link>
            <Link href={primaryHref} className="btn-primary">
              {primaryLabel}
              <Icon name="ArrowRight" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section py-10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-violet-700 px-8 py-12 text-center shadow-xl">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-brand-100 sm:text-base">{description}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href={primaryHref} className="btn-white px-6 py-3 text-base">
              {primaryLabel}
              <Icon name="ArrowRight" className="h-4 w-4" />
            </Link>
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
