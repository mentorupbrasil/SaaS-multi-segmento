import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { INTEGRATIONS, type Integration } from "@/lib/integrations";
import { Icon } from "@/components/icon";
import { SectionHeader } from "./section-header";

function IntegrationBadge({ item }: { item: Integration }) {
  if (item.planGated) {
    return (
      <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-700">
        Pro+
      </span>
    );
  }
  return (
    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
      Ativo
    </span>
  );
}

export function IntegrationsShowcase() {
  const available = INTEGRATIONS.filter((i) => i.status === "available");

  return (
    <section className="section-premium relative border-y border-slate-200/60 py-16 lg:py-24">
      <div className="section-glow pointer-events-none" aria-hidden />

      <div className="section relative">
        <SectionHeader
          eyebrow="Integrações"
          title={
            <>
              Conecte com o que{" "}
              <span className="gradient-text">você já usa</span>
            </>
          }
          description="Menos trabalho manual entre sistemas. Ative conexões no painel Conexões conforme o seu plano."
        />

        <div className="card-elevated mt-10 overflow-hidden">
          <div className="grid lg:grid-cols-[1fr_1.15fr]">
            {/* Painel informativo */}
            <div className="border-b border-slate-100 p-8 sm:p-10 lg:border-b-0 lg:border-r">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Por que integrar
              </p>
              <ul className="mt-5 space-y-4">
                {[
                  {
                    icon: "MessageCircle",
                    title: "Comunicação automática",
                    text: "Lembretes e confirmações direto no WhatsApp do cliente, sem copiar e colar.",
                  },
                  {
                    icon: "Wallet",
                    title: "Pagamentos conciliados",
                    text: "PIX e recebimentos registrados no financeiro, sem planilha paralela.",
                  },
                  {
                    icon: "Plug",
                    title: "Ativação por plano",
                    text: "Cada conexão é ligada no painel Conexões — você controla o que usa.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100">
                      <Icon name={item.icon} className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/integracoes" className="btn-primary px-5 py-2.5 shadow-md shadow-brand-600/20">
                  Ver integrações
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                  {available.length} ativas hoje
                </span>
              </div>
            </div>

            {/* Cards disponíveis */}
            <div className="bg-gradient-to-br from-slate-50/80 to-white p-6 sm:p-8">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Disponíveis agora
              </p>
              <div className="space-y-3">
                {available.map((item) => (
                  <Link
                    key={item.name}
                    href="/integracoes"
                    className="group flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-lg shadow-brand-500/20">
                      <Icon name={item.icon} className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900 group-hover:text-brand-700">
                          {item.name}
                        </h3>
                        <IntegrationBadge item={item} />
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                          {item.category}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.description}</p>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-brand-600" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
