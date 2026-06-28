"use client";

import { useTransition } from "react";
import { updateEventStatus } from "@/modules/events/actions";

const NEXT: Record<string, { label: string; status: "CONFIRMED" | "IN_PROGRESS" | "DONE" | "CANCELED" }[]> = {
  PLANNING: [
    { label: "Confirmar", status: "CONFIRMED" },
    { label: "Cancelar", status: "CANCELED" },
  ],
  CONFIRMED: [
    { label: "Iniciar", status: "IN_PROGRESS" },
    { label: "Cancelar", status: "CANCELED" },
  ],
  IN_PROGRESS: [
    { label: "Concluir", status: "DONE" },
    { label: "Cancelar", status: "CANCELED" },
  ],
};

export function EventStatusButtons({ id, status }: { id: string; status: string }) {
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
          onClick={() => start(() => updateEventStatus(id, a.status))}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}
