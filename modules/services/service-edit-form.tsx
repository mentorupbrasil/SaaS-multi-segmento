"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { updateService, type FormResult } from "./actions";
import { SubmitButton } from "@/components/submit-button";

const initial: FormResult = {};

export function ServiceEditForm({
  id,
  serviceLabel,
  defaultValues,
}: {
  id: string;
  serviceLabel: string;
  defaultValues: {
    name: string;
    price: number;
    durationMin: number;
  };
}) {
  const [open, setOpen] = useState(false);
  const boundAction = updateService.bind(null, id);
  const [state, action] = useActionState(boundAction, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state.ok) {
      setOpen(false);
      router.refresh();
    }
  }, [state, router]);

  if (!open) {
    return (
      <button type="button" className="text-sm text-brand-600 hover:underline" onClick={() => setOpen(true)}>
        Editar
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="card max-h-[90vh] w-full max-w-lg overflow-y-auto p-6">
        <h2 className="mb-4 text-lg font-semibold">Editar {serviceLabel.toLowerCase()}</h2>
        <form ref={formRef} action={action} className="grid gap-4">
          <div>
            <label className="label">Nome</label>
            <input name="name" className="input" defaultValue={defaultValues.name} required />
          </div>
          <div>
            <label className="label">Preço (R$)</label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              className="input"
              defaultValue={defaultValues.price}
            />
          </div>
          <div>
            <label className="label">Duração (min)</label>
            <input
              name="durationMin"
              type="number"
              min="0"
              className="input"
              defaultValue={defaultValues.durationMin}
            />
          </div>
          {state.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
          )}
          <div className="flex gap-2">
            <SubmitButton>Salvar</SubmitButton>
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
