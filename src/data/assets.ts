/**
 * 이미지·영상·3D 자산 등록부.
 * 모든 컴포넌트는 경로 대신 이 등록부의 ID로 자산을 가져온다.
 *
 * 실제 자료로 교체하는 방법:
 *   1) 파일을 public/assets/<분류>/ 에 넣는다.
 *   2) 해당 항목의 src를 바꾸고 status를 "final"로 바꾼다.
 *   3) docs/asset-inventory.md 에 교체 기록을 남긴다.
 *
 * src가 null이면 화면에는 "임시" 표시가 붙은 자리표시자가 나온다.
 * 스톡 사진이나 존재하지 않는 제품 이미지를 넣지 않는다.
 */

export type AssetStatus = "placeholder" | "final";
export type AssetKind = "image" | "video" | "sequence" | "model";

export interface MediaAsset {
  kind: AssetKind;
  src: string | null;
  alt: string;
  /** 원본 비율 — 교체 전후 레이아웃이 흔들리지 않도록 고정 */
  width: number;
  height: number;
  status: AssetStatus;
  note?: string;
}

/** 4:5 비율 임시 이미지 항목 */
function placeholder(src: string, alt: string): MediaAsset {
  return { kind: "image", src, alt, width: 800, height: 1000, status: "placeholder", note: "기능 검증용" };
}

export const assets = {
  /** HOME 인트로 정지 포스터 — 기준 유리병 원본 사진 제공 후 제작 */
  heroPoster: {
    kind: "image",
    src: null,
    alt: "어두운 배경 속 투명한 30ml 원통형 세럼 유리병",
    width: 1920,
    height: 1080,
    status: "placeholder",
    note: "기준 유리병 원본 사진 제공 예정",
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

  /* ── 기능 검증용 임시 이미지 (실제 제품 아님 · 회색 도형) ── */
  phBottleA: placeholder("/assets/placeholders/shape-bottle-a.svg", "임시 이미지 — 용기 형태 A"),
  phBottleB: placeholder("/assets/placeholders/shape-bottle-b.svg", "임시 이미지 — 용기 형태 B"),
  phDropperA: placeholder("/assets/placeholders/shape-dropper-a.svg", "임시 이미지 — 드로퍼 형태 A"),
  phDropperB: placeholder("/assets/placeholders/shape-dropper-b.svg", "임시 이미지 — 드로퍼 형태 B"),
  phCapA: placeholder("/assets/placeholders/shape-cap-a.svg", "임시 이미지 — 캡 형태 A"),
  phCapB: placeholder("/assets/placeholders/shape-cap-b.svg", "임시 이미지 — 캡 형태 B"),
  phViewTop: placeholder("/assets/placeholders/shape-view-top.svg", "임시 이미지 — 입구 방향 시점"),
  phViewBottom: placeholder("/assets/placeholders/shape-view-bottom.svg", "임시 이미지 — 바닥 방향 시점"),
} satisfies Record<string, MediaAsset>;

export type AssetId = keyof typeof assets;

export function getAsset(id: AssetId): MediaAsset {
  return assets[id];
}
