"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/submit-button";
import type { IntegrationActionState } from "./actions";

export function WhatsAppConfigForm({
  apiUrl,
  apiToken,
  action,
}: {
  apiUrl: string;
  apiToken: string;
  action: (prev: IntegrationActionState, formData: FormData) => Promise<IntegrationActionState>;
}) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className="mt-4 space-y-3 rounded-lg border border-border bg-muted/30 p-4">
      <input type="hidden" name="provider" value="whatsapp" />
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Credenciais da API</p>
      <p className="text-xs text-muted-foreground">
        Compatível com Evolution API, Z-API e similares. URL deve aceitar POST com{" "}
        <code className="text-foreground">phone</code> e <code className="text-foreground">message</code>.
      </p>
      <div>
        <label className="label" htmlFor="whatsapp-apiUrl">
          URL da API
        </label>
        <input
          id="whatsapp-apiUrl"
          name="apiUrl"
          className="input"
          placeholder="https://sua-api.com/send"
          defaultValue={apiUrl}
        />
      </div>
      <div>
        <label className="label" htmlFor="whatsapp-apiToken">
          Token / API Key
        </label>
        <input
          id="whatsapp-apiToken"
          name="apiToken"
          type="password"
          className="input"
          placeholder="••••••••"
          defaultValue={apiToken}
          autoComplete="off"
        />
      </div>
      {state.error && <p className="text-xs text-destructive">{state.error}</p>}
      {state.ok && <p className="text-xs text-primary">Credenciais salvas.</p>}
      <SubmitButton className="btn-secondary text-sm" pendingText="Salvando…">
        Salvar credenciais
      </SubmitButton>
    </form>
  );
}

export function NfeConfigForm({
  cnpj,
  regime,
  ambiente,
  action,
}: {
  cnpj: string;
  regime: string;
  ambiente: string;
  action: (prev: IntegrationActionState, formData: FormData) => Promise<IntegrationActionState>;
}) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className="mt-4 space-y-3 rounded-lg border border-border bg-muted/30 p-4">
      <input type="hidden" name="provider" value="nfe" />
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dados fiscais (preparação)</p>
      <p className="text-xs text-amber-700 dark:text-amber-400">
        Emissão SEFAZ ainda não está ativa. Salve os dados para quando a integração fiscal for liberada.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="nfe-cnpj">
            CNPJ
          </label>
          <input id="nfe-cnpj" name="cnpj" className="input" defaultValue={cnpj} placeholder="00.000.000/0001-00" />
        </div>
        <div>
          <label className="label" htmlFor="nfe-regime">
            Regime
          </label>
          <select id="nfe-regime" name="regime" className="input" defaultValue={regime || "simples"}>
            <option value="simples">Simples Nacional</option>
            <option value="presumido">Lucro Presumido</option>
            <option value="real">Lucro Real</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="nfe-ambiente">
            Ambiente
          </label>
          <select id="nfe-ambiente" name="ambiente" className="input" defaultValue={ambiente || "homologacao"}>
            <option value="homologacao">Homologação</option>
            <option value="producao">Produção</option>
          </select>
        </div>
      </div>
      {state.error && <p className="text-xs text-destructive">{state.error}</p>}
      {state.ok && <p className="text-xs text-primary">Dados fiscais salvos.</p>}
      <SubmitButton className="btn-secondary text-sm" pendingText="Salvando…">
        Salvar dados fiscais
      </SubmitButton>
    </form>
  );
}
