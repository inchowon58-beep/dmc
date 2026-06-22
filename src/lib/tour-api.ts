import { cache } from "react";
import type {
  AreaCode,
  CategoryCode,
  PetTourDetail,
  PetTourFilters,
  PetTourItem,
  PetTourPetDetail,
  TourApiResponse,
} from "@/types/tour";
import {
  cachedFetch,
  STATIC_DATA_REVALIDATE_SECONDS,
} from "@/lib/cache";

const BASE_URL = "https://apis.data.go.kr/B551011/KorPetTourService2";

const DEFAULT_PARAMS = {
  MobileOS: "ETC",
  MobileApp: "PetTravelApp",
  _type: "json",
} as const;

function getServiceKey(): string {
  const key = process.env.TOUR_API_SERVICE_KEY;
  if (!key || key === "your_service_key_here") {
    throw new Error(
      "TOUR_API_SERVICE_KEY가 설정되지 않았습니다. .env.local 파일에 공공데이터포털 인증키를 추가해 주세요.",
    );
  }
  return key;
}

function unwrapItems<T>(items: T | T[] | "" | { item: T | T[] } | undefined): T[] {
  if (!items || items === "") return [];
  if (Array.isArray(items)) return items as T[];
  if (typeof items === "object" && "item" in items) {
    const item = items.item;
    return Array.isArray(item) ? item : [item];
  }
  return [items];
}

async function fetchTourApi<T>(
  path: string,
  params: Record<string, string | number | undefined>,
): Promise<TourApiResponse<T>> {
  const searchParams = new URLSearchParams({
    serviceKey: getServiceKey(),
    ...DEFAULT_PARAMS,
  });

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  }

  const url = `${BASE_URL}/${path}?${searchParams.toString()}`;
  const revalidate =
    path === "areaCode2" || path === "categoryCode2"
      ? STATIC_DATA_REVALIDATE_SECONDS
      : 1800;
  const res = await cachedFetch(url, revalidate);

  if (!res.ok) {
    throw new Error(`API 요청 실패: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as TourApiResponse<T>;
  const { resultCode, resultMsg } = data.response.header;

  if (resultCode !== "0000") {
    throw new Error(`API 오류 (${resultCode}): ${resultMsg}`);
  }

  return data;
}

export const fetchAreaCodes = cache(async (): Promise<AreaCode[]> => {
  const data = await fetchTourApi<AreaCode>("areaCode2", {
    numOfRows: 50,
    pageNo: 1,
  });
  return unwrapItems(data.response.body.items);
});

export const fetchCategoryCodes = cache(async (): Promise<CategoryCode[]> => {
  const data = await fetchTourApi<CategoryCode>("categoryCode2", {
    numOfRows: 50,
    pageNo: 1,
  });
  return unwrapItems(data.response.body.items);
});

export const fetchPetTours = cache(async (
  filters: PetTourFilters = {},
): Promise<{ items: PetTourItem[]; totalCount: number }> => {
  const data = await fetchTourApi<PetTourItem>("areaBasedList2", {
    numOfRows: filters.numOfRows ?? 12,
    pageNo: filters.pageNo ?? 1,
    areaCode: filters.areaCode,
    cat1: filters.cat1,
    arrange: "C",
  });

  return {
    items: unwrapItems(data.response.body.items),
    totalCount: data.response.body.totalCount ?? 0,
  };
});

export const fetchPetTourDetail = cache(async (
  contentId: string,
): Promise<{ common: PetTourDetail; pet?: PetTourPetDetail } | null> => {
  try {
    const [commonData, petData] = await Promise.all([
      fetchTourApi<PetTourDetail>("detailCommon2", {
        contentId,
      }),
      fetchTourApi<PetTourPetDetail>("detailPetTour2", {
        contentId,
      }).catch(() => null),
    ]);

    const commonItems = unwrapItems(commonData.response.body.items);
    if (commonItems.length === 0) return null;

    const petItems = petData
      ? unwrapItems(petData.response.body.items)
      : [];

    return {
      common: commonItems[0],
      pet: petItems[0],
    };
  } catch {
    return null;
  }
});

export async function fetchPetTourItemsForSitemap(
  maxItems = 500,
): Promise<PetTourItem[]> {
  if (!isApiKeyConfigured()) return [];

  const collected: PetTourItem[] = [];
  let pageNo = 1;

  while (collected.length < maxItems) {
    const { items, totalCount } = await fetchPetTours({
      pageNo,
      numOfRows: 100,
    });

    if (items.length === 0) break;

    collected.push(...items);

    if (collected.length >= totalCount) break;
    pageNo += 1;
  }

  return collected.slice(0, maxItems);
}

export function isApiKeyConfigured(): boolean {
  const key = process.env.TOUR_API_SERVICE_KEY;
  return Boolean(key && key !== "your_service_key_here");
}
