"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { openCashShift, closeCashShift, type FormResult } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { Icon } from "@/components/icon";

const initial: FormResult = {};

export function OpenShiftForm() {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(openCashShift, initial);
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
        <Icon name="CreditCard" className="h-4 w-4" />
        Abrir caixa
      </button>
    );
  }

  return (
    <div className="card mb-6 p-6">
      <h2 className="mb-4 text-lg font-semibold">Abrir turno de caixa</h2>
      <form ref={formRef} action={action} className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Fundo de caixa (R$)</label>
          <input name="openingFloat" type="number" step="0.01" min="0" className="input" defaultValue={0} />
        </div>
        <div>
          <label className="label">Observações</label>
          <input name="notes" className="input" />
        </div>
        {state.error && (
          <p className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
        )}
        <div className="flex gap-2 sm:col-span-2">
          <SubmitButton>Abrir</SubmitButton>
          <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export function CloseShiftForm({ shiftId }: { shiftId: string }) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(closeCashShift, initial);
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
      <button type="button" className="btn-secondary" onClick={() => setOpen(true)}>
        Fechar caixa
      </button>
    );
  }

  return (
    <form ref={formRef} action={action} className="mt-4 grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="shiftId" value={shiftId} />
      <div>
        <label className="label">Valor em caixa (R$)</label>
        <input name="closingCash" type="number" step="0.01" min="0" className="input" required />
      </div>
      <div>
        <label className="label">Observações</label>
        <input name="notes" className="input" />
      </div>
      {state.error && (
        <p className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}
      <div className="flex gap-2 sm:col-span-2">
        <SubmitButton>Fechar turno</SubmitButton>
        <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
