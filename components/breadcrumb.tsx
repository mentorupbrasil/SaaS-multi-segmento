import Link from "next/link";
import { Icon } from "@/components/icon";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {index > 0 && (
                <Icon name="ChevronRight" className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              )}
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-brand-600">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "font-medium text-slate-700" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
