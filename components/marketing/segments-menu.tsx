"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { getSegmentGroups } from "@/segments";
import { CATEGORY_META } from "@/segments/types";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

export function SegmentsMenu() {
  const groups = getSegmentGroups();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div className="relative" onMouseEnter={openMenu} onMouseLeave={scheduleClose}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "flex items-center gap-1 transition-colors hover:text-slate-900",
          open && "text-slate-900",
        )}
      >
        Segmentos
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          className="absolute left-1/2 top-full z-50 mt-3 w-[min(92vw,720px)] -translate-x-1/2"
          onMouseEnter={openMenu}
          onMouseLeave={scheduleClose}
        >
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-300/40">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-3">
              {groups.map((group) => {
                const meta = CATEGORY_META[group.category];
                return (
                  <div key={group.category}>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600 ring-1 ring-brand-100">
                        <Icon name={meta.icon} className="h-4 w-4" />
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {group.label}
                      </span>
                    </div>
                    <ul className="space-y-0.5">
                      {group.segments.map((seg) => (
                        <li key={seg.id}>
                          <Link
                            href={`/${seg.slug}`}
                            onClick={() => setOpen(false)}
                            className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-brand-700"
                          >
                            <Icon
                              name={seg.icon}
                              className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-brand-600"
                            />
                            <span className="truncate">{seg.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-500">
                Não encontrou? A plataforma se adapta a qualquer negócio.
              </p>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="text-sm font-semibold text-brand-700 hover:text-brand-800"
              >
                Criar minha conta
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
