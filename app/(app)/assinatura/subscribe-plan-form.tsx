import { cn } from "@/lib/utils";
import type { Plan } from "@/lib/plans";
import { subscribePlan } from "./actions";

type Props = {
  plan: Plan;
  isCurrent: boolean;
  billingConfigured: boolean;
  defaultCpfCnpj?: string;
};

export function SubscribePlanForm({
  plan,
  isCurrent,
  billingConfigured,
  defaultCpfCnpj = "",
}: Props) {
  return (
    <form action={subscribePlan} className="mt-6 space-y-3">
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
      <button
        type="submit"
        disabled={isCurrent}
        className={cn("btn-primary w-full", isCurrent && "opacity-60")}
      >
        {isCurrent ? "Plano atual" : billingConfigured ? "Pagar e assinar" : "Assinar (simulado)"}
      </button>
    </form>
  );
}
