"use client";

import { useTransition } from "react";
import { updateWorkOrderStatus } from "@/modules/work-orders/actions";

const NEXT: Record<string, { label: string; status: "OPEN" | "IN_PROGRESS" | "DONE" | "CANCELED" }[]> = {
  DRAFT: [{ label: "Abrir", status: "OPEN" }],
  OPEN: [
    { label: "Iniciar", status: "IN_PROGRESS" },
    { label: "Cancelar", status: "CANCELED" },
  ],
  IN_PROGRESS: [
    { label: "Concluir", status: "DONE" },
    { label: "Cancelar", status: "CANCELED" },
  ],
};

export function WorkOrderStatusButtons({ id, status }: { id: string; status: string }) {
  const [pending, start] = useTransition();
  const actions = NEXT[status] ?? [];

  if (actions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((a) => (
        <button
          key={a.status}
          type="button"
          disabled={pending}
          className="btn-secondary text-sm"
          onClick={() => start(async () => { await updateWorkOrderStatus(id, a.status); })}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}
