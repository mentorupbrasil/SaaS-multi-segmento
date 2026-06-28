import { describe, expect, it } from "vitest";
import { canAccessFeature, getPlanLimits } from "./plan-limits";

describe("getPlanLimits", () => {
  it("returns starter limits for unknown plan", () => {
    expect(getPlanLimits("invalid").maxUsers).toBe(2);
    expect(getPlanLimits("invalid").maxBranches).toBe(1);
  });

  it("returns pro limits", () => {
    const limits = getPlanLimits("pro");
    expect(limits.maxUsers).toBe(8);
    expect(limits.features).toContain("whatsapp_reminders");
    expect(limits.features).toContain("public_booking");
  });

  it("returns premium with extra modules", () => {
    const limits = getPlanLimits("premium");
    expect(limits.maxUsers).toBeNull();
    expect(limits.moduleExtras).toContain("inventory");
    expect(limits.moduleExtras).toContain("work_orders");
  });

  it("returns enterprise with custom integrations", () => {
    const limits = getPlanLimits("enterprise");
    expect(limits.features).toContain("custom_integrations");
  });
});

describe("canAccessFeature", () => {
  it("allows pro features on pro plan", () => {
    expect(canAccessFeature("pro", "advanced_reports")).toBe(true);
  });

  it("denies pro features on starter", () => {
    expect(canAccessFeature("starter", "whatsapp_reminders")).toBe(false);
    expect(canAccessFeature("starter", "public_booking")).toBe(false);
  });

  it("allows consolidated reports only on premium+", () => {
    expect(canAccessFeature("pro", "consolidated_reports")).toBe(false);
    expect(canAccessFeature("premium", "consolidated_reports")).toBe(true);
    expect(canAccessFeature("enterprise", "consolidated_reports")).toBe(true);
  });
});
