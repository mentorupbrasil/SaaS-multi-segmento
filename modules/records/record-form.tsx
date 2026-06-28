"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createCustomerRecord, type FormResult } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { Icon } from "@/components/icon";

const initial: FormResult = {};

interface RecordFormProps {
  customers: { id: string; name: string }[];
  customerLabel: string;
}

export function RecordForm({ customers, customerLabel }: RecordFormProps) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(createCustomerRecord, initial);
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
        Novo registro
      </button>
    );
  }

  return (
    <div className="card mb-6 p-6">
      <h2 className="mb-4 text-lg font-semibold">Novo registro</h2>
      <form ref={formRef} action={action} className="grid gap-4">
        <div>
          <label className="label">{customerLabel}</label>
          <select name="customerId" className="input" required>
            <option value="">Selecione...</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Título</label>
          <input name="title" className="input" required />
        </div>
        <div>
          <label className="label">Conteúdo</label>
          <textarea name="content" className="input min-h-[100px]" rows={4} />
        </div>
        <div>
          <label className="label">URL do anexo (opcional)</label>
          <input name="attachmentUrl" type="url" className="input" placeholder="https://..." />
        </div>
        {state.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
        )}
        <div className="flex gap-2">
          <SubmitButton>Salvar</SubmitButton>
          <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
