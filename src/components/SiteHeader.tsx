import { Suspense } from "react";
import MainNav from "@/components/MainNav";

export default function SiteHeader() {
  return (
    <Suspense
      fallback={
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white">
          <div className="mx-auto h-16 max-w-7xl px-4 sm:px-6 lg:px-8" />
        </header>
      }
    >
      <MainNav />
    </Suspense>
  );
}
