/**
 * 공식 로고 등록부.
 * 원본은 /LOGO 폴더(수정 금지), 웹용 사본은 public/assets/brand/ 에 바이트 그대로 복사했다.
 * 로고를 교체할 때는 사본 파일을 바꾸거나 아래 src만 수정한다. 컴포넌트에 경로를 직접 쓰지 않는다.
 *
 * 색상은 원본 그대로(심볼 #ffc844, 워드마크 #f7af22)이며 형태·비율·색을 변경하지 않는다.
 * 원본 6개는 /LOGO 와 public/assets/brand/ 에 그대로 보존한다(덮어쓰기 금지).
 */

export type LogoVariant =
  | "horizontalCorporation"
  | "horizontalKorean"
  | "basicCorp"
  | "verticalCorporation"
  | "verticalKorean"
  | "verticalCorp";

export interface LogoAsset {
  src: string;
  /** 원본 파일명 (/LOGO) */
  original: string;
  /** SVG viewBox 크기 — 레이아웃 점프 방지용 비율 */
  width: number;
  height: number;
  description: string;
}

export const logos: Record<LogoVariant, LogoAsset> = {
  horizontalCorporation: {
    src: "/assets/brand/yy-logo-horizontal-corporation.svg",
    original: "가로 로고(1).svg",
    width: 309.49,
    height: 65.11,
    description: "가로형 · yy + corporation",
  },
  horizontalKorean: {
    src: "/assets/brand/yy-logo-horizontal-korean.svg",
    original: "가로 로고(2).svg",
    width: 195.55,
    height: 65.11,
    description: "가로형 · yy + 코퍼레이션",
  },
  basicCorp: {
    src: "/assets/brand/yy-logo-basic-corp.svg",
    original: "기본 로고.svg",
    width: 179.44,
    height: 64.62,
    description: "기본형 · yy + corp",
  },
  verticalCorporation: {
    src: "/assets/brand/yy-logo-vertical-corporation.svg",
    original: "세로 로고(1).svg",
    width: 120.15,
    height: 74.74,
    description: "세로형 · yy / corporation",
  },
  verticalKorean: {
    src: "/assets/brand/yy-logo-vertical-korean.svg",
    original: "세로 로고(2).svg",
    width: 85.88,
    height: 71.34,
    description: "세로형 · yy / 코퍼레이션",
  },
  verticalCorp: {
    src: "/assets/brand/yy-logo-vertical-corp.svg",
    original: "세로 로고(3).svg",
    width: 84.67,
    height: 81.53,
    description: "세로형 · yy / corp",
  },
};

/** 화면 위치별 로고 배정. 배치를 바꿀 때는 이 표만 수정한다. */
export const logoPlacement = {
  headerDesktop: { variant: "basicCorp", height: 30 },
  headerMobile: { variant: "basicCorp", height: 26 },
  mobileMenu: { variant: "basicCorp", height: 28 },
  homeIntro: { variant: "verticalCorporation", height: 120 },
  aboutIntro: { variant: "verticalCorporation", height: 200 },
  loader: { variant: "verticalCorporation", height: 72 },
  footer: { variant: "horizontalCorporation", height: 36 },
} as const satisfies Record<string, { variant: LogoVariant; height: number }>;

export type LogoPlacement = keyof typeof logoPlacement;

/** 로고 대체 텍스트 */
export const logoAlt = "YY CORPORATION";

/**
 * 로고 색 버전 (2026-10-14 결정)
 * - official: 공식 키컬러. 헤더·메뉴·인트로·푸터 등 "로고로서" 쓰는 모든 자리에 사용한다.
 * - monoCharcoal / monoWhite: 원본 사본에서 fill 값 두 개만 바꾼 파생본(형태 동일).
 *   로고 자리에는 쓰지 않고, 이후 디자인 단계에서 반투명 그래픽 요소로만 활용한다.
 *   (예: 밝은 섹션 배경의 차콜 반투명, 차콜 섹션의 흰색 반투명)
 */
export type LogoTone = "official" | "monoCharcoal" | "monoWhite";

export const logoTones: Record<LogoTone, { status: "final" | "graphic"; label: string }> = {
  official: { status: "final", label: "공식 키컬러 · 로고 사용" },
  monoCharcoal: { status: "graphic", label: "차콜 단색 · 반투명 그래픽 전용" },
  monoWhite: { status: "graphic", label: "흰색 단색 · 반투명 그래픽 전용" },
};

const derivedDir = "/assets/brand/derived";

export const monoWhiteSrc: Record<LogoVariant, string> = {
  horizontalCorporation: `${derivedDir}/yy-logo-horizontal-corporation--mono-white.svg`,
  horizontalKorean: `${derivedDir}/yy-logo-horizontal-korean--mono-white.svg`,
  basicCorp: `${derivedDir}/yy-logo-basic-corp--mono-white.svg`,
  verticalCorporation: `${derivedDir}/yy-logo-vertical-corporation--mono-white.svg`,
  verticalKorean: `${derivedDir}/yy-logo-vertical-korean--mono-white.svg`,
  verticalCorp: `${derivedDir}/yy-logo-vertical-corp--mono-white.svg`,
};

export const monoCharcoalSrc: Record<LogoVariant, string> = {
  horizontalCorporation: `${derivedDir}/yy-logo-horizontal-corporation--mono-charcoal.svg`,
  horizontalKorean: `${derivedDir}/yy-logo-horizontal-korean--mono-charcoal.svg`,
  basicCorp: `${derivedDir}/yy-logo-basic-corp--mono-charcoal.svg`,
  verticalCorporation: `${derivedDir}/yy-logo-vertical-corporation--mono-charcoal.svg`,
  verticalKorean: `${derivedDir}/yy-logo-vertical-korean--mono-charcoal.svg`,
  verticalCorp: `${derivedDir}/yy-logo-vertical-corp--mono-charcoal.svg`,
};

/** 공식 SVG에서 확인한 브랜드 색 (잠정 — 브랜드 가이드 확인 전) */
export const brandColorsFromLogo = {
  symbol: "#FFC844", // PANTONE 1225 C 대응 추정 · 기존 잠정값 #FFC845
  wordmark: "#F7AF22", // PANTONE 4008 C 대응 추정 · 기존 잠정값 #F3AF22
} as const;
