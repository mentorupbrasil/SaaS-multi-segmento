"use client";

import { useTransition } from "react";
import { deleteBlockedSlot } from "./actions";

export function DeleteBlockButton({ id }: { id: string }) {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      className="rounded-lg border border-red-200 px-2 py-0.5 text-xs text-red-600 hover:bg-red-50"
      onClick={() => start(() => deleteBlockedSlot(id))}
    >
      {pending ? "..." : "Remover"}
    </button>
  );
}
