"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { updateSupplier, type FormResult } from "./actions";
import { SubmitButton } from "@/components/submit-button";

const initial: FormResult = {};

export function SupplierEditForm({
  id,
  defaultValues,
}: {
  id: string;
  defaultValues: {
    name: string;
    phone: string | null;
    email: string | null;
    document: string | null;
    notes: string | null;
  };
}) {
  const [open, setOpen] = useState(false);
  const boundAction = updateSupplier.bind(null, id);
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
      <button type="button" className="text-sm text-brand-600 hover:underline" onClick={() => setOpen(true)}>
        Editar
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="card max-h-[90vh] w-full max-w-lg overflow-y-auto p-6">
        <h2 className="mb-4 text-lg font-semibold">Editar fornecedor</h2>
      <form ref={formRef} action={action} className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Nome</label>
          <input name="name" className="input" defaultValue={defaultValues.name} required />
        </div>
        <div>
          <label className="label">Telefone</label>
          <input name="phone" className="input" defaultValue={defaultValues.phone ?? ""} />
        </div>
        <div>
          <label className="label">E-mail</label>
          <input name="email" type="email" className="input" defaultValue={defaultValues.email ?? ""} />
        </div>
        <div>
          <label className="label">Documento</label>
          <input name="document" className="input" defaultValue={defaultValues.document ?? ""} />
        </div>
        <div className="sm:col-span-2">
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
    </div>
  );
}
