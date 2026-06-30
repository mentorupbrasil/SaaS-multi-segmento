import type { SubscriptionStatus } from "@prisma/client";

export class AsaasApiError extends Error {
  constructor(
    readonly status: number,
    readonly body: string,
  ) {
    super(`Asaas API ${status}: ${body.slice(0, 200)}`);
    this.name = "AsaasApiError";
  }
}

type AsaasCustomer = {
  id: string;
  externalReference?: string | null;
};

type AsaasSubscription = {
  id: string;
  customer: string;
  externalReference?: string | null;
  status?: string;
};

type AsaasPayment = {
  id: string;
  status?: string;
  subscription?: string | null;
  customer?: string;
  externalReference?: string | null;
  invoiceUrl?: string | null;
  bankSlipUrl?: string | null;
};

type AsaasList<T> = {
  data?: T[];
};

type AsaasWebhookBody = {
  event?: string;
  payment?: AsaasPayment;
  subscription?: AsaasSubscription;
};

export function isAsaasConfigured(): boolean {
  return Boolean(process.env.ASAAS_API_KEY?.trim());
}

export function getAsaasBaseUrl(): string {
  const env = process.env.ASAAS_ENV?.trim().toLowerCase();
  if (env === "production" || env === "prod") {
    return "https://api.asaas.com/api/v3";
  }
  return "https://sandbox.asaas.com/api/v3";
}

export function normalizeCpfCnpj(value: string): string {
  return value.replace(/\D/g, "");
}

export function isValidCpfCnpj(value: string): boolean {
  const digits = normalizeCpfCnpj(value);
  return digits.length === 11 || digits.length === 14;
}

export function parseBillingExternalReference(
  ref?: string | null,
): { orgId: string; planId: string } | null {
  if (!ref?.includes(":")) return null;
  const [orgId, planId] = ref.split(":");
  if (!orgId || !planId) return null;
  return { orgId, planId };
}

export function subscriptionStatusFromAsaasEvent(
  event?: string,
  paymentStatus?: string,
): SubscriptionStatus | null {
  const ev = (event ?? "").toUpperCase();
  const st = (paymentStatus ?? "").toUpperCase();

  if (
    ev === "PAYMENT_CONFIRMED" ||
    ev === "PAYMENT_RECEIVED" ||
    st === "CONFIRMED" ||
    st === "RECEIVED"
  ) {
    return "ACTIVE";
  }

  if (ev === "PAYMENT_OVERDUE" || st === "OVERDUE") {
    return "PAST_DUE";
  }

  if (
    ev === "PAYMENT_DELETED" ||
    ev === "PAYMENT_REFUNDED" ||
    ev === "SUBSCRIPTION_DELETED" ||
    ev === "SUBSCRIPTION_INACTIVATED" ||
    st === "REFUNDED"
  ) {
    return "CANCELED";
  }

  if (ev === "PAYMENT_CREATED" || ev === "PAYMENT_UPDATED" || st === "PENDING") {
    return "PAST_DUE";
  }

  return null;
}

function authHeaders(): HeadersInit {
  const key = process.env.ASAAS_API_KEY?.trim();
  if (!key) throw new Error("ASAAS_API_KEY não configurada");
  return {
    "Content-Type": "application/json",
    access_token: key,
  };
}

async function asaasRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getAsaasBaseUrl()}${path}`, {
    ...init,
    headers: { ...authHeaders(), ...(init?.headers ?? {}) },
  });
  const text = await res.text();
  if (!res.ok) throw new AsaasApiError(res.status, text);
  return text ? (JSON.parse(text) as T) : ({} as T);
}

function formatDueDate(daysFromNow = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

export async function createAsaasCustomer(input: {
  name: string;
  email: string;
  cpfCnpj: string;
  orgId: string;
}): Promise<AsaasCustomer> {
  return asaasRequest<AsaasCustomer>("/customers", {
    method: "POST",
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      cpfCnpj: normalizeCpfCnpj(input.cpfCnpj),
      externalReference: input.orgId,
    }),
  });
}

export async function createAsaasSubscription(input: {
  customerId: string;
  orgId: string;
  planId: string;
  planName: string;
  value: number;
  successUrl: string;
}): Promise<AsaasSubscription> {
  return asaasRequest<AsaasSubscription>("/subscriptions", {
    method: "POST",
    body: JSON.stringify({
      customer: input.customerId,
      billingType: "UNDEFINED",
      value: input.value,
      nextDueDate: formatDueDate(0),
      cycle: "MONTHLY",
      description: `GestorPro — Plano ${input.planName}`,
      externalReference: `${input.orgId}:${input.planId}`,
      callback: {
        successUrl: input.successUrl,
        autoRedirect: true,
      },
    }),
  });
}

export async function getSubscriptionPaymentUrl(subscriptionId: string): Promise<string | null> {
  const list = await asaasRequest<AsaasList<AsaasPayment>>(
    `/payments?subscription=${encodeURIComponent(subscriptionId)}&limit=5&order=asc`,
  );
  const payments = list.data ?? [];
  const pending = payments.find((p) =>
    ["PENDING", "OVERDUE", "AWAITING_RISK_ANALYSIS"].includes((p.status ?? "").toUpperCase()),
  );
  const payment = pending ?? payments[0];
  return payment?.invoiceUrl ?? payment?.bankSlipUrl ?? null;
}

export async function cancelAsaasSubscription(subscriptionId: string): Promise<void> {
  await asaasRequest(`/subscriptions/${encodeURIComponent(subscriptionId)}`, {
    method: "DELETE",
  });
}

export async function createAsaasCheckout(input: {
  orgId: string;
  customerId?: string | null;
  customerName: string;
  customerEmail: string;
  cpfCnpj: string;
  planId: string;
  planName: string;
  value: number;
  appUrl: string;
}): Promise<{ customerId: string; subscriptionId: string; paymentUrl: string }> {
  const customer =
    input.customerId != null
      ? { id: input.customerId }
      : await createAsaasCustomer({
          name: input.customerName,
          email: input.customerEmail,
          cpfCnpj: input.cpfCnpj,
          orgId: input.orgId,
        });

  const subscription = await createAsaasSubscription({
    customerId: customer.id,
    orgId: input.orgId,
    planId: input.planId,
    planName: input.planName,
    value: input.value,
    successUrl: `${input.appUrl}/assinatura?payment=success`,
  });

  const paymentUrl = await getSubscriptionPaymentUrl(subscription.id);
  if (!paymentUrl) {
    throw new Error("Assinatura criada, mas não foi possível obter o link de pagamento.");
  }

  return {
    customerId: customer.id,
    subscriptionId: subscription.id,
    paymentUrl,
  };
}

export function verifyAsaasWebhookToken(headerValue: string | null): boolean {
  const expected = process.env.ASAAS_WEBHOOK_TOKEN?.trim();
  if (!expected) return true;
  return headerValue === expected;
}

export type { AsaasWebhookBody };
