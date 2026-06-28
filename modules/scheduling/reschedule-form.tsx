"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { updateAppointment, type FormResult } from "./actions";
import { SubmitButton } from "@/components/submit-button";

const initial: FormResult = {};

function toLocalDatetimeValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function RescheduleForm({
  id,
  startAt,
  notes,
}: {
  id: string;
  startAt: Date;
  notes: string | null;
}) {
  const [open, setOpen] = useState(false);
  const boundAction = updateAppointment.bind(null, id);
  const [state, action] = useActionState(boundAction, initial);
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
      <button
        type="button"
        className="rounded-lg border border-slate-200 px-2 py-0.5 text-xs hover:bg-slate-50"
        onClick={() => setOpen(true)}
      >
        Reagendar
      </button>
    );
  }

  return (
    <form ref={formRef} action={action} className="mt-2 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div>
        <label className="label text-xs">Nova data/hora</label>
        <input
          name="startAt"
          type="datetime-local"
          className="input text-xs"
          defaultValue={toLocalDatetimeValue(new Date(startAt))}
          required
        />
      </div>
      <div>
        <label className="label text-xs">Observações</label>
        <input name="notes" className="input text-xs" defaultValue={notes ?? ""} />
      </div>
      {state.error && <p className="text-xs text-red-600">{state.error}</p>}
      <div className="flex gap-1">
        <SubmitButton className="text-xs">Salvar</SubmitButton>
        <button type="button" className="btn-secondary text-xs" onClick={() => setOpen(false)}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
