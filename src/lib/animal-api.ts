import { cache } from "react";
import type {
  AnimalApiResponse,
  RescueAnimalFilters,
  RescueAnimalItem,
} from "@/types/animal";
import { cachedFetch } from "@/lib/cache";
import { RESCUE_PAGE_SIZE } from "@/lib/pagination";

const BASE_URL =
  "https://apis.data.go.kr/1543061/abandonmentPublicService_v2";

function getServiceKey(): string {
  const key = process.env.ANIMAL_API_SERVICE_KEY;
  if (!key || key === "your_service_key_here") {
    throw new Error(
      "ANIMAL_API_SERVICE_KEY가 설정되지 않았습니다. .env.local 파일에 인증키를 추가해 주세요.",
    );
  }
  return key;
}

function unwrapItems<T>(items: T | T[] | "" | { item: T | T[] } | undefined): T[] {
  if (!items || items === "") return [];
  if (Array.isArray(items)) return items;
  if (typeof items === "object" && "item" in items) {
    const item = items.item;
    return Array.isArray(item) ? item : [item];
  }
  return [items];
}

function getDateRange(days = 30): { bgnde: string; endde: string } {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);

  const fmt = (date: Date) =>
    date.toISOString().slice(0, 10).replace(/-/g, "");

  return { bgnde: fmt(start), endde: fmt(end) };
}

async function fetchAnimalApi<T>(
  path: string,
  params: Record<string, string | number | undefined>,
): Promise<AnimalApiResponse<T>> {
  const searchParams = new URLSearchParams({
    serviceKey: getServiceKey(),
    _type: "json",
  });

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  }

  const url = `${BASE_URL}/${path}?${searchParams.toString()}`;
  const res = await cachedFetch(url, 1800);

  if (res.status === 403) {
    throw new Error(
      "구조동물 API 인증이 거부되었습니다. 공공데이터포털에서 '구조동물 조회 서비스' 활용 신청이 완료되었는지 확인해 주세요.",
    );
  }

  if (!res.ok) {
    throw new Error(`구조동물 API 요청 실패: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as AnimalApiResponse<T>;
  const { resultCode, resultMsg } = data.response.header;

  if (resultCode !== "00" && resultCode !== "0000") {
    throw new Error(`구조동물 API 오류 (${resultCode}): ${resultMsg}`);
  }

  return data;
}

export const fetchRescueAnimals = cache(async (
  filters: RescueAnimalFilters = {},
): Promise<{ items: RescueAnimalItem[]; totalCount: number }> => {
  const { bgnde, endde } = getDateRange(60);

  const data = await fetchAnimalApi<RescueAnimalItem>("abandonmentPublic_v2", {
    numOfRows: filters.numOfRows ?? RESCUE_PAGE_SIZE,
    pageNo: filters.pageNo ?? 1,
    bgnde,
    endde,
    upr_cd: filters.uprCd,
    upkind: filters.upkind,
    state: "notice",
  });

  return {
    items: unwrapItems(data.response.body.items),
    totalCount: data.response.body.totalCount ?? 0,
  };
});

export const fetchRescueAnimalDetail = cache(async (
  desertionNo: string,
): Promise<RescueAnimalItem | null> => {
  try {
    const { bgnde, endde } = getDateRange(365);

    const data = await fetchAnimalApi<RescueAnimalItem>(
      "abandonmentPublic_v2",
      {
        numOfRows: 1,
        pageNo: 1,
        bgnde,
        endde,
        desertion_no: desertionNo,
      },
    );

    const items = unwrapItems(data.response.body.items);
    return items[0] ?? null;
  } catch {
    return null;
  }
});

export async function fetchRescueAnimalsForSitemap(
  maxItems = 500,
): Promise<RescueAnimalItem[]> {
  if (!isAnimalApiKeyConfigured()) return [];

  const collected: RescueAnimalItem[] = [];
  let pageNo = 1;
  const { bgnde, endde } = getDateRange(60);

  while (collected.length < maxItems) {
    const data = await fetchAnimalApi<RescueAnimalItem>(
      "abandonmentPublic_v2",
      {
        numOfRows: 100,
        pageNo,
        bgnde,
        endde,
        state: "notice",
      },
    );

    const items = unwrapItems(data.response.body.items);
    const totalCount = data.response.body.totalCount ?? 0;

    if (items.length === 0) break;

    collected.push(...items);

    if (collected.length >= totalCount) break;
    pageNo += 1;
  }

  return collected.slice(0, maxItems);
}

export function isAnimalApiKeyConfigured(): boolean {
  const key = process.env.ANIMAL_API_SERVICE_KEY;
  return Boolean(key && key !== "your_service_key_here");
}
