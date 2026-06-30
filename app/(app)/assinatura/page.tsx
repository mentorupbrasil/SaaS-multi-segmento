import { getAuthContext } from "@/lib/auth-context";
import { isAsaasConfigured, isAsaasProduction, isBillingSimulationAllowed } from "@/lib/billing-asaas";
import { PLANS, getPlan } from "@/lib/plans";
import { PageHeader } from "@/components/page-header";
import { Icon } from "@/components/icon";
import { formatCurrency, cn } from "@/lib/utils";
import { cancelSubscription } from "./actions";
import { SubscribePlanForm } from "./subscribe-plan-form";

const STATUS_LABELS: Record<string, string> = {
  TRIALING: "Em teste",
  ACTIVE: "Ativa",
  PAST_DUE: "Aguardando pagamento",
  CANCELED: "Cancelada",
};

type Props = {
  searchParams: Promise<{ payment?: string; welcome?: string }>;
};

export default async function AssinaturaPage({ searchParams }: Props) {
  const params = await searchParams;
  const ctx = await getAuthContext();
  const org = ctx.organization;
  const currentPlan = getPlan(org.plan);
  const billingConfigured = isAsaasConfigured();
  const paymentSuccess = params.payment === "success";
  const justSignedUp = params.welcome === "1";
  const config = org.config as { billingCpfCnpj?: string } | null;
  const defaultCpfCnpj = config?.billingCpfCnpj ?? "";

  return (
    <div>
      <PageHeader title="Assinatura" description="Gerencie o plano do seu negócio." />

      {justSignedUp && org.subscriptionStatus === "PAST_DUE" && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          Conta criada. Conclua o pagamento abaixo para liberar o acesso ao sistema.
        </div>
      )}

      {paymentSuccess && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-800">
          Pagamento recebido ou em processamento. O acesso será liberado assim que o Asaas confirmar
          a cobrança (geralmente em instantes).
        </div>
      )}

      <div className="mb-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4">
        <div>
          <p className="text-sm text-slate-500">Status atual</p>
          <p className="text-lg font-semibold text-slate-900">
            {STATUS_LABELS[org.subscriptionStatus]} · Plano {currentPlan?.name ?? org.plan}
          </p>
        </div>
        {org.subscriptionStatus === "ACTIVE" && (
          <form action={cancelSubscription}>
            <button className="btn-secondary" type="submit">
              Cancelar assinatura
            </button>
          </form>
        )}
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        {billingConfigured
          ? `Cobrança recorrente mensal via Asaas (${isAsaasProduction() ? "produção" : "sandbox"}) — PIX, boleto ou cartão. O acesso é liberado após confirmação do pagamento.`
          : isBillingSimulationAllowed()
            ? "Modo simulado (dev local): configure ASAAS_API_KEY para cobrança real."
            : "Pagamentos indisponíveis: configure ASAAS_API_KEY e NEXT_PUBLIC_APP_URL na Vercel."}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => {
          const isCurrent = org.plan === plan.id && org.subscriptionStatus === "ACTIVE";
          const isEnterprise = plan.priceMonthly === null;
          return (
            <div
              key={plan.id}
              className={cn(
                "card relative flex flex-col p-6",
                plan.highlight && "ring-2 ring-brand-500",
              )}
            >
              {plan.badge && (
                <span
                  className={cn(
                    "absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-semibold text-white",
                    plan.highlight ? "bg-brand-600" : "bg-slate-900",
                  )}
                >
                  {plan.badge}
                </span>
              )}
              <h2 className="text-lg font-semibold text-slate-900">{plan.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{plan.description}</p>
              <p className="mt-3">
                {isEnterprise ? (
                  <span className="text-2xl font-bold text-slate-900">Sob consulta</span>
                ) : (
                  <>
                    <span className="text-3xl font-bold text-slate-900">
                      {formatCurrency(plan.priceMonthly as number)}
                    </span>
                    <span className="text-sm text-slate-500">/mês</span>
                  </>
                )}
              </p>
              <ul className="mt-4 flex-1 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <Icon name="Check" className="h-4 w-4 text-green-600" />
                    {f}
                  </li>
                ))}
              </ul>
              {isEnterprise ? (
                <a href="mailto:vendas@gestorpro.com.br" className="btn-secondary mt-6 w-full">
                  Falar com vendas
                </a>
              ) : (
                <SubscribePlanForm
                  plan={plan}
                  isCurrent={isCurrent}
                  billingConfigured={billingConfigured}
                  defaultCpfCnpj={defaultCpfCnpj}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
