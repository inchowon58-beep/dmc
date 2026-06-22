export type MainTab = "rescue" | "travel";

export const DEFAULT_TAB: MainTab = "rescue";

export function parseMainTab(tab?: string | null): MainTab {
  return tab === "travel" ? "travel" : "rescue";
}

export function tabHref(tab: MainTab): string {
  return tab === "travel" ? "/?tab=travel" : "/";
}
