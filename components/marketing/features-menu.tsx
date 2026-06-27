import Link from "next/link";
import { FEATURE_GROUPS } from "@/lib/features";
import { Icon } from "@/components/icon";
import { HoverMenu } from "./hover-menu";

export function FeaturesMenu() {
  return (
    <HoverMenu label="Funcionalidades" width="w-[min(94vw,760px)]">
      <div className="grid gap-x-8 gap-y-5 sm:grid-cols-3">
        {FEATURE_GROUPS.map((group) => (
          <div key={group.id}>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {group.label}
            </span>
            <ul className="mt-2 space-y-0.5">
              {group.items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/funcionalidades#${item.id}`}
                    className="group flex items-start gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-50"
                  >
                    <Icon
                      name={item.icon}
                      className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 group-hover:text-brand-600"
                    />
                    <span>
                      <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700 group-hover:text-brand-700">
                        {item.name}
                        {item.status === "soon" && (
                          <span className="rounded bg-amber-100 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-700">
                            Em breve
                          </span>
                        )}
                      </span>
                      <span className="block text-xs text-slate-400">{item.short}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-500">Tudo isso adaptado ao seu segmento.</p>
        <Link href="/funcionalidades" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
          Ver todas
        </Link>
      </div>
    </HoverMenu>
  );
}
