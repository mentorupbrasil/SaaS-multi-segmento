import { Icon } from "@/components/icon";
import { getSegmentTotal } from "@/lib/segment-vitrine";

const STATS = [
  { icon: "Layers", label: "segmentos prontos", key: "segments" as const },
  { icon: "Zap", label: "cadastro em minutos", key: "instant" as const },
  { icon: "CreditCard", label: "sem fidelidade", key: "no-lock" as const },
  { icon: "Headphones", label: "suporte em português", key: "support" as const },
];

export function StatsBar() {
  const total = getSegmentTotal();

  return (
    <section className="border-b border-slate-100 bg-white">
      <div className="section py-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.key} className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 ring-1 ring-slate-100">
                <Icon name={stat.icon} className="h-5 w-5" />
              </span>
              <div>
                <p className="text-lg font-bold tabular-nums text-slate-900">
                  {stat.key === "segments" ? total : stat.key === "instant" ? "2 min" : stat.key === "no-lock" ? "0" : "100%"}
                </p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
