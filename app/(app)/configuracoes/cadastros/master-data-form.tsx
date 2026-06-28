"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { MasterDataType } from "@prisma/client";
import { createMasterDataItem, type FormResult } from "./actions";
import { SubmitButton } from "@/components/submit-button";

const initial: FormResult = {};

export function MasterDataAddForm({ type }: { type: MasterDataType }) {
  const [state, action] = useActionState(createMasterDataItem, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [state, router]);

  return (
    <form ref={formRef} action={action} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="type" value={type} />
      <div className="min-w-[200px] flex-1">
        <label htmlFor={`label-${type}`} className="label">
          Nome
        </label>
        <input id={`label-${type}`} name="label" className="input" required />
      </div>
      <div className="min-w-[160px] flex-1">
        <label htmlFor={`value-${type}`} className="label">
          Código (opcional)
        </label>
        <input id={`value-${type}`} name="value" className="input" placeholder="Ex.: PIX" />
      </div>
      <SubmitButton>Adicionar</SubmitButton>
      {state.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
