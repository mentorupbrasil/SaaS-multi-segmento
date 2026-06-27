"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createCustomer, type FormResult } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { Icon } from "@/components/icon";
import type { FieldDef } from "@/segments/types";

const initial: FormResult = {};

export function CustomerForm({
  customerLabel,
  customFields,
}: {
  customerLabel: string;
  customFields: FieldDef[];
}) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(createCustomer, initial);
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
        Novo {customerLabel.toLowerCase()}
      </button>
    );
  }

  return (
    <div className="card mb-6 p-6">
      <h2 className="mb-4 text-lg font-semibold">Novo {customerLabel.toLowerCase()}</h2>
      <form ref={formRef} action={action} className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Nome</label>
          <input name="name" className="input" required />
        </div>
        <div>
          <label className="label">Telefone</label>
          <input name="phone" className="input" placeholder="(00) 00000-0000" />
        </div>
        <div>
          <label className="label">E-mail</label>
          <input name="email" type="email" className="input" />
        </div>
        <div>
          <label className="label">Observações</label>
          <input name="notes" className="input" />
        </div>

        {customFields.map((field) => (
          <div key={field.key}>
            <label className="label">{field.label}</label>
            {field.type === "select" ? (
              <select name={`cf_${field.key}`} className="input">
                <option value="">Selecione</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name={`cf_${field.key}`}
                type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                className="input"
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}

        {state.error && (
          <p className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
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
