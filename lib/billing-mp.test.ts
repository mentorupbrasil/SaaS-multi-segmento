import { describe, expect, it } from "vitest";
import {
  parseExternalReference,
  subscriptionStatusFromPayment,
} from "./billing-mp";

describe("billing-mp", () => {
  it("parses external reference", () => {
    expect(parseExternalReference("org1:pro")).toEqual({ orgId: "org1", planId: "pro" });
    expect(parseExternalReference("invalid")).toBeNull();
  });

  it("maps payment status", () => {
    expect(subscriptionStatusFromPayment("approved")).toBe("ACTIVE");
    expect(subscriptionStatusFromPayment("rejected")).toBe("CANCELED");
  });
});
