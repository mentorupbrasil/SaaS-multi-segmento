"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createEnrollment, type FormResult } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { Icon } from "@/components/icon";

const initial: FormResult = {};

interface Option {
  id: string;
  label: string;
}

export function EnrollmentForm({
  classes,
  customers,
  defaultClassId,
}: {
  classes: Option[];
  customers: Option[];
  defaultClassId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(createEnrollment, initial);
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
        Nova matrícula
      </button>
    );
  }

  return (
    <div className="card mb-6 p-6">
      <h2 className="mb-4 text-lg font-semibold">Nova matrícula</h2>
      <form ref={formRef} action={action} className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Turma</label>
          <select
            name="classId"
            className="input"
            required
            defaultValue={defaultClassId ?? ""}
          >
            <option value="">Selecione</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Aluno</label>
          <select name="customerId" className="input" required>
            <option value="">Selecione</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Status</label>
          <select name="status" className="input" defaultValue="ACTIVE">
            <option value="ACTIVE">Ativa</option>
            <option value="SUSPENDED">Suspensa</option>
            <option value="COMPLETED">Concluída</option>
            <option value="CANCELED">Cancelada</option>
          </select>
        </div>
        <div>
          <label className="label">Observações</label>
          <input name="notes" className="input" />
        </div>
        {state.error && (
          <p className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        )}
        <div className="flex gap-2 sm:col-span-2">
          <SubmitButton>Matricular</SubmitButton>
          <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
