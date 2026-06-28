import { describe, expect, it } from "vitest";
import { getSegment } from "@/segments";
import { withDefaultSpecialties } from "./segment-specialties";

describe("segment specialties", () => {
  it("keeps explicit specialties on barbearia", () => {
    const segment = getSegment("barbearia");
    expect(segment?.specialties?.length).toBeGreaterThan(0);
  });

  it("applies category defaults when segment has none", () => {
    const segment = getSegment("estetica");
    expect(segment).toBeDefined();
    const resolved = withDefaultSpecialties(segment!);
    expect(resolved.specialties?.length).toBeGreaterThan(0);
    expect(resolved.specialties?.some((s) => s.id === "corte")).toBe(true);
  });

  it("getSegment returns merged specialties for segments without explicit list", () => {
    const segment = getSegment("restaurante");
    expect(segment?.specialties?.length).toBeGreaterThan(0);
  });
});
