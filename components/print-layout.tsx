"use client";

import { Icon } from "@/components/icon";

export function PrintLayout({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4 print:hidden">
        {title && <h1 className="text-lg font-semibold text-slate-900">{title}</h1>}
        <button type="button" className="btn-secondary" onClick={() => window.print()}>
          <Icon name="Printer" className="h-4 w-4" />
          Imprimir
        </button>
      </div>

      <div className="card p-6 print:border-0 print:p-0 print:shadow-none">{children}</div>
    </div>
  );
}
