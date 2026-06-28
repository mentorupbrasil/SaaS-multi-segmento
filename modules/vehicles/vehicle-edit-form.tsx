"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { updateVehicle, type FormResult } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { Icon } from "@/components/icon";

const initial: FormResult = {};

interface Option {
  id: string;
  label: string;
}

export function VehicleEditForm({
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
    plate: string;
    model: string;
    brand: string | null;
    year: number | null;
    mileage: number | null;
    color: string | null;
    notes: string | null;
  };
}) {
  const [open, setOpen] = useState(false);
  const boundAction = updateVehicle.bind(null, id);
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
        Editar veículo
      </button>
    );
  }

  return (
    <div className="card mb-6 p-6">
      <h2 className="mb-4 text-lg font-semibold">Editar veículo</h2>
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
          <label className="label">Placa</label>
          <input name="plate" className="input" defaultValue={defaultValues.plate} required />
        </div>
        <div>
          <label className="label">Modelo</label>
          <input name="model" className="input" defaultValue={defaultValues.model} required />
        </div>
        <div>
          <label className="label">Marca</label>
          <input name="brand" className="input" defaultValue={defaultValues.brand ?? ""} />
        </div>
        <div>
          <label className="label">Ano</label>
          <input name="year" type="number" className="input" defaultValue={defaultValues.year ?? ""} />
        </div>
        <div>
          <label className="label">Quilometragem</label>
          <input name="mileage" type="number" className="input" defaultValue={defaultValues.mileage ?? ""} />
        </div>
        <div>
          <label className="label">Cor</label>
          <input name="color" className="input" defaultValue={defaultValues.color ?? ""} />
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
