/**
 * 회사 정보.
 * 콘텐츠 제작 가이드(엑셀) CONTACT 시트가 비어 있어 모든 값이 미확정이다.
 * 확인된 값만 채우고, null인 항목은 화면에 "확인 필요"로 표시된다. 임의 값을 넣지 않는다.
 */

export interface CompanyInfo {
  legalName: string | null;
  address: string | null;
  phone: string | null;
  fax: string | null;
  email: string | null;
  hours: string | null;
  /** 푸터의 간단한 사업 소개 (1–2줄) */
  summary: string | null;
  instagram: string | null;
}

export const company: CompanyInfo = {
  legalName: null,
  address: null,
  phone: null,
  fax: null,
  email: null,
  hours: null,
  summary: null,
  instagram: null,
};

/** 저작권 표기에 쓰는 이름. 기획서 2.0 표기를 따른다. */
export const copyrightName = "YY CORPORATION";
