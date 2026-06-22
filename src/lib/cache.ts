import { cache } from "react";

export const HOME_REVALIDATE_SECONDS = 1800;
export const STATIC_DATA_REVALIDATE_SECONDS = 86400;

export const cachedFetch = cache(
  async (url: string, revalidate: number): Promise<Response> => {
    return fetch(url, {
      next: { revalidate },
      signal: AbortSignal.timeout(12_000),
    });
  },
);
