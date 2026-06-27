"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createFinancialEntry, type FormResult } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { Icon } from "@/components/icon";

const initial: FormResult = {};

export function EntryForm() {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(createFinancialEntry, initial);
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
      <button className="btn-primary" onClick={() => setOpen(true)}>
        <Icon name="Plus" className="h-4 w-4" />
        Novo lançamento
      </button>
    );
  }

  return (
    <div className="card mb-6 p-6">
      <h2 className="mb-4 text-lg font-semibold">Novo lançamento</h2>
      <form ref={formRef} action={action} className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Tipo</label>
          <select name="type" className="input" defaultValue="INCOME">
            <option value="INCOME">Receita</option>
            <option value="EXPENSE">Despesa</option>
          </select>
        </div>
        <div>
          <label className="label">Valor (R$)</label>
          <input name="amount" type="number" step="0.01" min="0" className="input" required />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Descrição</label>
          <input name="description" className="input" required />
        </div>
        <div>
          <label className="label">Vencimento</label>
          <input name="dueDate" type="date" className="input" />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input name="paid" type="checkbox" className="h-4 w-4 rounded border-slate-300" />
            Já recebido/pago
          </label>
        </div>

        {state.error && (
          <p className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
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
