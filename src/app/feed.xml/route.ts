import { fetchRescueAnimals } from "@/lib/animal-api";
import { fetchPetTours } from "@/lib/tour-api";
import { getRescueAnimalKindLabel } from "@/lib/rescue-animal-utils";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

export async function GET() {
  const [tourResult, rescueResult] = await Promise.all([
    fetchPetTours({ numOfRows: 20 }).catch(() => ({ items: [], totalCount: 0 })),
    fetchRescueAnimals({ numOfRows: 20 }).catch(() => ({
      items: [],
      totalCount: 0,
    })),
  ]);

  const items = [
    ...tourResult.items.map((item) => ({
      title: `${item.title} 반려동물 동반 여행 정보`,
      link: absoluteUrl(`/detail/travel/${item.contentid}`),
      description: [item.addr1, item.addr2].filter(Boolean).join(" "),
      pubDate: item.modifiedtime
        ? formatRssDate(item.modifiedtime)
        : new Date().toUTCString(),
    })),
    ...rescueResult.items.map((item) => {
      const kind = getRescueAnimalKindLabel(item);
      return {
        title: `${kind} 구조동물 보호 정보`,
        link: absoluteUrl(`/detail/rescue/${item.desertionNo}`),
        description: `${item.happenPlace || "발견장소 미상"} · ${item.careNm || ""}`,
        pubDate: item.happenDt
          ? formatRssDate(item.happenDt)
          : new Date().toUTCString(),
      };
    }),
  ];

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(`${SITE_NAME} - 반려동물 통합 정보`)}</title>
    <link>${escapeXml(absoluteUrl("/"))}</link>
    <description>${escapeXml("반려동물 동반 여행과 구조동물 보호 정보")}</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items
      .map(
        (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.pubDate}</pubDate>
      <guid isPermaLink="true">${escapeXml(item.link)}</guid>
    </item>`,
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatRssDate(value: string) {
  if (value.length >= 8) {
    const y = value.slice(0, 4);
    const m = value.slice(4, 6);
    const d = value.slice(6, 8);
    return new Date(`${y}-${m}-${d}`).toUTCString();
  }
  return new Date().toUTCString();
}
