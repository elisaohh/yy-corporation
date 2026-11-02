import { productImageAssets } from "./productImages";

/**
 * 이미지·영상·3D 자산 등록부.
 * 모든 컴포넌트는 경로 대신 이 등록부의 ID로 자산을 가져온다.
 *
 * 실제 자료로 교체하는 방법:
 *   1) 파일을 public/assets/<분류>/ 에 넣는다. (제품 사진은 scripts/build-product-images.mjs 로 사본 생성)
 *   2) 해당 항목의 src를 바꾸고 status를 "final"로 바꾼다.
 *   3) docs/asset-inventory.md 에 교체 기록을 남긴다.
 *
 * src가 null이면 화면에는 "임시" 표시가 붙은 자리표시자가 나온다.
 * 스톡 사진이나 존재하지 않는 제품 이미지를 넣지 않는다.
 * 현장 사진 등 공개 전에 확인할 사항은 docs/asset-inventory.md "공개 전 확인할 것" 참고.
 */

export type AssetStatus = "placeholder" | "final";
export type AssetKind = "image" | "video" | "sequence" | "model";

export interface MediaAsset {
  kind: AssetKind;
  src: string | null;
  /** 썸네일용 작은 사본 (없으면 src 사용) */
  thumbSrc?: string;
  alt: string;
  /** 원본 비율 — 교체 전후 레이아웃이 흔들리지 않도록 고정 */
  width: number;
  height: number;
  status: AssetStatus;
  note?: string;
}

/** 공정 모션 캔버스 이미지(900×1600) */
function proc(src: string, alt: string): MediaAsset {
  return { kind: "image", src, alt, width: 900, height: 1600, status: "final", note: "기준병 YS-SRRR30-04 · 같은 캔버스 좌표" };
}

/** 후가공 생성 예시 이미지 — 실제 작업 사례로 표시하지 않는다 */
function generated(src: string, alt: string): MediaAsset {
  return { kind: "image", src, alt, width: 900, height: 1600, status: "final", note: "생성 예시 — 실제 작업 사례 아님" };
}

/** 공정 모션 v2 캔버스 이미지(900×1600) — 공정마다 단독 장면, scripts/build-process-v2.mjs */
function procV2(src: string, alt: string): MediaAsset {
  return { kind: "image", src, alt, width: 900, height: 1600, status: "final", note: "공정 모션 v2(2026-11-02 제공 이미지) · 같은 캔버스 좌표" };
}

const baseAssets = {
  /** HOME 인트로 정지 포스터 (heroMode: poster일 때) */
  heroPoster: {
    kind: "image",
    src: null,
    alt: "어두운 배경 속 투명한 30ml 원통형 세럼 유리병",
    width: 1920,
    height: 1080,
    status: "placeholder",
    note: "heroMode \"poster\"일 때만 사용 — 기준 유리병 YS-SRRR30-04 기반 포스터(미제작)",
  },
  heroPosterMobile: {
    kind: "image",
    src: null,
    alt: "어두운 배경 속 투명한 30ml 원통형 세럼 유리병",
    width: 1080,
    height: 1920,
    status: "placeholder",
    note: "세로 화면 전용 구도",
  },

  /* ── HOME 인트로 · 공정 모션 (scripts/build-*.mjs) — 900×1600 흰 바탕 캔버스, 같은 좌표에 정렬 ── */
  procClear: proc("/assets/hero/proc-clear.webp", "스포이드를 끼우기 전의 투명한 30ml 유리병"),
  procCoating: generated("/assets/hero/proc-coating.webp", "코팅 효과 예시 — 생성 이미지"),
  procPrinting: generated("/assets/hero/proc-printing.webp", "인쇄 효과 예시(코팅 위 인쇄) — 생성 이미지"),
  procEtching: generated("/assets/hero/proc-etching.webp", "부식 효과 예시 — 생성 이미지"),
  procLabel: generated("/assets/hero/proc-label.webp", "라벨 효과 예시 — 생성 이미지"),
  dropperCap: proc("/assets/hero/dropper-cap.webp", "흰색 스포이드 캡과 고무 벌브"),
  dropperPipette: proc("/assets/hero/dropper-pipette.webp", "유리 피펫"),
  procV2Clear: procV2("/assets/hero/v2/proc-clear.webp", "아무 가공도 하지 않은 투명한 30ml 유리병"),
  procV2Etching: procV2("/assets/hero/v2/proc-etching.webp", "부식으로 반투명해진 유리병"),
  procV2CoatingGradation: procV2("/assets/hero/v2/proc-coating-gradation.webp", "아래로 갈수록 노란색이 짙어지는 그러데이션 코팅 유리병"),
  procV2CoatingMatte: procV2("/assets/hero/v2/proc-coating-matte.webp", "연노란색 무광 코팅 유리병"),
  procV2CoatingGlossy: procV2("/assets/hero/v2/proc-coating-glossy.webp", "연노란색 유광 코팅 유리병"),
  procV2Printing: procV2("/assets/hero/v2/proc-printing.webp", "투명 유리병 표면에 검은 글씨를 인쇄한 모습"),
  procV2Label: procV2("/assets/hero/v2/proc-label.webp", "투명 유리병에 흰 라벨을 붙인 모습"),
  dropperV2Cap: procV2("/assets/hero/v2/dropper-cap.webp", "흰색 스포이드 캡"),
  dropperV2Pipette: procV2("/assets/hero/v2/dropper-pipette.webp", "유리 피펫"),
  cutCoatingGradation: procV2("/assets/hero/v2/cut-coating-gradation.webp", "그러데이션 코팅 유리병"),
  cutCoatingMatte: procV2("/assets/hero/v2/cut-coating-matte.webp", "무광 코팅 유리병"),
  cutCoatingGlossy: procV2("/assets/hero/v2/cut-coating-glossy.webp", "유광 코팅 유리병"),
  cutPrinting: procV2("/assets/hero/v2/cut-printing.webp", "글씨가 인쇄된 반투명 유리병"),
  cutLabel: procV2("/assets/hero/v2/cut-label.webp", "흰 라벨을 붙인 반투명 유리병"),
  cutClear: procV2("/assets/hero/v2/cut-clear.webp", "투명한 30ml 유리병"),
  pumpHead: procV2("/assets/hero/v2/pump-head.webp", "흰색 펌프"),
  pumpTube: procV2("/assets/hero/v2/pump-tube.webp", "펌프 빨대"),
  pumpOvercap: procV2("/assets/hero/v2/pump-overcap.webp", "투명한 펌프 덮개"),
} satisfies Record<string, MediaAsset>;

export const assets: Record<string, MediaAsset> = { ...baseAssets, ...productImageAssets };

/** 자산 ID — 기본 자산 이름 또는 제품 이미지 ID("<코드>_<컷>") */
export type AssetId = keyof typeof baseAssets | (string & {});

export function getAsset(id: AssetId): MediaAsset {
  const asset = assets[id];
  if (!asset) throw new Error(`등록되지 않은 자산 ID: ${id}`);
  return asset;
}
