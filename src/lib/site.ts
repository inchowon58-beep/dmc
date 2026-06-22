export const SITE_NAME = "펫포탈";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://petpotal.ttpk.co.kr";

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
