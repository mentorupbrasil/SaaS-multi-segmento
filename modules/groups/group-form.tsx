"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createGroup, type FormResult } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { LookupSelect } from "@/components/lookup-select";
import { Icon } from "@/components/icon";
import type { MasterDataOption } from "@/lib/master-data";

const initial: FormResult = {};

export function GroupForm({ groupTypeItems = [] }: { groupTypeItems?: MasterDataOption[] }) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(createGroup, initial);
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
        Novo grupo
      </button>
    );
  }

  return (
    <div className="card mb-6 p-6">
      <h2 className="mb-4 text-lg font-semibold">Novo grupo</h2>
      <form ref={formRef} action={action} className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label">Nome</label>
          <input name="name" className="input" required />
        </div>
        <div>
          <label className="label">Tipo</label>
          <LookupSelect
            name="groupType"
            type="GROUP_TYPE"
            items={groupTypeItems}
            allowCustom
            placeholder="Selecione o tipo"
          />
        </div>
        <div>
          <label className="label">Descrição</label>
          <input name="description" className="input" />
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
