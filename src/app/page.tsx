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
  parsePageParam,
  RESCUE_PAGE_SIZE,
  TRAVEL_PAGE_SIZE,
} from "@/lib/pagination";
import { parseMainTab } from "@/lib/tabs";
import {
  fetchAreaCodes,
  fetchCategoryCodes,
  fetchPetTours,
  isApiKeyConfigured,
} from "@/lib/tour-api";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { RescueAnimalItem } from "@/types/animal";
import type { AreaCode, CategoryCode, PetTourItem } from "@/types/tour";

export const revalidate = 1800;

interface HomeProps {
  searchParams: Promise<{
    tab?: string;
    area?: string;
    cat?: string;
    sido?: string;
    upkind?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: HomeProps): Promise<Metadata> {
  const { tab } = await searchParams;
  const activeTab = parseMainTab(tab);

  if (activeTab === "travel") {
    return {
      title: `반려동물동반시설 - ${SITE_NAME}`,
      description:
        "반려동물과 함께 방문할 수 있는 관광지·숙소·음식점 정보를 확인하세요.",
      alternates: { canonical: `${SITE_URL}/?tab=travel` },
    };
  }

  return {
    title: `유기동물보호센터 - ${SITE_NAME}`,
    description:
      "국가동물보호정보시스템 공고 중인 유기동물 보호 현황을 확인하세요.",
    alternates: { canonical: SITE_URL },
  };
}

async function loadRescueData(
  sido?: string,
  upkind?: string,
  page = 1,
) {
  const animalReady = isAnimalApiKeyConfigured();

  if (!animalReady) {
    return { animalReady, rescueItems: [], rescueTotal: 0, rescueError: null };
  }

  const rescueResult = await fetchRescueAnimals({
    uprCd: sido,
    upkind,
    pageNo: page,
    numOfRows: RESCUE_PAGE_SIZE,
  }).catch(
    (error) => ({
      items: [] as RescueAnimalItem[],
      totalCount: 0,
      error:
        error instanceof Error
          ? error.message
          : "구조동물 정보를 불러오지 못했습니다.",
    }),
  );

  return {
    animalReady,
    rescueItems: rescueResult.items,
    rescueTotal: rescueResult.totalCount,
    rescueError:
      "error" in rescueResult ? (rescueResult.error as string) : null,
  };
}

async function loadTravelData(area?: string, cat?: string, page = 1) {
  const tourReady = isApiKeyConfigured();

  if (!tourReady) {
    return {
      tourReady,
      areas: [] as AreaCode[],
      categories: [] as CategoryCode[],
      tourItems: [] as PetTourItem[],
      tourTotal: 0,
    };
  }

  const [areas, categories, tourResult] = await Promise.all([
    fetchAreaCodes(),
    fetchCategoryCodes(),
    fetchPetTours({
      areaCode: area,
      cat1: cat,
      pageNo: page,
      numOfRows: TRAVEL_PAGE_SIZE,
    }),
  ]);

  return {
    tourReady,
    areas,
    categories,
    tourItems: tourResult.items,
    tourTotal: tourResult.totalCount,
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const { tab, area, cat, sido, upkind, page } = await searchParams;
  const activeTab = parseMainTab(tab);
  const currentPage = parsePageParam(page);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          description: "반려동물 동반시설과 유기동물 보호센터 정보 포털",
          inLanguage: "ko-KR",
        }}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === "rescue" ? (
          <RescueSection
            sido={sido}
            upkind={upkind}
            page={currentPage}
            listParams={{
              sido,
              upkind,
              page: currentPage > 1 ? String(currentPage) : undefined,
            }}
          />
        ) : (
          <TravelSection
            area={area}
            cat={cat}
            page={currentPage}
            listParams={{
              tab: "travel",
              area,
              cat,
              page: currentPage > 1 ? String(currentPage) : undefined,
            }}
          />
        )}
      </main>
    </>
  );
}

async function RescueSection({
  sido,
  upkind,
  page,
  listParams,
}: {
  sido?: string;
  upkind?: string;
  page: number;
  listParams: Record<string, string | undefined>;
}) {
  const data = await loadRescueData(sido, upkind, page);

  return (
    <section
      id="rescue"
      aria-labelledby="rescue-section-title"
      className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
    >
      <SectionHeader
        id="rescue-section-title"
        badge="Animal Protection"
        title="유기동물보호센터"
        description="국가동물보호정보시스템 공고 중인 유기동물 보호 현황"
        accent="emerald"
      />

      {!data.animalReady ? (
        <ApiKeyNotice
          serviceName="국가동물보호정보시스템 구조동물 조회 서비스"
          envKey="ANIMAL_API_SERVICE_KEY"
          url="https://www.data.go.kr/data/15098931/openapi.do"
        />
      ) : (
        <>
          <div className="mb-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
            <Suspense fallback={null}>
              <RescueAnimalFilters />
            </Suspense>
          </div>
          {data.rescueError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-900">
              <p className="font-semibold">구조동물 데이터를 불러올 수 없습니다</p>
              <p className="mt-1">{data.rescueError}</p>
            </div>
          ) : (
            <RescueAnimalList
              items={data.rescueItems}
              totalCount={data.rescueTotal}
              currentPage={page}
              pageSize={RESCUE_PAGE_SIZE}
              searchParams={listParams}
            />
          )}
        </>
      )}
    </section>
  );
}

async function TravelSection({
  area,
  cat,
  page,
  listParams,
}: {
  area?: string;
  cat?: string;
  page: number;
  listParams: Record<string, string | undefined>;
}) {
  const data = await loadTravelData(area, cat, page);

  return (
    <section
      id="travel"
      aria-labelledby="travel-section-title"
      className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
    >
      <SectionHeader
        id="travel-section-title"
        badge="Korea Tourism"
        title="반려동물동반시설"
        description="관광지·숙소·음식점 등 반려동물과 함께 방문할 수 있는 장소"
        accent="indigo"
      />

      {!data.tourReady ? (
        <ApiKeyNotice
          serviceName="한국관광공사_반려동물_동반여행_서비스"
          envKey="TOUR_API_SERVICE_KEY"
          url="https://www.data.go.kr/data/15135102/openapi.do"
        />
      ) : (
        <>
          <div className="mb-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
            <Suspense fallback={null}>
              <PetTourFilters areas={data.areas} categories={data.categories} />
            </Suspense>
          </div>
          <PetTourList
            items={data.tourItems}
            totalCount={data.tourTotal}
            currentPage={page}
            pageSize={TRAVEL_PAGE_SIZE}
            searchParams={listParams}
          />
        </>
      )}
    </section>
  );
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
