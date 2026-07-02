import { describe, expect, it } from "vitest";
import {
  filterModulesByPlan,
  isModuleAllowedByPlan,
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

  it("starter gets segment modules except inventory/work_orders", () => {
    const mods = filterModulesByPlan([...segmentMods], "starter");
    expect(mods).toContain("pdv");
    expect(mods).not.toContain("inventory");
  });

  it("starter cannot access inventory or work_orders directly", () => {
    expect(isModuleAllowedByPlan("inventory", "starter")).toBe(false);
    expect(isModuleAllowedByPlan("work_orders", "starter")).toBe(false);
    expect(isModuleAllowedByPlan("clients", "starter")).toBe(true);
  });

  it("pro gets all segment modules including inventory", () => {
    const mods = filterModulesByPlan(["clients", "inventory", "work_orders"], "pro");
    expect(mods).toContain("inventory");
    expect(mods).toContain("work_orders");
  });

  it("legacy premium maps to pro module access", () => {
    const mods = filterModulesByPlan(["clients", "inventory", "work_orders"], "premium");
    expect(mods).toContain("inventory");
    expect(mods).toContain("work_orders");
  });
});
