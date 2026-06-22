import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { fetchPetTourDetail } from "@/lib/tour-api";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

interface TravelDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: TravelDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const detail = await fetchPetTourDetail(id);

  if (!detail) {
    return {
      title: `장소를 찾을 수 없음 - ${SITE_NAME}`,
      robots: { index: false, follow: false },
    };
  }

  const { common } = detail;
  const address = [common.addr1, common.addr2].filter(Boolean).join(" ");
  const description =
    common.overview?.replace(/<[^>]+>/g, "").slice(0, 155) ||
    `${common.title} 반려동물 동반 여행 정보. ${address}`;

  const pageUrl = absoluteUrl(`/detail/travel/${id}`);

  return {
    title: `${common.title} 반려동물 동반 여행 정보 - ${SITE_NAME}`,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: `${common.title} - ${SITE_NAME}`,
      description,
      url: pageUrl,
      type: "article",
      images: common.firstimage ? [{ url: common.firstimage }] : undefined,
      locale: "ko_KR",
      siteName: SITE_NAME,
    },
  };
}

export default async function TravelDetailPage({
  params,
}: TravelDetailPageProps) {
  const { id } = await params;
  const detail = await fetchPetTourDetail(id);

  if (!detail) notFound();

  const { common, pet } = detail;
  const address = [common.addr1, common.addr2].filter(Boolean).join(" ");
  const imageUrl = common.firstimage || common.firstimage2;
  const pageUrl = absoluteUrl(`/detail/travel/${id}`);
  const overviewText = common.overview?.replace(/<[^>]+>/g, "") ?? "";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TouristAttraction",
          name: common.title,
          description: overviewText || descriptionFallback(common.title, address),
          url: pageUrl,
          image: imageUrl,
          address: address || undefined,
          telephone: common.tel,
        }}
      />

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <nav aria-label="breadcrumb">
          <ol className="mb-6 flex flex-wrap gap-2 text-sm text-slate-500">
            <li>
              <Link href="/" className="hover:text-indigo-600">
                홈
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/?tab=travel" className="hover:text-indigo-600">
                반려동물동반시설
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-slate-700">{common.title}</li>
          </ol>
        </nav>

        <article itemScope itemType="https://schema.org/TouristAttraction">
          {imageUrl && (
            <figure className="relative mb-6 aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100">
              <Image
                src={imageUrl}
                alt={common.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </figure>
          )}

          <header>
            <p className="text-sm font-medium text-indigo-600">반려동물 동반 여행</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900" itemProp="name">
              {common.title}
            </h1>
            {address && (
              <p className="mt-2 text-base text-slate-600" itemProp="address">
                {address}
              </p>
            )}
          </header>

          <section className="mt-8 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">기본 정보</h2>
            <dl className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm">
              {common.tel && (
                <div className="flex gap-3">
                  <dt className="w-20 shrink-0 text-slate-400">연락처</dt>
                  <dd itemProp="telephone">{common.tel}</dd>
                </div>
              )}
              {common.homepage && (
                <div className="flex gap-3">
                  <dt className="w-20 shrink-0 text-slate-400">홈페이지</dt>
                  <dd>
                    <a
                      href={common.homepage}
                      className="text-indigo-600 underline"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      방문하기
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {overviewText && (
            <section className="mt-8">
              <h2 className="text-lg font-semibold text-slate-900">소개</h2>
              <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-slate-600" itemProp="description">
                {overviewText}
              </p>
            </section>
          )}

          {(pet?.etcAcmpyInfo ||
            pet?.acmpyPsblCpam ||
            pet?.acmpyNeedMtr ||
            pet?.relaAcdntRiskMtr) && (
            <section className="mt-8">
              <h2 className="text-lg font-semibold text-slate-900">반려동물 동반 안내</h2>
              <dl className="mt-3 grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm">
                {pet.acmpyPsblCpam && (
                  <div className="flex gap-3">
                    <dt className="w-28 shrink-0 text-slate-400">동반 가능</dt>
                    <dd>{pet.acmpyPsblCpam}</dd>
                  </div>
                )}
                {pet.acmpyTypeCd && (
                  <div className="flex gap-3">
                    <dt className="w-28 shrink-0 text-slate-400">동반 유형</dt>
                    <dd>{pet.acmpyTypeCd}</dd>
                  </div>
                )}
                {pet.acmpyNeedMtr && (
                  <div className="flex gap-3">
                    <dt className="w-28 shrink-0 text-slate-400">필수 사항</dt>
                    <dd>{pet.acmpyNeedMtr}</dd>
                  </div>
                )}
                {pet.relaAcdntRiskMtr && (
                  <div className="flex gap-3">
                    <dt className="w-28 shrink-0 text-slate-400">주의 사항</dt>
                    <dd>{pet.relaAcdntRiskMtr}</dd>
                  </div>
                )}
              </dl>
              {pet.etcAcmpyInfo && (
                <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-slate-600">
                  {pet.etcAcmpyInfo}
                </p>
              )}
            </section>
          )}
        </article>
      </main>
    </>
  );
}

function descriptionFallback(title: string, address: string) {
  return `${title} 반려동물 동반 여행 정보${address ? ` · ${address}` : ""}`;
}
