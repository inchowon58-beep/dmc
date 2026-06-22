import Link from "next/link";
import {
  buildListPageHref,
  getPageNumbers,
  getTotalPages,
} from "@/lib/pagination";

interface ListPaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  searchParams: Record<string, string | undefined>;
  accent?: "emerald" | "indigo";
}

const ACTIVE_CLASS = {
  emerald: "bg-emerald-600 text-white",
  indigo: "bg-indigo-600 text-white",
} as const;

const HOVER_CLASS = {
  emerald: "hover:border-emerald-300 hover:text-emerald-700",
  indigo: "hover:border-indigo-300 hover:text-indigo-700",
} as const;

export default function ListPagination({
  currentPage,
  totalCount,
  pageSize,
  searchParams,
  accent = "emerald",
}: ListPaginationProps) {
  const totalPages = getTotalPages(totalCount, pageSize);

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(currentPage, totalPages);
  const prevHref =
    currentPage > 1
      ? buildListPageHref(currentPage - 1, searchParams)
      : undefined;
  const nextHref =
    currentPage < totalPages
      ? buildListPageHref(currentPage + 1, searchParams)
      : undefined;

  return (
    <nav
      aria-label="목록 페이지"
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
    >
      {prevHref ? (
        <Link
          href={prevHref}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
        >
          이전
        </Link>
      ) : (
        <span className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-300">
          이전
        </span>
      )}

      <div className="flex flex-wrap items-center gap-1">
        {pageNumbers.map((page, index) => {
          const prev = pageNumbers[index - 1];
          const showEllipsis = prev !== undefined && page - prev > 1;

          return (
            <span key={page} className="flex items-center gap-1">
              {showEllipsis && (
                <span className="px-1 text-sm text-slate-400" aria-hidden>
                  …
                </span>
              )}
              {page === currentPage ? (
                <span
                  className={`min-w-9 rounded-lg px-3 py-2 text-center text-sm font-semibold ${ACTIVE_CLASS[accent]}`}
                  aria-current="page"
                >
                  {page}
                </span>
              ) : (
                <Link
                  href={buildListPageHref(page, searchParams)}
                  className={`min-w-9 rounded-lg border border-slate-200 bg-white px-3 py-2 text-center text-sm font-medium text-slate-600 transition-colors ${HOVER_CLASS[accent]}`}
                >
                  {page}
                </Link>
              )}
            </span>
          );
        })}
      </div>

      {nextHref ? (
        <Link
          href={nextHref}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
        >
          다음
        </Link>
      ) : (
        <span className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-300">
          다음
        </span>
      )}
    </nav>
  );
}
