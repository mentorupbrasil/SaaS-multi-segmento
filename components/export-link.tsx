import Link from "next/link";
import { Icon } from "@/components/icon";

export interface ExportLinkProps {
  module: string;
  format?: "csv" | "xlsx";
  searchParams?: Record<string, string | undefined>;
  label?: string;
}

export function ExportLink({
  module,
  format = "csv",
  searchParams = {},
  label,
}: ExportLinkProps) {
  const params = new URLSearchParams({ module, format });
  for (const [key, value] of Object.entries(searchParams)) {
    if (value) params.set(key, value);
  }

  const defaultLabel = format === "xlsx" ? "Exportar Excel" : "Exportar CSV";

  return (
    <Link
      href={`/api/export?${params.toString()}`}
      className="btn-secondary inline-flex items-center gap-2 text-sm"
      prefetch={false}
    >
      <Icon name="Download" className="h-4 w-4" />
      {label ?? defaultLabel}
    </Link>
  );
}

/** @deprecated Use ExportLink */
export function ExportCsvLink(props: Omit<ExportLinkProps, "format">) {
  return <ExportLink {...props} format="csv" />;
}

export function ExportExcelLink(props: Omit<ExportLinkProps, "format">) {
  return <ExportLink {...props} format="xlsx" />;
}

export function ExportButtons({
  module,
  searchParams = {},
}: {
  module: string;
  searchParams?: Record<string, string | undefined>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <ExportLink module={module} format="csv" searchParams={searchParams} />
      <ExportLink module={module} format="xlsx" searchParams={searchParams} />
    </div>
  );
}
