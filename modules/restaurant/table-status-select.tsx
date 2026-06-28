"use client";

import { useTransition } from "react";
import { updateTableStatus, type TableStatus } from "@/modules/restaurant/table-actions";

const STATUS_OPTIONS: Array<{ value: TableStatus; label: string }> = [
  { value: "free", label: "Livre" },
  { value: "occupied", label: "Ocupada" },
  { value: "reserved", label: "Reservada" },
];

export function TableStatusSelect({ id, status }: { id: string; status: TableStatus }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      className="input text-xs"
      value={status}
      disabled={pending}
      onChange={(e) => {
        startTransition(() => updateTableStatus(id, e.target.value as TableStatus));
      }}
    >
      {STATUS_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
