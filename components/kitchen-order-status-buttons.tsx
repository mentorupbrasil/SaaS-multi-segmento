"use client";

import { useTransition } from "react";
import { updateKitchenStatus } from "@/modules/kitchen/actions";

const NEXT: Record<string, { label: string; status: "PREPARING" | "DONE" | "CANCELED" }[]> = {
  PENDING: [
    { label: "Preparar", status: "PREPARING" },
    { label: "Cancelar", status: "CANCELED" },
  ],
  PREPARING: [
    { label: "Pronto", status: "DONE" },
    { label: "Cancelar", status: "CANCELED" },
  ],
};

export function KitchenOrderStatusButtons({ id, status }: { id: string; status: string }) {
  const [pending, start] = useTransition();
  const actions = NEXT[status] ?? [];

  if (actions.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {actions.map((a) => (
        <button
          key={a.status}
          type="button"
          disabled={pending}
          className={a.status === "DONE" ? "btn-primary text-sm" : "btn-secondary text-sm"}
          onClick={() => start(() => void updateKitchenStatus(id, a.status))}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}
