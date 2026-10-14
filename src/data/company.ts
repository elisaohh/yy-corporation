/**
 * 회사 정보 — 기존 사이트 푸터 캡처(자료/04_회사정보/회사정보.png)에서 옮긴 값.
 *
 * ⚠ 최신 정보로 확인되기 전까지 "확정된 공식 정보"로 취급하지 않는다(2026-10-14 결정).
 *   화면에는 companyStatus가 "unverified"인 동안 "기존 사이트 기준 · 최신 확인 필요" 표시가 붙는다.
 *   최신 정보를 확인하면 값을 고치고 companyStatus를 "confirmed"로 바꾼다.
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

export const companyStatus: CompanyStatus = "unverified";
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
