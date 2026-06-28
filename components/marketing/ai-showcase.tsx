import Link from "next/link";
import { Icon } from "@/components/icon";
import { SectionHeader } from "./section-header";

const INSIGHTS = [
  {
    label: "Atendimentos hoje",
    value: "12",
    hint: "3 ainda sem confirmação",
  },
  {
    label: "Faturamento previsto",
    value: "R$ 1.240",
    hint: "+8% vs. semana passada",
  },
  {
    label: "Clientes para retorno",
    value: "3",
    hint: "Inativos há 60+ dias",
  },
];

const CAPABILITIES = [
  "Resumo do dia com prioridades claras",
  "Sugestões de horários e follow-up de clientes",
  "Insights sobre faturamento e agenda",
];

interface AiShowcaseProps {
  enabled: boolean;
}

export function AiShowcase({ enabled }: AiShowcaseProps) {
  if (!enabled) return null;

  return (
    <section className="section-premium relative border-y border-slate-200/60 py-16 lg:py-24">
      <div className="section-glow pointer-events-none" aria-hidden />

      <div className="section relative">
        <div className="card-elevated overflow-hidden">
          <div className="grid lg:grid-cols-[1fr_1.05fr] lg:items-stretch">
            {/* Copy */}
            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
              <SectionHeader
                align="left"
                eyebrow={
                  <span className="inline-flex items-center gap-2">
                    <Icon name="Sparkles" className="h-3.5 w-3.5" />
                    Inteligência artificial
                  </span>
                }
                title={
                  <>
                    Decisões mais rápidas com{" "}
                    <span className="gradient-text">IA no seu fluxo</span>
                  </>
                }
                description="A IA do GestorPro analisa agenda, clientes e faturamento para você começar o dia sabendo exatamente onde agir."
              />

              <ul className="mt-8 space-y-3">
                {CAPABILITIES.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                      <Icon name="Check" className="h-3 w-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/funcionalidades#ia" className="btn-primary px-5 py-2.5 shadow-md shadow-brand-600/20">
                  Conhecer a IA
                  <Icon name="ArrowRight" className="h-4 w-4" />
                </Link>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">
                  Plano Profissional+
                </span>
              </div>
            </div>

            {/* Preview — painel de produto */}
            <div className="relative border-t border-slate-100 bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

              <div className="relative">
                {/* Chrome */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">GestorPro · IA</span>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-brand-300">
                    <Icon name="Sparkles" className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Resumo do dia</span>
                  </div>
                  <p className="mt-3 text-base leading-relaxed text-slate-100">
                    Hoje você tem <strong className="font-semibold text-white">12 atendimentos</strong>.
                    Identifiquei <strong className="font-semibold text-white">3 clientes</strong> inativos
                    — enviar lembrete pode recuperar até{" "}
                    <strong className="font-semibold text-emerald-300">R$ 420</strong> em receita.
                  </p>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {INSIGHTS.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm"
                    >
                      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                        {item.label}
                      </p>
                      <p className="mt-1 text-lg font-bold tabular-nums text-white">{item.value}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">{item.hint}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-xl border border-brand-400/20 bg-brand-500/10 px-4 py-3">
                  <Icon name="Zap" className="h-4 w-4 text-brand-300" />
                  <p className="text-xs text-brand-100">
                    <span className="font-semibold text-white">Sugestão:</span> confirmar os 3 horários
                    das 14h–16h reduz risco de falta em 40%.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
