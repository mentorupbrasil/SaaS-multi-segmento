"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createSessionPackage, type FormResult } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { Icon } from "@/components/icon";

const initial: FormResult = {};

interface Option {
  id: string;
  label: string;
}

export function PackageForm({ customers, customerLabel }: { customers: Option[]; customerLabel: string }) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(createSessionPackage, initial);
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
        Novo pacote
      </button>
    );
  }

  return (
    <div className="card mb-6 p-6">
      <h2 className="mb-4 text-lg font-semibold">Novo pacote de sessões</h2>
      <form ref={formRef} action={action} className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">{customerLabel}</label>
          <select name="customerId" className="input" required>
            <option value="">Selecione</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Nome do pacote</label>
          <input name="name" className="input" required placeholder="Ex.: 10 sessões" />
        </div>
        <div>
          <label className="label">Total de sessões</label>
          <input name="totalSessions" type="number" min="1" className="input" defaultValue={10} required />
        </div>
        <div>
          <label className="label">Valor (R$)</label>
          <input name="price" type="number" step="0.01" min="0" className="input" defaultValue={0} />
        </div>
        <div>
          <label className="label">Validade</label>
          <input name="expiresAt" type="date" className="input" />
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
