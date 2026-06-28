/** Converte linhas tabulares em CSV UTF-8 com BOM (Excel). */
export function buildCsv(headers: string[], rows: string[][]): string {
  const escape = (cell: string) => {
    const value = cell ?? "";
    if (/[",\n\r]/.test(value)) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const lines = [
    headers.map(escape).join(","),
    ...rows.map((row) => row.map((cell) => escape(String(cell ?? ""))).join(",")),
  ];

  return `\uFEFF${lines.join("\r\n")}`;
}

export function csvResponse(filename: string, content: string): Response {
  return new Response(content, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
