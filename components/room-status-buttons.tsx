"use client";

import { useTransition } from "react";
import { updateRoomStatus } from "@/modules/rooms/actions";

const NEXT: Record<string, { label: string; status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | "BLOCKED" }[]> = {
  AVAILABLE: [
    { label: "Manutenção", status: "MAINTENANCE" },
    { label: "Bloquear", status: "BLOCKED" },
  ],
  OCCUPIED: [{ label: "Liberar", status: "AVAILABLE" }],
  MAINTENANCE: [{ label: "Disponível", status: "AVAILABLE" }],
  BLOCKED: [{ label: "Disponível", status: "AVAILABLE" }],
  RESERVED: [{ label: "Disponível", status: "AVAILABLE" }],
};

export function RoomStatusButtons({ id, status }: { id: string; status: string }) {
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
          onClick={() => start(() => updateRoomStatus(id, a.status))}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}
