import { describe, expect, it } from "vitest";
import { checkModuleAccess, getModuleForPath } from "./route-modules";

describe("getModuleForPath", () => {
  it("maps known routes to module ids", () => {
    expect(getModuleForPath("/clientes")).toBe("clients");
    expect(getModuleForPath("/clientes/abc")).toBe("clients");
    expect(getModuleForPath("/quartos")).toBe("rooms");
    expect(getModuleForPath("/veiculos")).toBe("vehicles");
  });

  it("returns undefined for unmapped routes", () => {
    expect(getModuleForPath("/dashboard")).toBeUndefined();
    expect(getModuleForPath("/configuracoes")).toBeUndefined();
  });
});

describe("checkModuleAccess", () => {
  it("allows routes without module mapping", () => {
    expect(checkModuleAccess("/dashboard", "barbearia")).toBe(true);
  });

  it("allows module routes enabled for the segment", () => {
    expect(checkModuleAccess("/clientes", "barbearia")).toBe(true);
    expect(checkModuleAccess("/veiculos", "oficina")).toBe(true);
    expect(checkModuleAccess("/quartos", "hotel")).toBe(true);
  });

  it("blocks module routes not enabled for the segment", () => {
    expect(checkModuleAccess("/quartos", "barbearia")).toBe(false);
    expect(checkModuleAccess("/veiculos", "barbearia")).toBe(false);
    expect(checkModuleAccess("/pdv", "barbearia")).toBe(false);
  });
});
