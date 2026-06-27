import Link from "next/link";
import { SOLUTIONS } from "@/lib/solutions";
import { Icon } from "@/components/icon";
import { HoverMenu } from "./hover-menu";

export function SolutionsMenu() {
  return (
    <HoverMenu label="Soluções" width="w-[min(94vw,560px)]">
      <div className="grid gap-2 sm:grid-cols-2">
        {SOLUTIONS.map((s) => (
          <Link
            key={s.slug}
            href={`/solucoes#${s.slug}`}
            className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-slate-50"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100">
              <Icon name={s.icon} className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-slate-800 group-hover:text-brand-700">
                {s.title}
              </span>
              <span className="block text-xs text-slate-500">{s.headline}</span>
            </span>
          </Link>
        ))}
      </div>
    </HoverMenu>
  );
}
