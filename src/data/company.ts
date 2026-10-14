/**
 * 회사 정보 — 기존 사이트 푸터 캡처(자료/04_회사정보/회사정보.png)에서 옮긴 값.
 *
 * 2026-10-14 사용자 확인: 현재도 정확한 정보 → 확정(confirmed).
 *   정보가 바뀌면 값을 고친다. 다시 확인이 필요해지면 companyStatus를 "unverified"로 돌리면
 *   화면에 "최신 확인 필요" 표시가 다시 붙는다.
 * 비어 있는 항목(null)은 자료에 없던 값이다. 임의로 채우지 않는다.
 */

export interface CompanyInfo {
  legalName: string | null;
  representative: string | null;
  businessNumber: string | null;
  address: string | null;
  phone: string | null;
  fax: string | null;
  email: string | null;
  hours: string | null;
  /** 푸터의 간단한 사업 소개 (1–2줄) */
  summary: string | null;
  instagram: string | null;
}

export type CompanyStatus = "unverified" | "confirmed";

export const companyStatus: CompanyStatus = "confirmed";
export const companySource = "기존 사이트 푸터 캡처 (자료/04_회사정보/회사정보.png)";

export const company: CompanyInfo = {
  legalName: "와이와이 코퍼레이션",
  representative: "강말숙",
  businessNumber: "108-47-00497",
  address: "서울특별시 강서구 강서로 499 대하빌딩 4층",
  phone: "02-3665-0497",
  fax: null,
  email: "sales@yycorp.co.kr",
  hours: null,
  summary: null,
  instagram: null,
};

/** 저작권 표기에 쓰는 이름. 기획서 2.0 표기를 따른다. */
export const copyrightName = "YY CORPORATION";
