export interface TourApiResponse<T> {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: T | "" | { item: T };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

export interface AreaCode {
  code: string;
  name: string;
  rnum?: string;
}

export interface CategoryCode {
  code: string;
  name: string;
  rnum?: string;
}

export interface PetTourItem {
  addr1: string;
  addr2?: string;
  areacode: string;
  cat1: string;
  cat2?: string;
  cat3?: string;
  contentid: string;
  contenttypeid: string;
  firstimage?: string;
  firstimage2?: string;
  mapx: string;
  mapy: string;
  sigungucode: string;
  title: string;
  tel?: string;
  modifiedtime?: string;
}

export interface PetTourFilters {
  areaCode?: string;
  cat1?: string;
  pageNo?: number;
  numOfRows?: number;
}

export interface PetTourDetail {
  contentid: string;
  contenttypeid?: string;
  title: string;
  addr1?: string;
  addr2?: string;
  tel?: string;
  homepage?: string;
  overview?: string;
  firstimage?: string;
  firstimage2?: string;
  mapx?: string;
  mapy?: string;
  modifiedtime?: string;
}

export interface PetTourPetDetail {
  contentid: string;
  acmpyTypeCd?: string;
  acmpyPsblCpam?: string;
  acmpyNeedMtr?: string;
  etcAcmpyInfo?: string;
  relaAcdntRiskMtr?: string;
  relaPosesFclt?: string;
  relaPurcPrdlst?: string;
  relaRntlPrdlst?: string;
  relaAcdntPrepMatter?: string;
  relaTrfcSitu?: string;
}
