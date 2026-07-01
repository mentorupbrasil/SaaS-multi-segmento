import Link from "next/link";
import { Sparkles, TrendingUp, Zap } from "lucide-react";
import { Icon } from "@/components/icon";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const INSIGHTS = [
  {
    label: "Atendimentos hoje",
    value: "12",
    hint: "3 sem confirmação",
    icon: TrendingUp,
  },
  {
    label: "Faturamento previsto",
    value: "R$ 1.240",
    hint: "+8% vs. semana passada",
    icon: Zap,
  },
  {
    label: "Clientes para retorno",
    value: "3",
    hint: "Inativos há 60+ dias",
    icon: Sparkles,
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

function IaDashboardPanel() {
  return (
    <div className="relative h-full min-h-[280px] border-t border-border bg-gradient-to-br from-slate-950 via-slate-900 to-brand-900 p-5 sm:p-6 lg:border-l lg:border-t-0">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-400/80" />
            <span className="h-2 w-2 rounded-full bg-amber-400/80" />
            <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
          </div>
          <span className="text-[10px] font-medium text-muted-foreground">GestorPro · IA</span>
        </div>

        <div className="rounded-xl border border-white/10 bg-card/5 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-brand-300">
            <Icon name="Sparkles" className="h-3.5 w-3.5" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Resumo do dia</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-100">
            Hoje você tem <strong className="text-white">12 atendimentos</strong>. Identifiquei{" "}
            <strong className="text-white">3 clientes</strong> inativos — lembrete pode recuperar até{" "}
            <strong className="text-emerald-300">R$ 420</strong>.
          </p>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-lg border border-brand-400/20 bg-brand-500/10 px-3 py-2">
          <Icon name="Zap" className="h-3.5 w-3.5 shrink-0 text-brand-300" />
          <p className="text-[11px] leading-snug text-brand-100">
            <span className="font-semibold text-white">Sugestão:</span> confirmar horários 14h–16h reduz faltas em 40%.
          </p>
        </div>

        <div className="mt-3 flex items-end gap-1">
          {[35, 55, 42, 68, 50, 72, 58, 80, 65].map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-t bg-gradient-to-t from-brand-600/80 to-brand-400/90"
              style={{ height: `${h}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function AiShowcase({ enabled }: AiShowcaseProps) {
  if (!enabled) return null;

  return (
    <section className="border-y border-border bg-muted/30 py-12 md:py-16">
      <div className="section">
        <div className="relative">
          <div className="relative z-10 grid grid-cols-6 gap-3">
            {INSIGHTS.map((item) => (
              <Card
                key={item.label}
                className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2"
              >
                <CardContent className="relative pt-6">
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />
                  <div className="relative flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-foreground">
                        {item.value}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>
                    </div>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                      <item.icon className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="relative col-span-full overflow-hidden lg:col-span-3">
              <CardContent className="flex h-full flex-col justify-between gap-6 pt-6">
                <div>
                  <span className="eyebrow">
                    <Icon name="Sparkles" className="h-3.5 w-3.5" />
                    Inteligência artificial
                  </span>
                  <h2 className="mt-4 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Decisões mais rápidas com{" "}
                    <span className="gradient-text">IA no seu fluxo</span>
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    A IA do GestorPro analisa agenda, clientes e faturamento para você começar o dia sabendo onde agir.
                  </p>
                </div>

                <ul className="space-y-2.5">
                  {CAPABILITIES.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/90">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon name="Check" className="h-3 w-3" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap items-center gap-3">
                  <Button asChild>
                    <Link href="/funcionalidades#ia">
                      Conhecer a IA
                      <Icon name="ArrowRight" className="h-4 w-4" />
                    </Link>
                  </Button>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/15">
                    Plano Profissional+
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className={cn("relative col-span-full overflow-hidden p-0 lg:col-span-3")}>
              <IaDashboardPanel />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
