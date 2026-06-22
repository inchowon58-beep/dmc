import { SITE_NAME } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-slate-700">
          {SITE_NAME} 위원장 조춘원
        </p>
        <p className="mt-2 text-xs text-slate-400">
          공공데이터를 활용한 반려동물 정보 서비스
        </p>
      </div>
    </footer>
  );
}
