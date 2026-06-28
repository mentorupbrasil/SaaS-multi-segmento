"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SubmitButton } from "@/components/submit-button";
import type { FormResult } from "@/modules/work-orders/actions";

interface Option {
  id: string;
  label: string;
}

interface LineItemFormProps {
  parentIdField: string;
  parentId: string;
  action: (prev: FormResult, formData: FormData) => Promise<FormResult>;
  services: Option[];
  inventory: Option[];
}

export function LineItemForm({
  parentIdField,
  parentId,
  action,
  services,
  inventory,
}: LineItemFormProps) {
  const [state, formAction] = useActionState(action, {} as FormResult);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [state, router]);

  return (
    <form ref={formRef} action={formAction} className="card mt-4 grid gap-3 p-4 sm:grid-cols-2">
      <input type="hidden" name={parentIdField} value={parentId} />
      <div>
        <label className="label">Tipo</label>
        <select name="type" className="input" defaultValue="SERVICE">
          <option value="SERVICE">Serviço</option>
          <option value="PART">Peça / Produto</option>
          <option value="LABOR">Mão de obra</option>
        </select>
      </div>
      <div>
        <label className="label">Descrição</label>
        <input name="description" className="input" required />
      </div>
      <div>
        <label className="label">Quantidade</label>
        <input name="quantity" type="number" step="0.01" min="0.01" className="input" defaultValue="1" required />
      </div>
      <div>
        <label className="label">Preço unitário (R$)</label>
        <input name="unitPrice" type="number" step="0.01" min="0" className="input" required />
      </div>
      <div>
        <label className="label">Serviço (opcional)</label>
        <select name="serviceId" className="input">
          <option value="">—</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">Peça estoque (opcional)</label>
        <select name="inventoryItemId" className="input">
          <option value="">—</option>
          {inventory.map((i) => (
            <option key={i.id} value={i.id}>{i.label}</option>
          ))}
        </select>
      </div>
      {state.error && (
        <p className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}
      <div className="sm:col-span-2">
        <SubmitButton>Adicionar item</SubmitButton>
      </div>
    </form>
  );
}
