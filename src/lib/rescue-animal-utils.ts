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

/** HTTPS 사이트 mixed-content 방지 + 핫링크 이슈 대비 서버 프록시 경로 */
export function getRescueAnimalImageSrc(
  item: RescueAnimalItem,
  index = 0,
): string | undefined {
  const url = getRescueAnimalImageUrls(item)[index];
  if (!url) return undefined;
  return `/api/animal-image?url=${encodeURIComponent(url)}`;
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
