"use client";

import { useTransition } from "react";
import { updateAppointmentStatus } from "@/modules/scheduling/actions";

const NEXT: Record<string, { label: string; status: "CONFIRMED" | "COMPLETED" | "CANCELED" | "NO_SHOW" }[]> = {
  SCHEDULED: [
    { label: "Confirmar", status: "CONFIRMED" },
    { label: "Cancelar", status: "CANCELED" },
  ],
  CONFIRMED: [
    { label: "Concluir", status: "COMPLETED" },
    { label: "Faltou", status: "NO_SHOW" },
    { label: "Cancelar", status: "CANCELED" },
  ],
};

export function AppointmentStatusButtons({ id, status }: { id: string; status: string }) {
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
          onClick={() => start(() => updateAppointmentStatus(id, a.status))}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}
