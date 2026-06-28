"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { updateRoom, type FormResult } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { LookupSelect } from "@/components/lookup-select";
import type { MasterDataOption } from "@/lib/master-data";

const initial: FormResult = {};

export function RoomEditForm({
  id,
  roomTypeItems,
  defaultValues,
}: {
  id: string;
  roomTypeItems: MasterDataOption[];
  defaultValues: {
    number: string;
    type: string | null;
    dailyRate: number;
    notes: string | null;
  };
}) {
  const [open, setOpen] = useState(false);
  const boundAction = updateRoom.bind(null, id);
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
      <div className="card w-full max-w-lg p-6">
        <h2 className="mb-4 text-lg font-semibold">Editar quarto</h2>
        <form ref={formRef} action={action} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Número</label>
            <input name="number" className="input" defaultValue={defaultValues.number} required />
          </div>
          <div>
            <label className="label">Tipo</label>
            <LookupSelect
              name="type"
              type="ROOM_TYPE"
              items={roomTypeItems}
              defaultValue={defaultValues.type ?? ""}
              allowCustom
            />
          </div>
          <div>
            <label className="label">Diária (R$)</label>
            <input
              name="dailyRate"
              type="number"
              step="0.01"
              min="0"
              className="input"
              defaultValue={defaultValues.dailyRate}
            />
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
    </div>
  );
}
