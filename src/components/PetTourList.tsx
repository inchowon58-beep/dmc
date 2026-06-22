import type { PetTourItem } from "@/types/tour";
import PetTourCard from "./PetTourCard";

interface PetTourListProps {
  items: PetTourItem[];
  totalCount: number;
}

export default function PetTourList({ items, totalCount }: PetTourListProps) {
  if (items.length === 0) {
    return (
      <section aria-labelledby="tour-empty-heading">
        <h3 id="tour-empty-heading" className="sr-only">
          동반 여행 검색 결과 없음
        </h3>
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
          <p className="text-base font-medium text-slate-700">
            조건에 맞는 장소가 없습니다
          </p>
          <p className="mt-1 text-sm text-slate-500">
            다른 지역이나 카테고리를 선택해 보세요.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="tour-list-heading">
      <h3 id="tour-list-heading" className="sr-only">
        반려동물 동반 여행 장소 목록
      </h3>
      <p className="mb-4 text-sm text-slate-500">
        총 <span className="font-medium text-slate-700">{totalCount}</span>곳
      </p>
      <ul className="grid list-none gap-4 p-0 sm:grid-cols-2">
        {items.map((item) => (
          <PetTourCard key={item.contentid} item={item} />
        ))}
      </ul>
    </section>
  );
}
