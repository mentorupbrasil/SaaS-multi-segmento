"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createVaccination, type FormResult } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { LookupSelect } from "@/components/lookup-select";
import { Icon } from "@/components/icon";
import type { MasterDataOption } from "@/lib/master-data";

const initial: FormResult = {};

interface Option {
  id: string;
  label: string;
}

export function VaccinationForm({
  pets,
  vaccineItems = [],
}: {
  pets: Option[];
  vaccineItems?: MasterDataOption[];
}) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(createVaccination, initial);
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
        Nova vacina
      </button>
    );
  }

  return (
    <div className="card mb-6 p-6">
      <h2 className="mb-4 text-lg font-semibold">Registrar vacinação</h2>
      <form ref={formRef} action={action} className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Pet</label>
          <select name="petId" className="input" required>
            <option value="">Selecione</option>
            {pets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Vacina</label>
          <LookupSelect
            name="vaccine"
            type="VACCINE"
            items={vaccineItems}
            allowCustom
            required
            placeholder="Selecione a vacina"
          />
        </div>
        <div>
          <label className="label">Data de aplicação</label>
          <input name="appliedAt" type="date" className="input" required />
        </div>
        <div>
          <label className="label">Próxima dose</label>
          <input name="nextDueAt" type="date" className="input" />
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
