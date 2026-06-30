import { describe, expect, it } from "vitest";
import {
  isAsaasProduction,
  isBillingSimulationAllowed,
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

  it("detects production key", () => {
    const prev = process.env.ASAAS_API_KEY;
    process.env.ASAAS_API_KEY = "$aact_prod_abc";
    delete process.env.ASAAS_ENV;
    expect(isAsaasProduction()).toBe(true);
    process.env.ASAAS_API_KEY = prev;
  });

  it("disallows simulation in production", () => {
    const prevNode = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    expect(isBillingSimulationAllowed()).toBe(false);
    process.env.NODE_ENV = prevNode;
  });
});
