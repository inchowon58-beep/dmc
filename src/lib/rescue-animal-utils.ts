import type { RescueAnimalItem } from "@/types/animal";

/** API v2는 popfile 대신 popfile1, popfile2 필드를 사용합니다. */
export function getRescueAnimalImageUrls(item: RescueAnimalItem): string[] {
  const candidates = [item.popfile1, item.popfile2, item.popfile].filter(
    (url): url is string => Boolean(url),
  );

  return [...new Set(candidates.map(normalizeAnimalImageUrl))];
}

export function getRescueAnimalImageUrl(
  item: RescueAnimalItem,
): string | undefined {
  return getRescueAnimalImageUrls(item)[0];
}

/** 브라우저에서 직접 로드 (이미지 프록시보다 빠름) */
export function getRescueAnimalImageSrc(
  item: RescueAnimalItem,
  index = 0,
): string | undefined {
  return getRescueAnimalImageUrls(item)[index];
}

export function getRescueAnimalKindLabel(item: RescueAnimalItem): string {
  if (item.kindFullNm) {
    return item.kindFullNm.replace(/^\[([^\]]+)\]\s*/, "$1 · ");
  }
  if (item.kindNm && item.upKindNm) {
    return `${item.upKindNm} · ${item.kindNm}`;
  }
  return item.kindNm ?? item.kindCd?.split(" [")[0] ?? "구조동물";
}

function normalizeAnimalImageUrl(url: string): string {
  return url.replace(/^http:\/\//i, "https://");
}
