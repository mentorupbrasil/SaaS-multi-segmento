"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createService, type FormResult } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { Icon } from "@/components/icon";

const initial: FormResult = {};

interface Option {
  id: string;
  label: string;
}

export function ServiceForm({
  serviceLabel,
  staff = [],
}: {
  serviceLabel: string;
  staff?: Option[];
}) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(createService, initial);
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
        Novo {serviceLabel.toLowerCase()}
      </button>
    );
  }

  return (
    <div className="card mb-6 p-6">
      <h2 className="mb-4 text-lg font-semibold">Novo {serviceLabel.toLowerCase()}</h2>
      <form ref={formRef} action={action} className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <label className="label">Nome</label>
          <input name="name" className="input" required />
        </div>
        <div>
          <label className="label">Preço (R$)</label>
          <input name="price" type="number" step="0.01" min="0" className="input" defaultValue="0" />
        </div>
        <div>
          <label className="label">Duração (min)</label>
          <input name="durationMin" type="number" min="0" className="input" defaultValue="30" />
        </div>

        {staff.length > 0 && (
          <div className="sm:col-span-3">
            <label className="label">Profissionais (opcional)</label>
            <div className="flex flex-wrap gap-3 rounded-lg border border-slate-200 p-3">
              {staff.map((s) => (
                <label key={s.id} className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" name="staffIds" value={s.id} className="h-4 w-4 rounded border-slate-300" />
                  {s.label}
                </label>
              ))}
            </div>
          </div>
        )}

        {state.error && (
          <p className="sm:col-span-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <div className="flex gap-2 sm:col-span-3">
          <SubmitButton>Salvar</SubmitButton>
          <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
