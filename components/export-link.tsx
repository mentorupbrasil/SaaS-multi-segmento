import Link from "next/link";
import { canExportData, planUpgradeMessage } from "@/lib/plan-enforcement";
import { Icon } from "@/components/icon";

export interface ExportLinkProps {
  module: string;
  plan: string;
  format?: "csv" | "xlsx";
  searchParams?: Record<string, string | undefined>;
  label?: string;
}

function ExportUpgradeLink({ label }: { label: string }) {
  return (
    <Link
      href="/assinatura"
      className="btn-secondary inline-flex items-center gap-2 text-sm"
      title={planUpgradeMessage("data_export")}
    >
      <Icon name="Download" className="h-4 w-4" />
      {label}
    </Link>
  );
}

export function ExportLink({
  module,
  plan,
  format = "csv",
  searchParams = {},
  label,
}: ExportLinkProps) {
  const defaultLabel = format === "xlsx" ? "Exportar Excel" : "Exportar CSV";

  if (!canExportData(plan)) {
    return <ExportUpgradeLink label={`${defaultLabel} (Profissional+)`} />;
  }

  const params = new URLSearchParams({ module, format });
  for (const [key, value] of Object.entries(searchParams)) {
    if (value) params.set(key, value);
  }

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

export function ExportCsvLink(props: Omit<ExportLinkProps, "format">) {
  return <ExportLink {...props} format="csv" />;
}

export function ExportExcelLink(props: Omit<ExportLinkProps, "format">) {
  return <ExportLink {...props} format="xlsx" />;
}

export function ExportButtons({
  plan,
  module,
  searchParams = {},
}: {
  plan: string;
  module: string;
  searchParams?: Record<string, string | undefined>;
}) {
  if (!canExportData(plan)) {
    return <ExportUpgradeLink label="Exportar (Profissional+)" />;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <ExportLink plan={plan} module={module} format="csv" searchParams={searchParams} />
      <ExportLink plan={plan} module={module} format="xlsx" searchParams={searchParams} />
    </div>
  );
}
