import type { SubscriptionStatus } from "@prisma/client";

type MpPayment = {
  status?: string;
  external_reference?: string;
};

export async function fetchMercadoPagoPayment(paymentId: string): Promise<MpPayment | null> {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim();
  if (!token) return null;

  try {
    const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return (await res.json()) as MpPayment;
  } catch {
    return null;
  }
}

export function subscriptionStatusFromPayment(mpStatus?: string): SubscriptionStatus | null {
  if (!mpStatus) return null;
  if (mpStatus === "approved") return "ACTIVE";
  if (mpStatus === "pending" || mpStatus === "in_process") return "PAST_DUE";
  if (mpStatus === "rejected" || mpStatus === "cancelled") return "CANCELED";
  return null;
}

export function parseExternalReference(ref?: string): { orgId: string; planId: string } | null {
  if (!ref?.includes(":")) return null;
  const [orgId, planId] = ref.split(":");
  if (!orgId || !planId) return null;
  return { orgId, planId };
}
