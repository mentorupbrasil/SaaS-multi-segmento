"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/submit-button";
import type { TicketActionState } from "./actions";

export function TenantTicketForm({
  action,
}: {
  action: (prev: TicketActionState, formData: FormData) => Promise<TicketActionState>;
}) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className="card space-y-4 p-5">
      <h2 className="font-semibold text-foreground">Abrir chamado</h2>
      <p className="text-sm text-muted-foreground">
        Nossa equipe responde em até 1 dia útil. Descreva o problema com o máximo de detalhes.
      </p>
      <div>
        <label className="label" htmlFor="subject">
          Assunto
        </label>
        <input id="subject" name="subject" className="input" placeholder="Ex.: Erro ao emitir recibo no PDV" required />
      </div>
      <div>
        <label className="label" htmlFor="body">
          Descrição
        </label>
        <textarea
          id="body"
          name="body"
          className="input min-h-[120px]"
          placeholder="O que aconteceu? Quando? Qual tela?"
          required
        />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.ok && <p className="text-sm text-primary">Chamado enviado. Acompanhe o status abaixo.</p>}
      <SubmitButton className="btn-primary" pendingText="Enviando…">
        Enviar chamado
      </SubmitButton>
    </form>
  );
}
