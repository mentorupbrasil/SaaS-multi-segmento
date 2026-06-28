"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createBusinessEvent, type FormResult } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { Icon } from "@/components/icon";

const initial: FormResult = {};

interface Option {
  id: string;
  label: string;
}

export function EventForm({ customers }: { customers: Option[] }) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(createBusinessEvent, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setOpen(false);
      router.refresh();
    }
  }, [state, router]);

  if (!open) {
    return (
      <button type="button" className="btn-primary" onClick={() => setOpen(true)}>
        <Icon name="Plus" className="h-4 w-4" />
        Novo evento
      </button>
    );
  }

  return (
    <div className="card mb-6 p-6">
      <h2 className="mb-4 text-lg font-semibold">Novo evento</h2>
      <form ref={formRef} action={action} className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label">Nome</label>
          <input name="name" className="input" required />
        </div>
        <div>
          <label className="label">Cliente (opcional)</label>
          <select name="customerId" className="input">
            <option value="">—</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Tipo</label>
          <input name="eventType" className="input" placeholder="Casamento, festa..." />
        </div>
        <div>
          <label className="label">Data</label>
          <input name="eventDate" type="date" className="input" />
        </div>
        <div>
          <label className="label">Local</label>
          <input name="location" className="input" />
        </div>
        <div>
          <label className="label">Valor total (R$)</label>
          <input name="total" type="number" step="0.01" min="0" className="input" defaultValue={0} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Observações</label>
          <input name="notes" className="input" />
        </div>
        {state.error && (
          <p className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
        )}
        <div className="flex gap-2 sm:col-span-2">
          <SubmitButton>Salvar</SubmitButton>
          <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
