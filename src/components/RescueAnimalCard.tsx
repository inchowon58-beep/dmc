import Link from "next/link";
import type { RescueAnimalItem } from "@/types/animal";
import {
  getRescueAnimalImageSrc,
  getRescueAnimalKindLabel,
} from "@/lib/rescue-animal-utils";

const SEX_LABELS: Record<string, string> = {
  M: "수컷",
  F: "암컷",
  Q: "미상",
};

const NEUTER_LABELS: Record<string, string> = {
  Y: "중성화",
  N: "미중성",
  U: "미상",
};

function formatDate(date?: string) {
  if (!date || date.length !== 8) return date ?? "-";
  return `${date.slice(0, 4)}.${date.slice(4, 6)}.${date.slice(6, 8)}`;
}

interface RescueAnimalCardProps {
  item: RescueAnimalItem;
}

export default function RescueAnimalCard({ item }: RescueAnimalCardProps) {
  const kindLabel = getRescueAnimalKindLabel(item);
  const sexLabel = SEX_LABELS[item.sexCd ?? ""] ?? "미상";
  const neuterLabel = NEUTER_LABELS[item.neuterYn ?? ""] ?? "";
  const href = `/detail/rescue/${item.desertionNo}`;
  const imageSrc = getRescueAnimalImageSrc(item);

  return (
    <li>
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow-md">
        <Link href={href} className="flex flex-1 flex-col">
          <div className="relative aspect-square overflow-hidden bg-slate-100">
            {imageSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc}
                alt={`${kindLabel} 구조동물`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                사진 없음
              </div>
            )}
            {item.processState && (
              <span className="absolute left-3 top-3 rounded-full bg-emerald-600/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {item.processState}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-slate-900 group-hover:text-emerald-700">
                {kindLabel}
              </h3>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                {sexLabel}
                {neuterLabel ? ` · ${neuterLabel}` : ""}
              </span>
            </div>

            <dl className="space-y-1 text-sm text-slate-500">
              <div className="flex gap-2">
                <dt className="shrink-0 text-slate-400">구조일</dt>
                <dd>
                  <time dateTime={item.happenDt}>{formatDate(item.happenDt)}</time>
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="shrink-0 text-slate-400">발견장소</dt>
                <dd className="line-clamp-1">{item.happenPlace || "-"}</dd>
              </div>
              {item.careNm && (
                <div className="flex gap-2">
                  <dt className="shrink-0 text-slate-400">보호소</dt>
                  <dd className="line-clamp-1">{item.careNm}</dd>
                </div>
              )}
            </dl>

            {(item.noticeSdt || item.noticeEdt) && (
              <p className="mt-auto pt-2 text-xs text-emerald-700">
                공고 {formatDate(item.noticeSdt)} ~ {formatDate(item.noticeEdt)}
              </p>
            )}
          </div>
        </Link>
      </article>
    </li>
  );
}
