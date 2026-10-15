/**
 * 사이트 전역 설정. 소스 교체(인트로 방식 등)와 프로토타입 표시를 한곳에서 바꾼다.
 * 기획서 2.0 §6.2 기준.
 */

/** HOME 인트로 소스. float = 떠다니는 병 · 물방울 히어로(현재), poster = 정지 이미지, video = 영상, three = 실시간 3D */
export type HeroMode = "float" | "poster" | "video" | "three";

export const siteConfig = {
  name: "YY CORPORATION",
  /** 메타 설명은 공식 문구 확정 전까지 사실만 담은 중립 문장으로 둔다. */
  description: "YY CORPORATION 화장품 패키징 기업 웹사이트 프로토타입",
  locale: "ko_KR",

  heroMode: "float" as HeroMode,
  enableHeavy3DOnMobile: false,

  /** 문의 폼은 실제 전송 없이 화면만 동작하는 데모 상태로 유지한다. */
  enableDemoForm: true,

  /**
   * 임시 이미지·미확정 문구에 "임시" / "확인 필요" 표시를 붙인다.
   * 실제 자료로 모두 교체되면 false로 바꾼다.
   */
  showPlaceholderLabels: false, // 2026-10-15 디자인 검토 중 끔(미확정 목록은 docs에서 관리)

  /** 모바일 제품 목록 열 수 — 실제 사진 확인 후 1 또는 2로 결정 (설계서 v0.2) */
  productMobileColumns: 2 as 1 | 2,

  theme: {
    intro: "dark",
    outro: "charcoal",
  },
} as const;
