import type { Metadata } from "next";
import { Suspense } from "react";
import JsonLd from "@/components/JsonLd";
import PetTourFilters from "@/components/PetTourFilters";
import PetTourList from "@/components/PetTourList";
import RescueAnimalFilters from "@/components/RescueAnimalFilters";
import RescueAnimalList from "@/components/RescueAnimalList";
import SectionHeader from "@/components/SectionHeader";
import {
  fetchRescueAnimals,
  isAnimalApiKeyConfigured,
} from "@/lib/animal-api";
import {
  fetchAreaCodes,
  fetchCategoryCodes,
  fetchPetTours,
  isApiKeyConfigured,
} from "@/lib/tour-api";
import { SITE_NAME, SITE_URL } from "@/lib/site";

interface HomeProps {
  searchParams: Promise<{
    area?: string;
    cat?: string;
    sido?: string;
    upkind?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `반려동물 통합 정보 - ${SITE_NAME}`,
    description:
      "반려동물 동반 여행 장소와 구조동물 보호 정보. 서버에서 API 데이터를 렌더링하여 검색 엔진이 콘텐츠를 수집할 수 있습니다.",
    alternates: { canonical: SITE_URL },
  };
}

function FiltersSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-full animate-pulse rounded-lg bg-slate-200" />
      <div className="h-8 w-2/3 animate-pulse rounded-lg bg-slate-200" />
    </div>
  );
}

function ListSkeleton({ tall = false }: { tall?: boolean }) {
  return (
    <div
      className={`grid gap-4 ${tall ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"}`}
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse rounded-2xl bg-slate-200 ${tall ? "aspect-square" : "h-56"}`}
        />
      ))}
    </div>
  );
}

async function PetTourListSection({
  area,
  cat,
}: {
  area?: string;
  cat?: string;
}) {
  const { items, totalCount } = await fetchPetTours({
    areaCode: area,
    cat1: cat,
  });

  return <PetTourList items={items} totalCount={totalCount} />;
}

async function RescueAnimalListSection({
  sido,
  upkind,
}: {
  sido?: string;
  upkind?: string;
}) {
  try {
    const { items, totalCount } = await fetchRescueAnimals({
      uprCd: sido,
      upkind,
    });

    return <RescueAnimalList items={items} totalCount={totalCount} />;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "구조동물 정보를 불러오지 못했습니다.";

    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-900">
        <p className="font-semibold">구조동물 데이터를 불러올 수 없습니다</p>
        <p className="mt-1">{message}</p>
        <p className="mt-2">
          <a
            href="https://www.data.go.kr/data/15098931/openapi.do"
            className="underline hover:text-rose-700"
            target="_blank"
            rel="noreferrer"
          >
            공공데이터포털
          </a>
          에서 &apos;구조동물 조회 서비스&apos; 활용 신청 후{" "}
          <code className="rounded bg-rose-100 px-1">ANIMAL_API_SERVICE_KEY</code>를
          설정해 주세요.
        </p>
      </div>
    );
  }
}

export default async function Home({ searchParams }: HomeProps) {
  const { area, cat, sido, upkind } = await searchParams;
  const tourReady = isApiKeyConfigured();
  const animalReady = isAnimalApiKeyConfigured();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          description: "반려동물 동반 여행과 구조동물 보호 정보 포털",
          inLanguage: "ko-KR",
        }}
      />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10 text-center sm:text-left">
          <p className="text-sm font-medium text-slate-500">Pet Life Hub</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            반려동물 통합 정보
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-base text-slate-500 sm:mx-0">
            동반 여행 장소와 구조동물 보호 정보를 한곳에서 확인하세요.
          </p>
        </header>

        <div className="grid gap-8 xl:grid-cols-2">
          <section
            id="travel"
            aria-labelledby="travel-section-title"
            className="flex flex-col rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
          >
          <SectionHeader
            id="travel-section-title"
            badge="Korea Tourism"
            title="반려동물 동반 여행"
            description="관광지·숙소·음식점 등 동반 가능한 장소"
            accent="indigo"
          />

          {!tourReady ? (
            <ApiKeyNotice
              serviceName="한국관광공사_반려동물_동반여행_서비스"
              envKey="TOUR_API_SERVICE_KEY"
              url="https://www.data.go.kr/data/15135102/openapi.do"
            />
          ) : (
            <>
              <div className="mb-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <Suspense fallback={<FiltersSkeleton />}>
                  <PetTourFiltersWrapper />
                </Suspense>
              </div>
              <Suspense
                key={`tour-${area ?? ""}-${cat ?? ""}`}
                fallback={<ListSkeleton />}
              >
                <PetTourListSection area={area} cat={cat} />
              </Suspense>
            </>
          )}
        </section>

        <section
          id="rescue"
          aria-labelledby="rescue-section-title"
          className="flex flex-col rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
        >
          <SectionHeader
            id="rescue-section-title"
            badge="Animal Protection"
            title="구조동물 보호 현황"
            description="국가동물보호정보시스템 공고 중인 구조동물"
            accent="emerald"
          />

          {!animalReady ? (
            <ApiKeyNotice
              serviceName="국가동물보호정보시스템 구조동물 조회 서비스"
              envKey="ANIMAL_API_SERVICE_KEY"
              url="https://www.data.go.kr/data/15098931/openapi.do"
            />
          ) : (
            <>
              <div className="mb-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <Suspense fallback={<FiltersSkeleton />}>
                  <RescueAnimalFilters />
                </Suspense>
              </div>
              <Suspense
                key={`rescue-${sido ?? ""}-${upkind ?? ""}`}
                fallback={<ListSkeleton tall />}
              >
                <RescueAnimalListSection sido={sido} upkind={upkind} />
              </Suspense>
            </>
          )}
        </section>
      </div>
    </main>
    </>
  );
}

async function PetTourFiltersWrapper() {
  const [areas, categories] = await Promise.all([
    fetchAreaCodes(),
    fetchCategoryCodes(),
  ]);

  return <PetTourFilters areas={areas} categories={categories} />;
}

function ApiKeyNotice({
  serviceName,
  envKey,
  url,
}: {
  serviceName: string;
  envKey: string;
  url: string;
}) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
      <p className="font-semibold">API 키 설정이 필요합니다</p>
      <p className="mt-1">
        <a
          href={url}
          className="underline hover:text-amber-700"
          target="_blank"
          rel="noreferrer"
        >
          공공데이터포털
        </a>
        에서 &apos;{serviceName}&apos; 활용 신청 후{" "}
        <code className="rounded bg-amber-100 px-1">{envKey}</code>를 .env.local에
        추가해 주세요.
      </p>
    </div>
  );
}
