import { describe, expect, it } from "vitest";
import {
  filterModulesByPlan,
  isModuleAllowedByPlan,
  STARTER_BASE_MODULES,
} from "./plan-enforcement";

describe("plan-enforcement", () => {
  const segmentMods = [
    "clients",
    "scheduling",
    "services",
    "financial",
    "team",
    "inventory",
    "pdv",
  ] as const;

  it("starter only gets base operational modules", () => {
    const mods = filterModulesByPlan([...segmentMods], "starter");
    expect(mods).toEqual(expect.arrayContaining(STARTER_BASE_MODULES));
    expect(mods).not.toContain("inventory");
    expect(mods).not.toContain("pdv");
  });

  it("starter cannot access inventory or work_orders directly", () => {
    expect(isModuleAllowedByPlan("inventory", "starter")).toBe(false);
    expect(isModuleAllowedByPlan("work_orders", "starter")).toBe(false);
    expect(isModuleAllowedByPlan("clients", "starter")).toBe(true);
  });

  it("pro gets segment modules except premium extras", () => {
    const mods = filterModulesByPlan([...segmentMods], "pro");
    expect(mods).toContain("pdv");
    expect(mods).not.toContain("inventory");
  });

  it("premium includes extra modules", () => {
    const mods = filterModulesByPlan(["clients", "inventory", "work_orders"], "premium");
    expect(mods).toContain("inventory");
    expect(mods).toContain("work_orders");
  });
});
