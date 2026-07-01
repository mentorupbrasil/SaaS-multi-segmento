"use client";

import { useState, useTransition } from "react";
import { runAsaasDiagnosis } from "./actions";
import type { AsaasDiagnosticCheck } from "@/lib/billing-asaas";

export function AsaasDiagnosePanel() {
  const [checks, setChecks] = useState<AsaasDiagnosticCheck[] | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Testar conexão com Asaas</p>
          <p className="text-xs text-slate-500">
            Use se o pagamento falhar — mostra o erro real da API (não adivinha).
          </p>
        </div>
        <button
          type="button"
          className="btn-secondary text-sm"
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              const result = await runAsaasDiagnosis();
              setChecks(result.checks);
            });
          }}
        >
          {pending ? "Testando…" : "Rodar diagnóstico"}
        </button>
      </div>

      {checks && (
        <ul className="mt-4 space-y-2 border-t border-slate-200 pt-4">
          {checks.map((c) => (
            <li key={c.name} className="text-sm">
              <span className={c.ok ? "text-green-700" : "text-red-700"}>
                {c.ok ? "✓" : "✗"} {c.name}:
              </span>{" "}
              <span className="text-slate-700">{c.detail}</span>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-3 text-xs text-slate-400">
        Ou abra logado:{" "}
        <a href="/api/billing/diagnose" className="underline" target="_blank" rel="noreferrer">
          /api/billing/diagnose
        </a>
      </p>
    </div>
  );
}
