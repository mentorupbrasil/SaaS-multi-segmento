"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type DeleteResult = { error?: string; ok?: boolean } | void;

interface DeleteButtonProps {
  label?: string;
  confirmMessage?: string;
  /** Server action já vinculada com .bind(null, id) no Server Component. */
  action: () => Promise<DeleteResult>;
  redirectTo?: string;
}

export function DeleteButton({
  label = "Excluir",
  confirmMessage = "Tem certeza que deseja excluir? Esta ação não pode ser desfeita.",
  action,
  redirectTo,
}: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();

  function handleConfirm() {
    setError(null);
    start(async () => {
      const result = await action();
      if (result && "error" in result && result.error) {
        setError(result.error);
        return;
      }
      setOpen(false);
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.refresh();
      }
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        className="rounded-lg border border-red-200 px-2 py-0.5 text-xs text-red-600 hover:bg-red-50"
        onClick={() => setOpen(true)}
      >
        {label}
      </button>
    );
  }

  return (
    <div className="inline-flex flex-col gap-1">
      <p className="max-w-xs text-xs text-slate-600">{confirmMessage}</p>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-1">
        <button
          type="button"
          disabled={pending}
          className="rounded-lg bg-red-600 px-2 py-0.5 text-xs text-white hover:bg-red-700 disabled:opacity-50"
          onClick={handleConfirm}
        >
          {pending ? "..." : "Confirmar"}
        </button>
        <button
          type="button"
          disabled={pending}
          className="rounded-lg border border-slate-200 px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-50"
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
