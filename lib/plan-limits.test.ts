import { describe, expect, it } from "vitest";
import {
  canAccessFeature,
  formatBranchLimit,
  formatUserLimit,
  getPlanLimits,
  normalizePlanId,
} from "./plan-limits";

describe("getPlanLimits", () => {
  it("falls back to starter for unknown plan", () => {
    expect(getPlanLimits("invalid").maxUsers).toBe(2);
    expect(getPlanLimits("invalid").maxBranches).toBe(1);
  });

  it("pro limits", () => {
    const limits = getPlanLimits("pro");
    expect(limits.maxUsers).toBe(8);
    expect(limits.features).toContain("data_export");
  });

  it("premium has extra modules feature", () => {
    const limits = getPlanLimits("premium");
    expect(limits.features).toContain("extra_modules");
    expect(limits.maxUsers).toBeNull();
  });

  it("enterprise has custom integrations", () => {
    const limits = getPlanLimits("enterprise");
    expect(limits.features).toContain("custom_integrations");
  });
});

describe("canAccessFeature", () => {
  it("pro has advanced reports and export", () => {
    expect(canAccessFeature("pro", "advanced_reports")).toBe(true);
    expect(canAccessFeature("pro", "data_export")).toBe(true);
  });

  it("starter has no premium features", () => {
    expect(canAccessFeature("starter", "whatsapp_reminders")).toBe(false);
    expect(canAccessFeature("starter", "public_booking")).toBe(false);
    expect(canAccessFeature("starter", "data_export")).toBe(false);
  });

  it("consolidated reports only premium+", () => {
    expect(canAccessFeature("pro", "consolidated_reports")).toBe(false);
    expect(canAccessFeature("premium", "consolidated_reports")).toBe(true);
  });
});

describe("format helpers", () => {
  it("formats user and branch limits", () => {
    expect(formatUserLimit("starter")).toBe("2");
    expect(formatUserLimit("premium")).toBe("Ilimitado");
    expect(formatBranchLimit("starter")).toBe("1 unidade");
  });

  it("normalizes plan id", () => {
    expect(normalizePlanId("unknown")).toBe("starter");
    expect(normalizePlanId("pro")).toBe("pro");
  });
});
