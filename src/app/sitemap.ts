import type { MetadataRoute } from "next";
import { fetchRescueAnimalsForSitemap } from "@/lib/animal-api";
import { fetchPetTourItemsForSitemap } from "@/lib/tour-api";
import { SITE_URL, absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tourItems, rescueItems] = await Promise.all([
    fetchPetTourItemsForSitemap(500),
    fetchRescueAnimalsForSitemap(500).catch(() => []),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  const tourRoutes: MetadataRoute.Sitemap = tourItems.map((item) => ({
    url: absoluteUrl(`/detail/travel/${item.contentid}`),
    lastModified: item.modifiedtime
      ? parseModifiedTime(item.modifiedtime)
      : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const rescueRoutes: MetadataRoute.Sitemap = rescueItems.map((item) => ({
    url: absoluteUrl(`/detail/rescue/${item.desertionNo}`),
    lastModified: item.noticeSdt
      ? parseModifiedTime(item.noticeSdt)
      : new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...tourRoutes, ...rescueRoutes];
}

function parseModifiedTime(value: string): Date {
  if (value.length === 14) {
    const y = value.slice(0, 4);
    const m = value.slice(4, 6);
    const d = value.slice(6, 8);
    return new Date(`${y}-${m}-${d}`);
  }
  if (value.length === 8) {
    const y = value.slice(0, 4);
    const m = value.slice(4, 6);
    const d = value.slice(6, 8);
    return new Date(`${y}-${m}-${d}`);
  }
  return new Date();
}
