"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createHousekeepingTask, type FormResult } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { Icon } from "@/components/icon";

const initial: FormResult = {};

const TASK_TYPES = [
  { value: "CLEANING", label: "Limpeza" },
  { value: "DEEP_CLEAN", label: "Limpeza profunda" },
  { value: "TURNDOWN", label: "Arrumação" },
  { value: "INSPECTION", label: "Inspeção" },
  { value: "OTHER", label: "Outro" },
];

const PRIORITIES = [
  { value: "LOW", label: "Baixa" },
  { value: "NORMAL", label: "Normal" },
  { value: "HIGH", label: "Alta" },
  { value: "URGENT", label: "Urgente" },
];

export function HousekeepingTaskForm({
  rooms,
  staff,
}: {
  rooms: { id: string; label: string }[];
  staff: { id: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(createHousekeepingTask, initial);
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
        Nova tarefa
      </button>
    );
  }

  return (
    <div className="card mb-6 p-6">
      <h2 className="mb-4 text-lg font-semibold">Nova tarefa de governança</h2>
      <form ref={formRef} action={action} className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Quarto</label>
          <select name="roomId" className="input" required defaultValue="">
            <option value="" disabled>
              Selecione...
            </option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Tipo</label>
          <select name="taskType" className="input" defaultValue="CLEANING">
            {TASK_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Prioridade</label>
          <select name="priority" className="input" defaultValue="NORMAL">
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Responsável</label>
          <select name="assignedStaffId" className="input" defaultValue="">
            <option value="">Sem atribuição</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Prazo</label>
          <input name="dueAt" type="datetime-local" className="input" />
        </div>
        <div>
          <label className="label">Observações</label>
          <input name="notes" className="input" placeholder="Detalhes da tarefa..." />
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
