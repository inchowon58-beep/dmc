import type { RescueAnimalItem } from "@/types/animal";
import ListPagination from "./ListPagination";
import RescueAnimalCard from "./RescueAnimalCard";

interface RescueAnimalListProps {
  items: RescueAnimalItem[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  searchParams: Record<string, string | undefined>;
}

export default function RescueAnimalList({
  items,
  totalCount,
  currentPage,
  pageSize,
  searchParams,
}: RescueAnimalListProps) {
  if (items.length === 0) {
    return (
      <section aria-labelledby="rescue-empty-heading">
        <h3 id="rescue-empty-heading" className="sr-only">
          구조동물 검색 결과 없음
        </h3>
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
          <p className="text-base font-medium text-slate-700">
            조건에 맞는 구조동물이 없습니다
          </p>
          <p className="mt-1 text-sm text-slate-500">
            다른 지역이나 축종을 선택해 보세요.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="rescue-list-heading">
      <h3 id="rescue-list-heading" className="sr-only">
        구조동물 보호 현황 목록
      </h3>
      <p className="mb-4 text-sm text-slate-500">
        최근 60일 기준{" "}
        <span className="font-medium text-slate-700">{totalCount}</span>마리
      </p>
      <ul className="grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <RescueAnimalCard key={item.desertionNo} item={item} />
        ))}
      </ul>
      <ListPagination
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        searchParams={searchParams}
        accent="emerald"
      />
    </section>
  );
}
