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
 * 공개 권한이 확인되지 않은 자료(공장 사진 등)는 public/ 에 두지 않는다 — docs/asset-candidates.md 참고.
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

const baseAssets = {
  /** HOME 인트로 정지 포스터 (heroMode: poster일 때) */
  heroPoster: {
    kind: "image",
    src: null,
    alt: "어두운 배경 속 투명한 30ml 원통형 세럼 유리병",
    width: 1920,
    height: 1080,
    status: "placeholder",
    note: "기준 유리병 YS-SRRR20-01 기반 포스터 제작 예정",
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
} satisfies Record<string, MediaAsset>;

export const assets: Record<string, MediaAsset> = { ...baseAssets, ...productImageAssets };

/** 자산 ID — 기본 자산 이름 또는 제품 이미지 ID("<코드>_<컷>") */
export type AssetId = keyof typeof baseAssets | (string & {});

export function getAsset(id: AssetId): MediaAsset {
  const asset = assets[id];
  if (!asset) throw new Error(`등록되지 않은 자산 ID: ${id}`);
  return asset;
}
