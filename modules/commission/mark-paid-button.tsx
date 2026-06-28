"use client";

import { useTransition } from "react";
import { markCommissionPaid } from "./actions";

export function MarkCommissionPaidButton({ id }: { id: string }) {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      className="rounded-lg border border-slate-200 px-2 py-0.5 text-xs hover:bg-slate-50"
      onClick={() => start(() => markCommissionPaid(id))}
    >
      {pending ? "..." : "Pagar"}
    </button>
  );
}
