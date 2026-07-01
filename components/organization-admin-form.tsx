"use client";

import { useActionState } from "react";
import { updateOrganizationAdminAction, type AdminOrgActionState } from "@/app/admin/actions";

const initialState: AdminOrgActionState = {};

export function OrganizationAdminForm({
  orgId,
  plan,
  subscriptionStatus,
}: {
  orgId: string;
  plan: string;
  subscriptionStatus: string;
}) {
  const [state, formAction, pending] = useActionState(updateOrganizationAdminAction, initialState);

  return (
    <form action={formAction} className="card space-y-4 p-5">
      <h2 className="font-semibold text-foreground">Governança da conta</h2>
      <input type="hidden" name="orgId" value={orgId} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="plan" className="label">
            Plano
          </label>
          <select id="plan" name="plan" defaultValue={plan} className="input">
            <option value="free">Free</option>
            <option value="starter">Inicial</option>
            <option value="pro">Profissional</option>
            <option value="premium">Premium</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
        <div>
          <label htmlFor="subscriptionStatus" className="label">
            Status da assinatura
          </label>
          <select
            id="subscriptionStatus"
            name="subscriptionStatus"
            defaultValue={subscriptionStatus}
            className="input"
          >
            <option value="ACTIVE">Ativa</option>
            <option value="TRIALING">Trial</option>
            <option value="PAST_DUE">Inadimplente</option>
            <option value="CANCELED">Cancelada</option>
          </select>
        </div>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.ok && <p className="text-sm text-primary">Organização atualizada.</p>}

      <button type="submit" className="btn-primary" disabled={pending}>
        {pending ? "Salvando…" : "Salvar alterações"}
      </button>
    </form>
  );
}
