/**
 * 사이트 전역 설정. 소스 교체(인트로 방식 등)와 프로토타입 표시를 한곳에서 바꾼다.
 * 기획서 2.0 §6.2 기준.
 */

/** HOME 인트로 소스. float = 떠다니는 병 · 물방울 히어로(현재), poster = 정지 이미지, video = 영상, three = 실시간 3D */
export type HeroMode = "float" | "poster" | "video" | "three";

export const siteConfig = {
  name: "YY CORPORATION",
  /** 검색에 쓰는 한글 회사명(붙여 쓰기) */
  nameKo: "와이와이코퍼레이션",
  /** 대표 주소 — www는 Cloudflare에서 이 주소로 넘어간다 */
  url: "https://yycorp.co.kr",
  /** 검색 결과 설명 — 회사 제공 문구(회사 소개 요약 · YY LETTER 서비스)만으로 구성 */
  description:
    "와이와이코퍼레이션(YY CORPORATION)은 화장품 용기 턴키 패키징 전문기업입니다. 프리몰드 유리 용기 소싱, 코팅 · 인쇄 후가공, 부자재 매칭, 발주 · 입출고 · 납품까지 함께합니다.",
  locale: "ko_KR",

  heroMode: "float" as HeroMode,
  enableHeavy3DOnMobile: false,

  /** 문의 폼은 실제 전송 없이 화면만 동작하는 데모 상태로 유지한다. */
  enableDemoForm: true,

  /**
   * 임시 이미지·미확정 문구에 "임시" / "확인 필요" 표시를 붙인다.
   * 실제 자료로 모두 교체되면 false로 바꾼다.
   */
  showPlaceholderLabels: false, // 임시 배지 숨김(미확정 항목은 docs에서 관리)

  /** 모바일 제품 목록 열 수 — 실제 사진 확인 후 1 또는 2로 결정 (설계서 v0.2) */
  productMobileColumns: 2 as 1 | 2,

  theme: {
    intro: "dark",
    outro: "charcoal",
  },
} as const;
