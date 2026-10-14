/**
 * 공식 로고 등록부.
 * 원본은 /LOGO 폴더(수정 금지), 웹용 사본은 public/assets/brand/ 에 바이트 그대로 복사했다.
 * 로고를 교체할 때는 사본 파일을 바꾸거나 아래 src만 수정한다. 컴포넌트에 경로를 직접 쓰지 않는다.
 *
 * 색상은 원본 그대로(심볼 #ffc844, 워드마크 #f7af22)이며 형태·비율·색을 변경하지 않는다.
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
  headerDesktop: { variant: "basicCorp", height: 34 },
  headerMobile: { variant: "basicCorp", height: 28 },
  mobileMenu: { variant: "basicCorp", height: 30 },
  homeIntro: { variant: "verticalCorporation", height: 120 },
  loader: { variant: "verticalCorporation", height: 72 },
  footer: { variant: "horizontalCorporation", height: 36 },
} as const satisfies Record<string, { variant: LogoVariant; height: number }>;

export type LogoPlacement = keyof typeof logoPlacement;

/** 로고 대체 텍스트 */
export const logoAlt = "YY CORPORATION";
