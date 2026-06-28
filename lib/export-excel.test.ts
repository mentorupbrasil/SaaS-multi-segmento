import { describe, expect, it } from "vitest";
import { buildSpreadsheetXml } from "./export-excel";

describe("export excel", () => {
  it("builds valid spreadsheet XML with headers and rows", () => {
    const xml = buildSpreadsheetXml(
      ["Nome", "Valor"],
      [
        ["Alice", "10"],
        ["Bob", "20"],
      ],
    );
    expect(xml).toContain('<?xml version="1.0"?>');
    expect(xml).toContain("<Worksheet");
    expect(xml).toContain("Alice");
    expect(xml).toContain("Bob");
  });

  it("escapes special XML characters", () => {
    const xml = buildSpreadsheetXml(["Col"], [['A & B <test>']]);
    expect(xml).toContain("A &amp; B &lt;test&gt;");
  });
});
