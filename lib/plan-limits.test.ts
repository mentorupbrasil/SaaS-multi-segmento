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
    expect(getPlanLimits("invalid").maxUsers).toBe(8);
    expect(getPlanLimits("invalid").maxBranches).toBe(1);
  });

  it("starter has growth features", () => {
    const limits = getPlanLimits("starter");
    expect(limits.maxUsers).toBe(8);
    expect(limits.features).toContain("data_export");
    expect(limits.features).toContain("whatsapp_reminders");
  });

  it("pro has extra modules feature", () => {
    const limits = getPlanLimits("pro");
    expect(limits.features).toContain("extra_modules");
    expect(limits.maxUsers).toBeNull();
  });

  it("legacy premium maps to pro limits", () => {
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
  it("starter has integrations and reports", () => {
    expect(canAccessFeature("starter", "advanced_reports")).toBe(true);
    expect(canAccessFeature("starter", "data_export")).toBe(true);
    expect(canAccessFeature("starter", "whatsapp_reminders")).toBe(true);
    expect(canAccessFeature("starter", "public_booking")).toBe(true);
  });

  it("consolidated reports only pro+", () => {
    expect(canAccessFeature("starter", "consolidated_reports")).toBe(false);
    expect(canAccessFeature("pro", "consolidated_reports")).toBe(true);
    expect(canAccessFeature("premium", "consolidated_reports")).toBe(true);
  });
});

describe("format helpers", () => {
  it("formats user and branch limits", () => {
    expect(formatUserLimit("starter")).toBe("8");
    expect(formatUserLimit("pro")).toBe("Ilimitado");
    expect(formatBranchLimit("starter")).toBe("1 unidade");
  });

  it("normalizes plan id including legacy premium", () => {
    expect(normalizePlanId("unknown")).toBe("starter");
    expect(normalizePlanId("pro")).toBe("pro");
    expect(normalizePlanId("premium")).toBe("pro");
  });
});
