import Link from "next/link";
import { Icon } from "@/components/icon";

export interface PaginationProps {
  total: number;
  page: number;
  pageSize: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
}

function buildHref(
  basePath: string,
  page: number,
  searchParams: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (value) params.set(key, value);
  }

  if (page > 1) params.set("page", String(page));
  else params.delete("page");

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

function pageRange(current: number, totalPages: number): number[] {
  const pages: number[] = [];
  const start = Math.max(1, current - 2);
  const end = Math.min(totalPages, current + 2);

  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }

  return pages;
}

export function Pagination({
  total,
  page,
  pageSize,
  basePath,
  searchParams = {},
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);

  if (totalPages <= 1) return null;

  const pages = pageRange(currentPage, totalPages);
  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, total);

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
      <p>
        Exibindo {from}–{to} de {total}
      </p>

      <nav aria-label="Paginação" className="flex items-center gap-1">
        {currentPage > 1 ? (
          <Link
            href={buildHref(basePath, currentPage - 1, searchParams)}
            className="btn-secondary px-2.5 py-1.5"
            aria-label="Página anterior"
          >
            <Icon name="ChevronLeft" className="h-4 w-4" />
          </Link>
        ) : (
          <span className="btn-secondary pointer-events-none px-2.5 py-1.5 opacity-40">
            <Icon name="ChevronLeft" className="h-4 w-4" />
          </span>
        )}

        {pages.map((pageNumber) => (
          <Link
            key={pageNumber}
            href={buildHref(basePath, pageNumber, searchParams)}
            className={
              pageNumber === currentPage
                ? "inline-flex min-w-9 items-center justify-center rounded-xl bg-primary px-2.5 py-1.5 text-sm font-semibold text-primary-foreground"
                : "inline-flex min-w-9 items-center justify-center rounded-xl border border-border bg-card px-2.5 py-1.5 text-sm font-medium text-foreground hover:bg-accent"
            }
            aria-current={pageNumber === currentPage ? "page" : undefined}
          >
            {pageNumber}
          </Link>
        ))}

        {currentPage < totalPages ? (
          <Link
            href={buildHref(basePath, currentPage + 1, searchParams)}
            className="btn-secondary px-2.5 py-1.5"
            aria-label="Próxima página"
          >
            <Icon name="ChevronRight" className="h-4 w-4" />
          </Link>
        ) : (
          <span className="btn-secondary pointer-events-none px-2.5 py-1.5 opacity-40">
            <Icon name="ChevronRight" className="h-4 w-4" />
          </span>
        )}
      </nav>
    </div>
  );
}
