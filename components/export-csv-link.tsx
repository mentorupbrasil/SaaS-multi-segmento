import Link from "next/link";
import { Icon } from "@/components/icon";

export interface ExportCsvLinkProps {
  module: string;
  searchParams?: Record<string, string | undefined>;
  label?: string;
}

export function ExportCsvLink({
  module,
  searchParams = {},
  label = "Exportar CSV",
}: ExportCsvLinkProps) {
  const params = new URLSearchParams({ module });
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
      {label}
    </Link>
  );
}
