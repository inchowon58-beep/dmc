"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import FilterChip from "@/components/FilterChip";
import { SIDO_CODES, UPKIND_OPTIONS } from "@/types/animal";

export default function RescueAnimalFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const selectedSido = searchParams.get("sido") ?? "";
  const selectedUpkind = searchParams.get("upkind") ?? "";

  const updateFilter = useCallback(
    (key: "sido" | "upkind", value: string) => {
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
          시도별
        </p>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="전체"
            active={!selectedSido}
            onClick={() => updateFilter("sido", "")}
            disabled={isPending}
            variant="emerald"
          />
          {SIDO_CODES.map((sido) => (
            <FilterChip
              key={sido.orgCd}
              label={sido.orgdownNm}
              active={selectedSido === sido.orgCd}
              onClick={() => updateFilter("sido", sido.orgCd)}
              disabled={isPending}
              variant="emerald"
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
          축종별
        </p>
        <div className="flex flex-wrap gap-2">
          {UPKIND_OPTIONS.map((option) => (
            <FilterChip
              key={option.code || "all"}
              label={option.label}
              active={selectedUpkind === option.code}
              onClick={() => updateFilter("upkind", option.code)}
              disabled={isPending}
              variant="emerald"
            />
          ))}
        </div>
      </div>

      {isPending && (
        <p className="text-sm text-emerald-600">필터 적용 중...</p>
      )}
    </div>
  );
}
