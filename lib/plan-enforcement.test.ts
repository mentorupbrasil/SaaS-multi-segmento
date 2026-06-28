import { describe, expect, it } from "vitest";
import { isModuleAllowedByPlan, filterModulesByPlan } from "./plan-enforcement";

describe("plan-enforcement", () => {
  it("starter cannot access inventory or work_orders", () => {
    expect(isModuleAllowedByPlan("inventory", "starter")).toBe(false);
    expect(isModuleAllowedByPlan("work_orders", "starter")).toBe(false);
    expect(isModuleAllowedByPlan("clients", "starter")).toBe(true);
  });

  it("premium includes extra modules", () => {
    const mods = filterModulesByPlan(["clients", "inventory", "work_orders"], "premium");
    expect(mods).toContain("inventory");
    expect(mods).toContain("work_orders");
  });

  it("pro keeps inventory gated", () => {
    expect(isModuleAllowedByPlan("inventory", "pro")).toBe(false);
  });
});
