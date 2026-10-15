import type { MediaAsset } from "./assets";

/**
 * 제품 사진 등록부 — 웹용 사본(public/assets/products/<코드>/)을 가리킨다.
 * 원본: 자료/03_제품/제품사진 (수정하지 않음). 사본 생성: node scripts/build-product-images.mjs
 *
 * 컷 번호 규칙 (제공 자료 기준)
 *   01 스포이드 결합 정면 · 02 병 단독 · 03 병과 스포이드 분리 · 04 색상·질감 변형 예시
 * ⚠ 04는 "한 장의 이미지 안에 변형 3종"이 함께 있는 구성이다. 개별 제품으로 나누어 등록하지 않는다.
 */

const VIEW_ALT: Record<string, string> = {
  "01": "스포이드 결합 정면",
  "02": "병 단독 정면",
  "03": "병과 스포이드 분리",
  "04": "색상·질감 변형 예시 — 한 이미지에 3종",
};

/** 제품 코드별 실제로 받은 컷 (2026-10-15 YS-SRRR15-01_01 추가) */
export const productImageCuts: Record<string, string[]> = {
  "YS-SRRR15-01": ["01", "02", "03", "04"],
  "YS-SRRR20-01": ["01", "02", "03", "04"],
  "YS-SRRR30-02": ["01", "02", "03", "04"],
  "YS-SRRR30-04": ["01", "02", "03", "04"],
  "YS-SRRR50-02": ["01", "02", "03", "04"],
};

export const productImageAssets: Record<string, MediaAsset> = Object.fromEntries(
  Object.entries(productImageCuts).flatMap(([code, cuts]) =>
    cuts.map((cut) => {
      const base = `/assets/products/${code}/${code}_${cut}`;
      const asset: MediaAsset = {
        kind: "image",
        src: `${base}.webp`,
        thumbSrc: `${base}-thumb.webp`,
        alt: `${code} ${VIEW_ALT[cut] ?? ""}`.trim(),
        width: 600,
        height: 600,
        status: "final",
        note: cut === "04" ? "한 이미지에 변형 3종 — 개별 제품 아님" : "원본 600px — 고해상도 원본 확보 시 교체",
      };
      return [`${code}_${cut}`, asset] as const;
    }),
  ),
);

/** 제품 코드의 이미지 ID 목록 (컷 번호 순) */
export function productImageIds(code: string): string[] {
  return (productImageCuts[code] ?? []).map((cut) => `${code}_${cut}`);
}
