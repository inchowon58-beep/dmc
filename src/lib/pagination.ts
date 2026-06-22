export const RESCUE_PAGE_SIZE = 8;
export const TRAVEL_PAGE_SIZE = 12;

export function parsePageParam(page?: string): number {
  const n = parseInt(page ?? "1", 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export function getTotalPages(totalCount: number, pageSize: number): number {
  if (totalCount <= 0) return 1;
  return Math.ceil(totalCount / pageSize);
}

export function getPageNumbers(
  currentPage: number,
  totalPages: number,
): number[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage]);

  if (currentPage > 1) pages.add(currentPage - 1);
  if (currentPage < totalPages) pages.add(currentPage + 1);
  if (currentPage <= 3) pages.add(2).add(3);
  if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 1).add(totalPages - 2);
  }

  return [...pages].sort((a, b) => a - b);
}

export function buildListPageHref(
  page: number,
  params: Record<string, string | undefined>,
): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (key === "page" || !value) continue;
    search.set(key, value);
  }

  if (page > 1) {
    search.set("page", String(page));
  }

  const query = search.toString();
  return query ? `/?${query}` : "/";
}
