import { ChevronDown } from "lucide-react";

export interface FaqItem {
  q: string;
  a: string;
}

export function Faq({ items, title = "Perguntas frequentes" }: { items: FaqItem[]; title?: string }) {
  return (
    <section id="faq" className="section py-16">
      <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
      <div className="mx-auto mt-10 max-w-3xl divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {items.map((item, i) => (
          <details key={i} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left text-base font-medium text-slate-900 hover:bg-slate-50">
              {item.q}
              <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-6 pb-5 text-sm leading-relaxed text-slate-600">{item.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
