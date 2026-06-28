"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createWorkOrder, type FormResult } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { Icon } from "@/components/icon";

const initial: FormResult = {};

interface WorkOrderFormProps {
  customers: { id: string; name: string }[];
  staff?: { id: string; name: string }[];
  vehicles?: { id: string; label: string }[];
}

export function WorkOrderForm({ customers, staff = [], vehicles = [] }: WorkOrderFormProps) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(createWorkOrder, initial);
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
        Nova ordem
      </button>
    );
  }

  return (
    <div className="card mb-6 p-6">
      <h2 className="mb-4 text-lg font-semibold">Nova ordem de serviço</h2>
      <form ref={formRef} action={action} className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label">Título</label>
          <input name="title" className="input" required />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Descrição</label>
          <textarea name="description" className="input min-h-[80px]" rows={3} />
        </div>
        <div>
          <label className="label">Cliente (opcional)</label>
          <select name="customerId" className="input">
            <option value="">—</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        {staff.length > 0 && (
          <div>
            <label className="label">Profissional (opcional)</label>
            <select name="staffId" className="input">
              <option value="">—</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {vehicles.length > 0 && (
          <div>
            <label className="label">Veículo (opcional)</label>
            <select name="vehicleId" className="input">
              <option value="">—</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="label">Prazo</label>
          <input name="dueDate" type="date" className="input" />
        </div>
        <div>
          <label className="label">Status</label>
          <select name="status" className="input" defaultValue="OPEN">
            <option value="DRAFT">Rascunho</option>
            <option value="OPEN">Aberta</option>
            <option value="IN_PROGRESS">Em andamento</option>
            <option value="DONE">Concluída</option>
            <option value="CANCELED">Cancelada</option>
          </select>
        </div>
        <div>
          <label className="label">Valor total (R$)</label>
          <input name="total" type="number" step="0.01" min="0" className="input" defaultValue={0} />
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
