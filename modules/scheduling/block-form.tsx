"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createBlockedSlot, type FormResult } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { Icon } from "@/components/icon";

const initial: FormResult = {};

interface Option {
  id: string;
  label: string;
}

export function BlockForm({
  staff,
  professionalLabel,
}: {
  staff: Option[];
  professionalLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(createBlockedSlot, initial);
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
        <Icon name="Lock" className="h-4 w-4" />
        Bloquear horário
      </button>
    );
  }

  return (
    <div className="card mb-6 p-6">
      <h2 className="mb-4 text-lg font-semibold">Bloquear horário</h2>
      <form ref={formRef} action={action} className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">{professionalLabel} (opcional)</label>
          <select name="staffId" className="input">
            <option value="">Todos</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Motivo</label>
          <input name="reason" className="input" placeholder="Ex.: Folga, reunião" />
        </div>
        <div>
          <label className="label">Início</label>
          <input name="startAt" type="datetime-local" className="input" required />
        </div>
        <div>
          <label className="label">Fim</label>
          <input name="endAt" type="datetime-local" className="input" required />
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
