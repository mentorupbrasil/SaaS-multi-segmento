import { describe, expect, it } from "vitest";
import { resolveSegmentModules } from "./segment-modules";

describe("resolveSegmentModules", () => {
  it("includes base modules and inventory for barbearia", () => {
    const modules = resolveSegmentModules("barbearia");
    expect(modules).toEqual(
      expect.arrayContaining(["clients", "scheduling", "services", "financial", "team", "inventory"]),
    );
    expect(modules).not.toContain("vehicles");
    expect(modules).not.toContain("rooms");
  });

  it("includes automotivo modules for oficina", () => {
    const modules = resolveSegmentModules("oficina");
    expect(modules).toEqual(
      expect.arrayContaining([
        "clients",
        "work_orders",
        "inventory",
        "vehicles",
        "quotes",
      ]),
    );
  });

  it("includes hotelaria modules for hotel", () => {
    const modules = resolveSegmentModules("hotel");
    expect(modules).toEqual(
      expect.arrayContaining([
        "clients",
        "scheduling",
        "work_orders",
        "rooms",
        "reservations",
      ]),
    );
    expect(modules).not.toContain("vehicles");
  });

  it("includes education modules for escola", () => {
    const modules = resolveSegmentModules("escola");
    expect(modules).toEqual(
      expect.arrayContaining(["education", "clients", "financial"]),
    );
  });

  it("excludes scheduling for farmacia", () => {
    const modules = resolveSegmentModules("farmacia");
    expect(modules).not.toContain("scheduling");
    expect(modules).toContain("pdv");
  });
});
