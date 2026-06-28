"use client";

import { useTransition } from "react";
import { updateReservationStatus } from "@/modules/reservations/actions";

const NEXT: Record<string, { label: string; status: "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELED" }[]> = {
  PENDING: [
    { label: "Confirmar", status: "CONFIRMED" },
    { label: "Cancelar", status: "CANCELED" },
  ],
  CONFIRMED: [
    { label: "Check-in", status: "CHECKED_IN" },
    { label: "Cancelar", status: "CANCELED" },
  ],
  CHECKED_IN: [{ label: "Check-out", status: "CHECKED_OUT" }],
};

export function ReservationStatusButtons({ id, status }: { id: string; status: string }) {
  const [pending, start] = useTransition();
  const actions = NEXT[status] ?? [];

  if (actions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {actions.map((a) => (
        <button
          key={a.status}
          type="button"
          disabled={pending}
          className="rounded-lg border border-slate-200 px-2 py-0.5 text-xs hover:bg-slate-50"
          onClick={() => start(() => updateReservationStatus(id, a.status))}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}
