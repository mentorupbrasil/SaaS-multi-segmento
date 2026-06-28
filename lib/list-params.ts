export interface ListParams {
  q: string;
  page: number;
  pageSize: number;
}

const DEFAULT_PAGE_SIZE = 50;

export function parseListParams(
  searchParams: Record<string, string | string[] | undefined>,
): ListParams {
  const rawQ = searchParams.q;
  const q =
    (typeof rawQ === "string" ? rawQ : Array.isArray(rawQ) ? rawQ[0] : "")?.trim() ?? "";

  const rawPage = searchParams.page;
  const pageNum = parseInt(typeof rawPage === "string" ? rawPage : "1", 10);
  const page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;

  return { q, page, pageSize: DEFAULT_PAGE_SIZE };
}

export function paginate<T>(items: T[], page: number, pageSize: number) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}
