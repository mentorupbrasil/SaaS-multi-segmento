"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createSchoolClass, updateSchoolClass, type FormResult } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { Icon } from "@/components/icon";

const initial: FormResult = {};

interface TeacherOption {
  id: string;
  label: string;
}

interface ClassData {
  id: string;
  name: string;
  grade: string | null;
  shift: string | null;
  capacity: number;
  room: string | null;
  teacherId: string | null;
  active: boolean;
}

export function ClassForm({
  teachers,
  schoolClass,
}: {
  teachers: TeacherOption[];
  schoolClass?: ClassData;
}) {
  const isEdit = Boolean(schoolClass);
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(
    isEdit && schoolClass
      ? updateSchoolClass.bind(null, schoolClass.id)
      : createSchoolClass,
    initial,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setOpen(false);
      router.refresh();
    }
  }, [state, router]);

  if (!open && !isEdit) {
    return (
      <button type="button" className="btn-primary" onClick={() => setOpen(true)}>
        <Icon name="Plus" className="h-4 w-4" />
        Nova turma
      </button>
    );
  }

  if (!open && isEdit) {
    return (
      <button type="button" className="btn-secondary" onClick={() => setOpen(true)}>
        Editar turma
      </button>
    );
  }

  return (
    <div className="card mb-6 p-6">
      <h2 className="mb-4 text-lg font-semibold">{isEdit ? "Editar turma" : "Nova turma"}</h2>
      <form ref={formRef} action={action} className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label">Nome</label>
          <input
            name="name"
            className="input"
            required
            defaultValue={schoolClass?.name ?? ""}
          />
        </div>
        <div>
          <label className="label">Série / Nível</label>
          <input name="grade" className="input" defaultValue={schoolClass?.grade ?? ""} />
        </div>
        <div>
          <label className="label">Turno</label>
          <input
            name="shift"
            className="input"
            placeholder="Manhã, tarde, noite..."
            defaultValue={schoolClass?.shift ?? ""}
          />
        </div>
        <div>
          <label className="label">Capacidade</label>
          <input
            name="capacity"
            type="number"
            min={1}
            className="input"
            defaultValue={schoolClass?.capacity ?? 30}
          />
        </div>
        <div>
          <label className="label">Sala</label>
          <input name="room" className="input" defaultValue={schoolClass?.room ?? ""} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Professor responsável</label>
          <select name="teacherId" className="input" defaultValue={schoolClass?.teacherId ?? ""}>
            <option value="">—</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2 flex items-center gap-2">
          <input
            type="checkbox"
            name="active"
            defaultChecked={schoolClass?.active ?? true}
            className="h-4 w-4 rounded border-slate-300"
          />
          <label className="text-sm text-slate-700">Turma ativa</label>
        </div>
        {state.error && (
          <p className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        )}
        <div className="flex gap-2 sm:col-span-2">
          <SubmitButton>{isEdit ? "Salvar alterações" : "Salvar"}</SubmitButton>
          <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
