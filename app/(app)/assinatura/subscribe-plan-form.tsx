"use client";

import { useActionState, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Plan } from "@/lib/plans";
import { subscribePlanAction, type SubscribePlanState } from "./actions";

type Props = {
  plan: Plan;
  isCurrent: boolean;
  billingConfigured: boolean;
  defaultCpfCnpj?: string;
};

const initialState: SubscribePlanState = {};

export function SubscribePlanForm({
  plan,
  isCurrent,
  billingConfigured,
  defaultCpfCnpj = "",
}: Props) {
  const [state, formAction, pending] = useActionState(subscribePlanAction, initialState);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (state.paymentUrl) {
      setRedirecting(true);
      window.location.href = state.paymentUrl;
    }
  }, [state.paymentUrl]);

  return (
    <form action={formAction} className="mt-6 space-y-3">
      <input type="hidden" name="planId" value={plan.id} />
      {billingConfigured && (
        <div>
          <label className="label" htmlFor={`cpf-${plan.id}`}>
            CPF ou CNPJ
          </label>
          <input
            id={`cpf-${plan.id}`}
            name="cpfCnpj"
            className="input"
            placeholder="000.000.000-00"
            defaultValue={defaultCpfCnpj}
            required
            inputMode="numeric"
          />
        </div>
      )}
      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={isCurrent || pending || redirecting}
        className={cn("btn-primary w-full", (isCurrent || pending || redirecting) && "opacity-60")}
      >
        {redirecting
          ? "Redirecionando ao pagamento..."
          : pending
            ? "Gerando cobrança..."
            : isCurrent
              ? "Plano atual"
              : billingConfigured
                ? "Pagar e assinar"
                : "Assinar (simulado)"}
      </button>
    </form>
  );
}
