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

function getAsaasApiKey(): string {
  const raw = process.env.ASAAS_API_KEY?.trim() ?? "";
  return raw.replace(/^["']+|["']+$/g, "");
}

export function isAsaasConfigured(): boolean {
  return getAsaasApiKey().length > 20;
}

/** Chave $aact_prod_... = produção; $aact_hmlg_... = sandbox. */
export function isAsaasProduction(): boolean {
  const env = process.env.ASAAS_ENV?.trim().toLowerCase();
  if (env === "production" || env === "prod") return true;
  if (env === "sandbox" || env === "homolog" || env === "hmlg") return false;
  const key = getAsaasApiKey();
  if (key.includes("_hmlg_")) return false;
  return key.includes("_prod_");
}

/** Simulação só em dev local sem ASAAS_API_KEY. Produção exige Asaas real. */
export function isBillingSimulationAllowed(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  return !isAsaasConfigured();
}

export function getAsaasBaseUrl(): string {
  if (isAsaasProduction()) {
    return "https://api.asaas.com/v3";
  }
  return "https://api-sandbox.asaas.com/v3";
}

export function getPublicAppUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!url) return null;
  if (url.includes("localhost") || url.includes("127.0.0.1")) return null;
  return url.replace(/\/$/, "");
}

export function requirePublicAppUrlForBilling(): string {
  const url = getPublicAppUrl();
  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_APP_URL deve ser a URL pública do site (ex.: https://www.gestorpro.sbs).",
    );
  }
  return url;
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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function parseAsaasErrorMessage(body: string): string {
  const trimmed = body.trim();
  if (!trimmed) return "Resposta vazia do Asaas (sem detalhes).";

  try {
    const parsed = JSON.parse(trimmed) as {
      errors?: Array<{ description?: string; code?: string }>;
      message?: string;
    };
    const err = parsed.errors?.[0];
    if (err?.description) {
      return err.code ? `${err.description} (${err.code})` : err.description;
    }
    if (parsed.message) return parsed.message;
  } catch {
    // not JSON
  }

  if (trimmed.length <= 400) return trimmed;
  return `${trimmed.slice(0, 400)}…`;
}

export function formatAsaasHttpError(status: number, body: string): string {
  const detail = parseAsaasErrorMessage(body);
  return `Asaas respondeu HTTP ${status}: ${detail}`;
}

export type AsaasDiagnosticCheck = {
  name: string;
  ok: boolean;
  detail: string;
};

/** Testa conexão com o Asaas e retorna cada etapa (para debug em produção). */
export async function diagnoseAsaasConnection(): Promise<{
  ok: boolean;
  checks: AsaasDiagnosticCheck[];
}> {
  const checks: AsaasDiagnosticCheck[] = [];
  const key = getAsaasApiKey();

  checks.push({
    name: "ASAAS_API_KEY",
    ok: key.length > 20,
    detail: key ? `Configurada (${key.slice(0, 8)}…${key.slice(-4)})` : "Não definida na Vercel",
  });

  checks.push({
    name: "Ambiente",
    ok: true,
    detail: `${isAsaasProduction() ? "produção" : "sandbox"} → ${getAsaasBaseUrl()}`,
  });

  const appUrl = getPublicAppUrl();
  checks.push({
    name: "NEXT_PUBLIC_APP_URL",
    ok: Boolean(appUrl),
    detail: appUrl ?? "Não definida ou localhost",
  });

  if (!key) {
    return { ok: false, checks };
  }

  try {
    const res = await fetch(`${getAsaasBaseUrl()}/customers?limit=1`, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "GestorPro/1.0 (www.gestorpro.sbs; diagnose)",
        access_token: key,
      },
    });
    const body = await res.text();
    checks.push({
      name: "API GET /customers",
      ok: res.ok,
      detail: res.ok ? "Conexão OK" : formatAsaasHttpError(res.status, body),
    });
    if (!res.ok) return { ok: false, checks };

    // Simula checkout: cliente + assinatura R$5 (mesmo fluxo do botão Pagar)
    const testCpf = "52998224725";
    let customerId: string | null = null;
    const byCpf = await fetch(
      `${getAsaasBaseUrl()}/customers?cpfCnpj=${testCpf}&limit=1`,
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "GestorPro/1.0 (diagnose)",
          access_token: key,
        },
      },
    );
    const byCpfBody = await byCpf.text();
    if (byCpf.ok) {
      try {
        customerId = (JSON.parse(byCpfBody) as AsaasList<AsaasCustomer>).data?.[0]?.id ?? null;
      } catch {
        /* ignore */
      }
    }

    if (!customerId) {
      const createRes = await fetch(`${getAsaasBaseUrl()}/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "GestorPro/1.0 (diagnose)",
          access_token: key,
        },
        body: JSON.stringify({
          name: "GestorPro Diagnóstico",
          email: `diag-${Date.now()}@gestorpro.sbs`,
          cpfCnpj: testCpf,
          externalReference: `diag-${Date.now()}`,
        }),
      });
      const createBody = await createRes.text();
      checks.push({
        name: "API POST /customers (teste)",
        ok: createRes.ok,
        detail: createRes.ok
          ? "Cliente de teste criado"
          : formatAsaasHttpError(createRes.status, createBody),
      });
      if (!createRes.ok) return { ok: false, checks };
      customerId = (JSON.parse(createBody) as AsaasCustomer).id;
    } else {
      checks.push({
        name: "API POST /customers (teste)",
        ok: true,
        detail: "Cliente de teste já existia",
      });
    }

    const subRes = await fetch(`${getAsaasBaseUrl()}/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "GestorPro/1.0 (diagnose)",
        access_token: key,
      },
      body: JSON.stringify({
        customer: customerId,
        billingType: "UNDEFINED",
        value: 5,
        nextDueDate: formatDueDate(1),
        cycle: "MONTHLY",
        description: "GestorPro — diagnóstico",
        externalReference: `diag:${Date.now()}`,
      }),
    });
    const subBody = await subRes.text();
    checks.push({
      name: "API POST /subscriptions (teste R$5)",
      ok: subRes.ok,
      detail: subRes.ok
        ? "Assinatura de teste criada"
        : formatAsaasHttpError(subRes.status, subBody),
    });

    return { ok: subRes.ok, checks };
  } catch (e) {
    checks.push({
      name: "API GET /customers",
      ok: false,
      detail: e instanceof Error ? e.message : "Falha de rede ao chamar Asaas",
    });
    return { ok: false, checks };
  }
}

