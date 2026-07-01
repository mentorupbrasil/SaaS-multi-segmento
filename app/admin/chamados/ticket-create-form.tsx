"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/submit-button";
import type { TicketActionState } from "./actions";

export function TicketCreateForm({
  organizations,
  action,
}: {
  organizations: Array<{ id: string; name: string }>;
  action: (
    prev: TicketActionState,
    formData: FormData,
  ) => Promise<TicketActionState>;
}) {
  const [state, formAction] = useActionState(action, {});

  return (
    <details className="relative">
      <summary className="btn-primary cursor-pointer list-none px-4 py-2 text-sm">
        Novo chamado
      </summary>
      <form
        action={formAction}
        className="absolute right-0 z-10 mt-2 w-80 rounded-xl border border-border bg-card p-4 shadow-lg"
      >
        <div className="space-y-3">
          <div>
            <label className="label" htmlFor="subject">
              Assunto
            </label>
            <input id="subject" name="subject" className="input" required />
          </div>
          <div>
            <label className="label" htmlFor="organizationId">
              Organização (opcional)
            </label>
            <select id="organizationId" name="organizationId" className="input" defaultValue="">
              <option value="">— Nenhuma —</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="body">
              Descrição
            </label>
            <textarea id="body" name="body" className="input min-h-[80px]" required />
          </div>
          {state.error && (
            <p className="text-xs text-red-600">{state.error}</p>
          )}
          {state.ok && (
            <p className="text-xs text-green-600">Chamado criado.</p>
          )}
          <SubmitButton className="w-full py-2" pendingText="Salvando...">
            Criar
          </SubmitButton>
        </div>
      </form>
    </details>
  );
}
