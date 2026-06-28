"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqGroup {
  id: string;
  label: string;
  items: FaqItem[];
}

interface FaqProps {
  items?: FaqItem[];
  groups?: FaqGroup[];
  title?: string;
  description?: string;
  showSupportLinks?: boolean;
}

export function Faq({
  items,
  groups,
  title = "Perguntas frequentes",
  description,
  showSupportLinks = false,
}: FaqProps) {
  const sections: FaqGroup[] =
    groups ??
    (items ? [{ id: "all", label: "Geral", items }] : []);

  return (
    <section id="faq" className="section py-16 lg:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <span className="eyebrow">Dúvidas</span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
        {description ? (
          <p className="mt-3 text-slate-600">{description}</p>
        ) : (
          <p className="mt-3 text-slate-600">
            Respostas diretas sobre como o GestorPro funciona na prática — planos, segmentos e limites
            reais.
          </p>
        )}
      </div>

      <div className="mx-auto mt-10 max-w-3xl space-y-8">
        {sections.map((group) => (
          <div key={group.id}>
            {sections.length > 1 && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                {group.label}
              </p>
            )}
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-100">
              {group.items.map((item, i) => (
                <details
                  key={item.q}
                  className={cn("group", i > 0 && "border-t border-slate-100")}
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50 sm:px-6 sm:py-5">
                    <span className="text-sm font-semibold leading-snug text-slate-900 sm:text-base">
                      {item.q}
                    </span>
                    <ChevronDown className="mt-0.5 h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="border-t border-slate-50 bg-slate-50/40 px-5 pb-5 pt-3 text-sm leading-relaxed text-slate-600 sm:px-6">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showSupportLinks && (
        <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 px-6 py-5 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm text-slate-600">
            Ainda com dúvida? Veja{" "}
            <Link href="/precos" className="font-semibold text-brand-700 hover:text-brand-800">
              planos e preços
            </Link>{" "}
            ou fale conosco em{" "}
            <Link href="/suporte" className="font-semibold text-brand-700 hover:text-brand-800">
              suporte
            </Link>
            .
          </p>
          <Link href="/suporte" className="btn-secondary shrink-0 py-2 text-sm">
            Central de ajuda
          </Link>
        </div>
      )}
    </section>
  );
}
