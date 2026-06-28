"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { registerInventoryMovement, type FormResult } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { Icon } from "@/components/icon";

const initial: FormResult = {};

interface Option {
  id: string;
  label: string;
}

export function MovementForm({
  items,
  suppliers,
  defaultItemId,
  defaultOpen = false,
}: {
  items: Option[];
  suppliers: Option[];
  defaultItemId?: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [state, action] = useActionState(registerInventoryMovement, initial);
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
        <Icon name="Package" className="h-4 w-4" />
        Movimentar estoque
      </button>
    );
  }

  return (
    <div className="card mb-6 p-6">
      <h2 className="mb-4 text-lg font-semibold">Movimentação de estoque</h2>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">Cadastre itens antes de registrar movimentações.</p>
      ) : (
        <form ref={formRef} action={action} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Item</label>
            <select name="inventoryItemId" className="input" required defaultValue={defaultItemId}>
              <option value="">Selecione</option>
              {items.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Tipo</label>
            <select name="type" className="input" defaultValue="IN">
              <option value="IN">Entrada</option>
              <option value="OUT">Saída</option>
              <option value="ADJUST">Ajuste</option>
            </select>
          </div>
          <div>
            <label className="label">Quantidade</label>
            <input name="quantity" type="number" min="1" className="input" defaultValue={1} required />
          </div>
          <div>
            <label className="label">Fornecedor (opcional)</label>
            <select name="supplierId" className="input">
              <option value="">—</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label">Motivo</label>
            <input name="reason" className="input" />
          </div>
          {state.error && (
            <p className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
          )}
          <div className="flex gap-2 sm:col-span-2">
            <SubmitButton>Registrar</SubmitButton>
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
