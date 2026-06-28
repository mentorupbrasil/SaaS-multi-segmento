"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createEventTask, type FormResult } from "./actions";
import { SubmitButton } from "@/components/submit-button";

const initial: FormResult = {};

export function EventTaskForm({ eventId }: { eventId: string }) {
  const boundAction = createEventTask.bind(null, eventId);
  const [state, action] = useActionState(boundAction, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [state, router]);

  return (
    <form ref={formRef} action={action} className="mb-4 flex flex-wrap items-end gap-3">
      <div className="min-w-[200px] flex-1">
        <label className="label">Nova tarefa</label>
        <input name="title" className="input" placeholder="Descrição da tarefa" required />
      </div>
      <div>
        <label className="label">Prazo</label>
        <input name="dueAt" type="date" className="input" />
      </div>
      <SubmitButton>Adicionar</SubmitButton>
      {state.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
