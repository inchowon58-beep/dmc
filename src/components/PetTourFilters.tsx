"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import FilterChip from "@/components/FilterChip";
import type { AreaCode, CategoryCode } from "@/types/tour";

interface PetTourFiltersProps {
  areas: AreaCode[];
  categories: CategoryCode[];
}

export default function PetTourFilters({
  areas,
  categories,
}: PetTourFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const selectedArea = searchParams.get("area") ?? "";
  const selectedCategory = searchParams.get("cat") ?? "";

  const updateFilter = useCallback(
    (key: "area" | "cat", value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.get(key) ?? "";

      if (value === "" || value === current) {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      startTransition(() => {
        router.push(`?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams],
  );

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
          지역별
        </p>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="전체"
            active={!selectedArea}
            onClick={() => updateFilter("area", "")}
            disabled={isPending}
          />
          {areas.map((area) => (
            <FilterChip
              key={area.code}
              label={area.name}
              active={selectedArea === area.code}
              onClick={() => updateFilter("area", area.code)}
              disabled={isPending}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
          카테고리별
        </p>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="전체"
            active={!selectedCategory}
            onClick={() => updateFilter("cat", "")}
            disabled={isPending}
          />
          {categories.map((cat) => (
            <FilterChip
              key={cat.code}
              label={cat.name}
              active={selectedCategory === cat.code}
              onClick={() => updateFilter("cat", cat.code)}
              disabled={isPending}
            />
          ))}
        </div>
      </div>

      {isPending && (
        <p className="text-sm text-indigo-600">필터 적용 중...</p>
      )}
    </div>
  );
}
