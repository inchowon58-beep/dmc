import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { fetchRescueAnimalDetail } from "@/lib/animal-api";
import {
  getRescueAnimalImageSrc,
  getRescueAnimalImageUrl,
  getRescueAnimalImageUrls,
  getRescueAnimalKindLabel,
} from "@/lib/rescue-animal-utils";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

interface RescueDetailPageProps {
  params: Promise<{ id: string }>;
}

const SEX_LABELS: Record<string, string> = {
  M: "수컷",
  F: "암컷",
  Q: "미상",
};

function formatDate(date?: string) {
  if (!date || date.length !== 8) return date ?? "-";
  return `${date.slice(0, 4)}.${date.slice(4, 6)}.${date.slice(6, 8)}`;
}

export async function generateMetadata({
  params,
}: RescueDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const animal = await fetchRescueAnimalDetail(id);

  if (!animal) {
    return {
      title: `구조동물을 찾을 수 없음 - ${SITE_NAME}`,
      robots: { index: false, follow: false },
    };
  }

  const kindLabel = getRescueAnimalKindLabel(animal);
  const sexLabel = SEX_LABELS[animal.sexCd ?? ""] ?? "미상";
  const description = `${kindLabel}(${sexLabel}) 구조동물 보호 정보. 구조일 ${formatDate(animal.happenDt)}, 발견장소 ${animal.happenPlace || "미상"}. ${animal.careNm ? `보호소: ${animal.careNm}` : ""}`;

  const pageUrl = absoluteUrl(`/detail/rescue/${id}`);
  const ogImage = getRescueAnimalImageUrl(animal);

  return {
    title: `${kindLabel} 구조동물 보호 정보 - ${SITE_NAME}`,
    description: description.slice(0, 160),
    alternates: { canonical: pageUrl },
    openGraph: {
      title: `${kindLabel} 구조동물 - ${SITE_NAME}`,
      description,
      url: pageUrl,
      type: "article",
      images: ogImage ? [{ url: ogImage }] : undefined,
      locale: "ko_KR",
      siteName: SITE_NAME,
    },
  };
}

export default async function RescueDetailPage({
  params,
}: RescueDetailPageProps) {
  const { id } = await params;
  const animal = await fetchRescueAnimalDetail(id);

  if (!animal) notFound();

  const kindLabel = getRescueAnimalKindLabel(animal);
  const sexLabel = SEX_LABELS[animal.sexCd ?? ""] ?? "미상";
  const pageUrl = absoluteUrl(`/detail/rescue/${id}`);
  const imageUrls = getRescueAnimalImageUrls(animal);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `${kindLabel} 구조동물 보호 정보`,
          description: `${kindLabel} 구조동물. 발견장소 ${animal.happenPlace || "미상"}`,
          url: pageUrl,
          image: imageUrls[0],
          datePublished: animal.happenDt,
        }}
      />

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <nav aria-label="breadcrumb">
          <ol className="mb-6 flex flex-wrap gap-2 text-sm text-slate-500">
            <li>
              <Link href="/" className="hover:text-emerald-600">
                홈
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/" className="hover:text-emerald-600">
                유기동물보호센터
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-slate-700">{kindLabel}</li>
          </ol>
        </nav>

        <article itemScope itemType="https://schema.org/Article">
          {imageUrls.length > 0 && (
            <div className="mb-6 grid gap-3 sm:grid-cols-2">
              {imageUrls.map((_, index) => {
                const src = getRescueAnimalImageSrc(animal, index);
                if (!src) return null;
                return (
                  <figure
                    key={index}
                    className="overflow-hidden rounded-2xl bg-slate-100"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`${kindLabel} 구조동물 사진 ${index + 1}`}
                      className="aspect-square w-full object-cover"
                      itemProp={index === 0 ? "image" : undefined}
                    />
                  </figure>
                );
              })}
            </div>
          )}

          <header>
            <p className="text-sm font-medium text-emerald-600">구조동물 보호 현황</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900" itemProp="headline">
              {kindLabel} 보호 정보
            </h1>
            {animal.processState && (
              <p className="mt-2 inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
                {animal.processState}
              </p>
            )}
          </header>

          <section className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">동물 정보</h2>
            <dl className="mt-3 grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm">
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-slate-400">품종</dt>
                <dd>{kindLabel}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-slate-400">성별</dt>
                <dd>{sexLabel}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-slate-400">구조일</dt>
                <dd>
                  <time dateTime={animal.happenDt}>{formatDate(animal.happenDt)}</time>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-slate-400">발견장소</dt>
                <dd itemProp="description">{animal.happenPlace || "-"}</dd>
              </div>
              {animal.age && (
                <div className="flex gap-3">
                  <dt className="w-24 shrink-0 text-slate-400">나이</dt>
                  <dd>{animal.age}</dd>
                </div>
              )}
              {animal.weight && (
                <div className="flex gap-3">
                  <dt className="w-24 shrink-0 text-slate-400">체중</dt>
                  <dd>{animal.weight}</dd>
                </div>
              )}
            </dl>
          </section>

          {animal.careNm && (
            <section className="mt-8">
              <h2 className="text-lg font-semibold text-slate-900">보호소 정보</h2>
              <dl className="mt-3 grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm">
                <div className="flex gap-3">
                  <dt className="w-24 shrink-0 text-slate-400">보호소</dt>
                  <dd>{animal.careNm}</dd>
                </div>
                {animal.careAddr && (
                  <div className="flex gap-3">
                    <dt className="w-24 shrink-0 text-slate-400">주소</dt>
                    <dd>{animal.careAddr}</dd>
                  </div>
                )}
                {animal.careTel && (
                  <div className="flex gap-3">
                    <dt className="w-24 shrink-0 text-slate-400">연락처</dt>
                    <dd>{animal.careTel}</dd>
                  </div>
                )}
              </dl>
            </section>
          )}

          {(animal.noticeSdt || animal.noticeEdt) && (
            <section className="mt-8">
              <h2 className="text-lg font-semibold text-slate-900">공고 기간</h2>
              <p className="mt-2 text-base text-slate-600">
                <time dateTime={animal.noticeSdt}>{formatDate(animal.noticeSdt)}</time>
                {" ~ "}
                <time dateTime={animal.noticeEdt}>{formatDate(animal.noticeEdt)}</time>
              </p>
            </section>
          )}

          {animal.specialMark && (
            <section className="mt-8">
              <h2 className="text-lg font-semibold text-slate-900">특이사항</h2>
              <p className="mt-2 text-base leading-relaxed text-slate-600">
                {animal.specialMark}
              </p>
            </section>
          )}
        </article>
      </main>
    </>
  );
}
