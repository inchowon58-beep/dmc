export interface AnimalApiResponse<T> {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: T | "" | { item: T | T[] };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

export interface SidoCode {
  orgCd: string;
  orgdownNm: string;
}

export interface RescueAnimalItem {
  desertionNo: string;
  happenDt: string;
  happenPlace: string;
  kindCd: string;
  kindNm?: string;
  kindFullNm?: string;
  upKindCd?: string;
  upKindNm?: string;
  colorCd?: string;
  age?: string;
  weight?: string;
  noticeNo?: string;
  noticeSdt?: string;
  noticeEdt?: string;
  /** API v1 */
  popfile?: string;
  /** API v2 */
  popfile1?: string;
  popfile2?: string;
  processState?: string;
  sexCd?: string;
  neuterYn?: string;
  specialMark?: string;
  careNm?: string;
  careAddr?: string;
  careTel?: string;
  officetel?: string;
}

export interface RescueAnimalFilters {
  uprCd?: string;
  upkind?: string;
  pageNo?: number;
  numOfRows?: number;
}

export const UPKIND_OPTIONS = [
  { code: "", label: "전체" },
  { code: "417000", label: "개" },
  { code: "422400", label: "고양이" },
  { code: "429900", label: "기타" },
] as const;

export const SIDO_CODES: SidoCode[] = [
  { orgCd: "6110000", orgdownNm: "서울" },
  { orgCd: "6260000", orgdownNm: "부산" },
  { orgCd: "6270000", orgdownNm: "대구" },
  { orgCd: "6280000", orgdownNm: "인천" },
  { orgCd: "6290000", orgdownNm: "광주" },
  { orgCd: "6300000", orgdownNm: "대전" },
  { orgCd: "6310000", orgdownNm: "울산" },
  { orgCd: "6410000", orgdownNm: "경기" },
  { orgCd: "6420000", orgdownNm: "강원" },
  { orgCd: "6430000", orgdownNm: "충북" },
  { orgCd: "6440000", orgdownNm: "충남" },
  { orgCd: "6450000", orgdownNm: "전북" },
  { orgCd: "6460000", orgdownNm: "전남" },
  { orgCd: "6470000", orgdownNm: "경북" },
  { orgCd: "6480000", orgdownNm: "경남" },
  { orgCd: "6500000", orgdownNm: "제주" },
  { orgCd: "6530000", orgdownNm: "세종" },
];
