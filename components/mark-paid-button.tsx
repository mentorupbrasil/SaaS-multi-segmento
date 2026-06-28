"use client";

import { useTransition } from "react";
import { markEntryPaid } from "@/modules/financial/actions";

export function MarkPaidButton({ id }: { id: string }) {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      className="rounded-lg bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 hover:bg-green-100"
      onClick={() => start(() => markEntryPaid(id))}
    >
      Marcar pago
    </button>
  );
}
