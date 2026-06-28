"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { recordAttendance, type FormResult } from "./actions";
import { SubmitButton } from "@/components/submit-button";

const initial: FormResult = {};

interface StudentRow {
  customerId: string;
  name: string;
  present: boolean;
  notes: string | null;
}

export function AttendanceForm({
  classId,
  date,
  students,
}: {
  classId: string;
  date: string;
  students: StudentRow[];
}) {
  const [state, action] = useActionState(recordAttendance, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (state.ok) {
      router.refresh();
    }
  }, [state, router]);

  if (students.length === 0) {
    return (
      <div className="card p-10 text-center text-slate-500">
        Nenhum aluno matriculado ativamente nesta turma.
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} className="card overflow-hidden">
      <input type="hidden" name="classId" value={classId} />
      <input type="hidden" name="date" value={date} />

      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-4 py-3">Aluno</th>
            <th className="px-4 py-3">Presente</th>
            <th className="px-4 py-3">Observações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {students.map((student) => (
            <tr key={student.customerId} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-900">{student.name}</td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  name={`present_${student.customerId}`}
                  defaultChecked={student.present}
                  className="h-4 w-4 rounded border-slate-300"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  name={`notes_${student.customerId}`}
                  className="input"
                  defaultValue={student.notes ?? ""}
                  placeholder="Opcional"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t border-slate-100 p-4">
        {state.error && (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
        )}
        {state.ok && (
          <p className="mb-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            Frequência registrada com sucesso.
          </p>
        )}
        <SubmitButton>Salvar frequência</SubmitButton>
      </div>
    </form>
  );
}