function authHeaders(): HeadersInit {
  const key = getAsaasApiKey();
  if (!key) throw new Error("ASAAS_API_KEY não configurada");
  return {
    "Content-Type": "application/json",
    "User-Agent": "GestorPro/1.0 (www.gestorpro.sbs; billing)",
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

function formatDueDate(daysFromNow = 1): string {
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
}): Promise<AsaasSubscription> {
  return asaasRequest<AsaasSubscription>("/subscriptions", {
    method: "POST",
    body: JSON.stringify({
      customer: input.customerId,
      billingType: "UNDEFINED",
      value: input.value,
      nextDueDate: formatDueDate(1),
      cycle: "MONTHLY",
      description: `GestorPro — Plano ${input.planName}`,
      externalReference: `${input.orgId}:${input.planId}`,
    }),
  });
}

export async function findAsaasCustomerByOrgId(orgId: string): Promise<AsaasCustomer | null> {
  const list = await asaasRequest<AsaasList<AsaasCustomer>>(
    `/customers?externalReference=${encodeURIComponent(orgId)}&limit=1`,
  );
  return list.data?.[0] ?? null;
}

export async function findAsaasCustomerByCpfCnpj(cpfCnpj: string): Promise<AsaasCustomer | null> {
  const digits = normalizeCpfCnpj(cpfCnpj);
  const list = await asaasRequest<AsaasList<AsaasCustomer>>(
    `/customers?cpfCnpj=${encodeURIComponent(digits)}&limit=1`,
  );
  return list.data?.[0] ?? null;
}

export async function getSubscriptionPaymentUrl(
  subscriptionId: string,
  retries = 4,
): Promise<string | null> {
  for (let i = 0; i < retries; i += 1) {
    const list = await asaasRequest<AsaasList<AsaasPayment>>(
      `/payments?subscription=${encodeURIComponent(subscriptionId)}&limit=10&order=asc`,
    );
    const payments = list.data ?? [];
    const pending = payments.find((p) =>
      ["PENDING", "OVERDUE", "AWAITING_RISK_ANALYSIS"].includes((p.status ?? "").toUpperCase()),
    );
    const payment = pending ?? payments[0];
    const url = payment?.invoiceUrl ?? payment?.bankSlipUrl ?? null;
    if (url) return url;
    if (i < retries - 1) await sleep(800);
  }
  return null;
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
  let customerId = input.customerId ?? null;

  if (!customerId) {
    const byOrg = await findAsaasCustomerByOrgId(input.orgId);
    if (byOrg) customerId = byOrg.id;
  }

  if (!customerId) {
    const existing = await findAsaasCustomerByCpfCnpj(input.cpfCnpj);
    if (existing) {
      customerId = existing.id;
    } else {
      try {
        const created = await createAsaasCustomer({
          name: input.customerName,
          email: input.customerEmail,
          cpfCnpj: input.cpfCnpj,
          orgId: input.orgId,
        });
        customerId = created.id;
      } catch (e) {
        if (e instanceof AsaasApiError) {
          const retry = await findAsaasCustomerByCpfCnpj(input.cpfCnpj);
          if (retry) customerId = retry.id;
          else throw e;
        } else {
          throw e;
        }
      }
    }
  }

  const subscription = await createAsaasSubscription({
    customerId,
    orgId: input.orgId,
    planId: input.planId,
    planName: input.planName,
    value: input.value,
  });

  const paymentUrl = await getSubscriptionPaymentUrl(subscription.id);
  if (!paymentUrl) {
    throw new Error(
      "Cobrança criada no Asaas, mas o link de pagamento ainda não ficou pronto. Aguarde 1 minuto e clique em Pagar novamente.",
    );
  }

  return {
    customerId,
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
