"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { parseMainTab, type MainTab } from "@/lib/tabs";
import { SITE_NAME } from "@/lib/site";

const NAV_ITEMS: { tab: MainTab; label: string }[] = [
  { tab: "rescue", label: "유기동물보호센터" },
  { tab: "travel", label: "반려동물동반시설" },
];

function buildTabHref(tab: MainTab, searchParams: URLSearchParams): string {
  const params = new URLSearchParams();

  if (tab === "travel") {
    params.set("tab", "travel");
    const area = searchParams.get("area");
    const cat = searchParams.get("cat");
    if (area) params.set("area", area);
    if (cat) params.set("cat", cat);
  } else {
    const sido = searchParams.get("sido");
    const upkind = searchParams.get("upkind");
    if (sido) params.set("sido", sido);
    if (upkind) params.set("upkind", upkind);
  }

  const query = params.toString();
  return query ? `/?${query}` : "/";
}

export default function MainNav() {
  const searchParams = useSearchParams();
  const activeTab = parseMainTab(searchParams.get("tab"));

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <span className="text-lg font-bold tracking-tight text-slate-900">
            {SITE_NAME}
          </span>
        </Link>

        <nav
          aria-label="메인 메뉴"
          className="flex gap-1 rounded-full bg-slate-100 p-1"
        >
          {NAV_ITEMS.map(({ tab, label }) => {
            const isActive = activeTab === tab;
            const href = buildTabHref(tab, searchParams);

            return (
              <Link
                key={tab}
                href={href}
                className={[
                  "rounded-full px-4 py-2 text-sm font-medium transition-all",
                  isActive
                    ? tab === "rescue"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900",
                ].join(" ")}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
