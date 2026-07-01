"use client";

import { Icon } from "@/components/icon";
import { getSegmentTotal } from "@/lib/segment-vitrine";
import { StaggerContainer, StaggerItem } from "@/components/motion/fade-in";

const STATS = [
  { icon: "Layers", label: "segmentos prontos", key: "segments" as const },
  { icon: "Zap", label: "cadastro em minutos", key: "instant" as const },
  { icon: "CreditCard", label: "sem fidelidade", key: "no-lock" as const },
  { icon: "Headphones", label: "suporte em português", key: "support" as const },
];

export function StatsBar() {
  const total = getSegmentTotal();

  return (
    <section className="border-b border-border bg-card/50">
      <div className="section py-8">
        <StaggerContainer className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {STATS.map((stat) => (
            <StaggerItem key={stat.key} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground ring-1 ring-border">
                <Icon name={stat.icon} className="h-5 w-5" />
              </span>
              <div>
                <p className="text-lg font-bold tabular-nums text-foreground">
                  {stat.key === "segments"
                    ? total
                    : stat.key === "instant"
                      ? "2 min"
                      : stat.key === "no-lock"
                        ? "0"
                        : "100%"}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
