"use client";

import { useTransition } from "react";
import { useSessionPackage } from "./actions";

export function UseSessionButton({ id, disabled }: { id: string; disabled?: boolean }) {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending || disabled}
      className="rounded-lg border border-slate-200 px-2 py-0.5 text-xs hover:bg-slate-50 disabled:opacity-50"
      onClick={() => start(async () => { await useSessionPackage(id); })}
    >
      {pending ? "..." : "Usar sessão"}
    </button>
  );
}
