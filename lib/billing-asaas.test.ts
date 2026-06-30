import { describe, expect, it } from "vitest";
import {
  isValidCpfCnpj,
  normalizeCpfCnpj,
  parseBillingExternalReference,
  subscriptionStatusFromAsaasEvent,
} from "./billing-asaas";

describe("billing-asaas", () => {
  it("normalizes cpf/cnpj", () => {
    expect(normalizeCpfCnpj("123.456.789-01")).toBe("12345678901");
    expect(isValidCpfCnpj("123.456.789-01")).toBe(true);
    expect(isValidCpfCnpj("12.345.678/0001-90")).toBe(true);
    expect(isValidCpfCnpj("123")).toBe(false);
  });

  it("parses external reference", () => {
    expect(parseBillingExternalReference("org1:pro")).toEqual({ orgId: "org1", planId: "pro" });
    expect(parseBillingExternalReference("invalid")).toBeNull();
  });

  it("maps webhook events to subscription status", () => {
    expect(subscriptionStatusFromAsaasEvent("PAYMENT_CONFIRMED")).toBe("ACTIVE");
    expect(subscriptionStatusFromAsaasEvent("PAYMENT_OVERDUE")).toBe("PAST_DUE");
    expect(subscriptionStatusFromAsaasEvent("SUBSCRIPTION_DELETED")).toBe("CANCELED");
  });
});
