import Link from "next/link";
import { Icon } from "@/components/icon";
import { PLANS } from "@/lib/plans";
import { formatCurrency } from "@/lib/utils";

interface CtaBandProps {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  variant?: "light" | "featured";
}

const starterPrice = PLANS.find((p) => p.id === "starter")?.priceMonthly;

export function CtaBand({
  title = "Pronto para organizar o seu negócio?",
  description = "Escolha o plano, assine e veja o sistema se adaptar ao seu segmento em minutos.",
  primaryHref = "/signup",
  primaryLabel = "Assinar agora",
  secondaryHref = "/precos",
  secondaryLabel = "Ver planos",
  variant = "featured",
}: CtaBandProps) {
  if (variant === "light") {
    return (
      <section className="section py-8 lg:py-10">
        <div className="flex flex-col items-center justify-between gap-5 rounded-2xl border border-slate-200/80 bg-white px-6 py-7 shadow-sm sm:flex-row sm:px-8">
          <div className="text-center sm:text-left">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{title}</h2>
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
    <section className="section py-12 lg:py-16">
      <div className="card-elevated relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,rgb(99_102_241/0.08),transparent_50%),radial-gradient(ellipse_60%_50%_at_100%_100%,rgb(139_92_246/0.06),transparent_50%)]"
          aria-hidden
        />

        <div className="relative grid gap-8 p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12 lg:p-12">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600">{description}</p>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
              {starterPrice != null && (
                <li className="inline-flex items-center gap-1.5">
                  <Icon name="Check" className="h-4 w-4 text-brand-600" />
                  A partir de {formatCurrency(starterPrice)}/mês
                </li>
              )}
              <li className="inline-flex items-center gap-1.5">
                <Icon name="Check" className="h-4 w-4 text-brand-600" />
                Acesso após pagamento confirmado
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Icon name="Check" className="h-4 w-4 text-brand-600" />
                Sem fidelidade
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:min-w-[220px] lg:flex-col">
            <Link
              href={primaryHref}
              className="btn-primary justify-center px-6 py-3 text-base shadow-md shadow-brand-600/20"
            >
              {primaryLabel}
              <Icon name="ArrowRight" className="h-4 w-4" />
            </Link>
            <Link href={secondaryHref} className="btn-secondary justify-center px-6 py-3 text-base">
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
