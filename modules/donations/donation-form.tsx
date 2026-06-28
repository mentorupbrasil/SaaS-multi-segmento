"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createDonation, type FormResult } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { Icon } from "@/components/icon";

const initial: FormResult = {};

interface Option {
  id: string;
  label: string;
}

export function DonationForm({
  customers,
  customerLabel,
}: {
  customers: Option[];
  customerLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(createDonation, initial);
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
        Nova doação
      </button>
    );
  }

  return (
    <div className="card mb-6 p-6">
      <h2 className="mb-4 text-lg font-semibold">Registrar doação</h2>
      <form ref={formRef} action={action} className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Valor (R$)</label>
          <input name="amount" type="number" step="0.01" min="0.01" className="input" required />
        </div>
        <div>
          <label className="label">Tipo</label>
          <input name="donationType" className="input" placeholder="Dinheiro, PIX..." />
        </div>
        <div>
          <label className="label">{customerLabel} (opcional)</label>
          <select name="customerId" className="input">
            <option value="">Anônimo</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Recebida em</label>
          <input name="receivedAt" type="date" className="input" />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Descrição</label>
          <input name="description" className="input" />
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
