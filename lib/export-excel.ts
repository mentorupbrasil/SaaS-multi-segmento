import { buildCsv, csvResponse } from "@/lib/export-csv";

/** Gera planilha Excel 2003 XML (abre no Excel/LibreOffice sem dependências). */
export function buildSpreadsheetXml(headers: string[], rows: string[][]): string {
  const escape = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const cell = (value: string) =>
    `<Cell><Data ss:Type="String">${escape(String(value ?? ""))}</Data></Cell>`;

  const headerRow = `<Row>${headers.map((h) => cell(h)).join("")}</Row>`;
  const dataRows = rows.map((row) => `<Row>${row.map((c) => cell(c)).join("")}</Row>`).join("");

  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="Dados">
    <Table>
      ${headerRow}
      ${dataRows}
    </Table>
  </Worksheet>
</Workbook>`;
}

export function excelResponse(filename: string, content: string): Response {
  return new Response(content, {
    headers: {
      "Content-Type": "application/vnd.ms-excel; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

export type ExportFormat = "csv" | "xlsx";

export function exportTableResponse(
  format: ExportFormat,
  baseFilename: string,
  headers: string[],
  rows: string[][],
): Response {
  if (format === "xlsx") {
    return excelResponse(`${baseFilename}.xls`, buildSpreadsheetXml(headers, rows));
  }
  return csvResponse(`${baseFilename}.csv`, buildCsv(headers, rows));
}
