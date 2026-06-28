"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { updatePet, type FormResult } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { Icon } from "@/components/icon";

const initial: FormResult = {};

interface Option {
  id: string;
  label: string;
}

export function PetEditForm({
  id,
  customerLabel,
  customers,
  defaultValues,
}: {
  id: string;
  customerLabel: string;
  customers: Option[];
  defaultValues: {
    customerId: string;
    name: string;
    species: string | null;
    breed: string | null;
    sex: string | null;
    weight: number | null;
    allergies: string | null;
    notes: string | null;
  };
}) {
  const [open, setOpen] = useState(false);
  const boundAction = updatePet.bind(null, id);
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
      <button type="button" className="btn-secondary" onClick={() => setOpen(true)}>
        <Icon name="PenTool" className="h-4 w-4" />
        Editar pet
      </button>
    );
  }

  return (
    <div className="card mb-6 p-6">
      <h2 className="mb-4 text-lg font-semibold">Editar pet</h2>
      <form ref={formRef} action={action} className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">{customerLabel}</label>
          <select name="customerId" className="input" defaultValue={defaultValues.customerId} required>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Nome</label>
          <input name="name" className="input" defaultValue={defaultValues.name} required />
        </div>
        <div>
          <label className="label">Espécie</label>
          <input name="species" className="input" defaultValue={defaultValues.species ?? ""} />
        </div>
        <div>
          <label className="label">Raça</label>
          <input name="breed" className="input" defaultValue={defaultValues.breed ?? ""} />
        </div>
        <div>
          <label className="label">Sexo</label>
          <select name="sex" className="input" defaultValue={defaultValues.sex ?? ""}>
            <option value="">—</option>
            <option value="M">Macho</option>
            <option value="F">Fêmea</option>
          </select>
        </div>
        <div>
          <label className="label">Peso (kg)</label>
          <input
            name="weight"
            type="number"
            step="0.1"
            className="input"
            defaultValue={defaultValues.weight ?? ""}
          />
        </div>
        <div>
          <label className="label">Alergias</label>
          <input name="allergies" className="input" defaultValue={defaultValues.allergies ?? ""} />
        </div>
        <div>
          <label className="label">Observações</label>
          <input name="notes" className="input" defaultValue={defaultValues.notes ?? ""} />
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
