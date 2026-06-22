import Link from "next/link";
import Image from "next/image";
import type { PetTourItem } from "@/types/tour";

const CATEGORY_LABELS: Record<string, string> = {
  A01: "관광지",
  A02: "문화시설",
  A03: "축제/행사",
  A04: "여행코스",
  A05: "레포츠",
  A06: "숙박",
  A07: "쇼핑",
  A08: "음식",
};

interface PetTourCardProps {
  item: PetTourItem;
}

export default function PetTourCard({ item }: PetTourCardProps) {
  const imageUrl = item.firstimage || item.firstimage2;
  const categoryLabel = CATEGORY_LABELS[item.cat1] ?? "기타";
  const address = [item.addr1, item.addr2].filter(Boolean).join(" ");
  const href = `/detail/travel/${item.contentid}`;

  return (
    <li>
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow-md">
        <Link href={href} className="flex flex-1 flex-col">
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                이미지 없음
              </div>
            )}
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-700 backdrop-blur-sm">
              {categoryLabel}
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-2 p-4">
            <h3 className="line-clamp-2 text-base font-semibold leading-snug text-slate-900 group-hover:text-indigo-700">
              {item.title}
            </h3>
            <p className="line-clamp-2 text-sm text-slate-500">{address}</p>
            {item.tel && (
              <p className="mt-auto pt-1 text-xs text-slate-400">{item.tel}</p>
            )}
          </div>
        </Link>
      </article>
    </li>
  );
}
