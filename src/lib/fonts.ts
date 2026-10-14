import { Inter } from "next/font/google";
import localFont from "next/font/local";

/** 영문 제목·메뉴 — Inter (가변) */
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});


/**
 * 국문 본문 — Pretendard 가변 폰트 (npm: pretendard 1.3.9, OFL-1.1).
 * 품질 단계(Phase 4)에서 한글 분할 로딩(dynamic subset)으로 용량을 줄인다.
 */
export const pretendard = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
  fallback: ["Apple SD Gothic Neo", "Malgun Gothic", "sans-serif"],
});
