import { getAuthContext } from "@/lib/auth-context";
import { PLANS } from "@/lib/plans";
import { PageHeader } from "@/components/page-header";
import { Icon } from "@/components/icon";
import { formatCurrency, cn } from "@/lib/utils";
import { subscribeFake, cancelFake } from "./actions";

const STATUS_LABELS: Record<string, string> = {
  TRIALING: "Em teste",
  ACTIVE: "Ativa",
  PAST_DUE: "Pagamento pendente",
  CANCELED: "Cancelada",
};

export default async function AssinaturaPage() {
  const ctx = await getAuthContext();
  const org = ctx.organization;

  return (
    <div>
      <PageHeader title="Assinatura" description="Gerencie o plano do seu negócio." />

      <div className="mb-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4">
        <div>
          <p className="text-sm text-slate-500">Status atual</p>
          <p className="text-lg font-semibold text-slate-900">
            {STATUS_LABELS[org.subscriptionStatus]} - Plano {org.plan}
          </p>
        </div>
        {org.subscriptionStatus === "ACTIVE" && (
          <form action={cancelFake}>
            <button className="btn-secondary" type="submit">
              Cancelar assinatura
            </button>
          </form>
        )}
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        Pagamento simulado nesta versão. A integração real com o Mercado Pago (checkout + webhook)
        entra nas próximas fases.
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = org.plan === plan.id && org.subscriptionStatus === "ACTIVE";
          return (
            <div
              key={plan.id}
              className={cn(
                "card relative p-6",
                plan.highlight && "ring-2 ring-brand-500",
              )}
            >
              {plan.badge && (
                <span className={cn(
                  "absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-semibold text-white",
                  plan.highlight ? "bg-brand-600" : "bg-slate-900",
                )}>
                  {plan.badge}
                </span>
              )}
              <h2 className="text-lg font-semibold text-slate-900">{plan.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{plan.description}</p>
              <p className="mt-3">
                <span className="text-3xl font-bold text-slate-900">
                  {formatCurrency(plan.priceMonthly)}
                </span>
                <span className="text-sm text-slate-500">/mês</span>
              </p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <Icon name="Check" className="h-4 w-4 text-green-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <form action={subscribeFake.bind(null, plan.id)} className="mt-6">
                <button
                  type="submit"
                  disabled={isCurrent}
                  className={cn("btn-primary w-full", isCurrent && "opacity-60")}
                >
                  {isCurrent ? "Plano atual" : "Assinar"}
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
