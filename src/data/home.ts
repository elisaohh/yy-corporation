import type { AssetId } from "./assets";
import type { Copy } from "./content";

/**
 * HOME 문구 · 구성 데이터 — 2026-10-14 HOME 개편안(사용자 승인) 기준.
 * 순서: 브랜드 인트로 → 회사 소개(FIND·DRESS·MATCH·DELIVER 통합) → 공정 모션 → PRODUCT 컬렉션 → 슬로건 → CTA
 * status: final(확정) / draft(임시 초안 — 교체 예정) / missing(미정)
 */

/* ── ① 히어로 — 2026-10-15 사용자 시안 기준 (떠다니는 병 · 물방울, Bryhel식 로딩 공개) ── */
export const hero = {
  eyebrow: "COSMETIC PACKAGING PARTNER",
  titleLines: ["From Bottle", "to Brand."],
  subLines: ["병 하나, 처음부터 끝까지.", "브랜드에 맞는 패키징을 함께 만들어갑니다."],
  cta: { label: "Explore our work", href: "/products" },
  source: "사용자 제공 히어로 시안(2026-10-15)",
  /** 떠다니는 병 — 왼쪽부터. 위치 · 크기 · 기울기는 시각 영역 대비 % */
  bottles: [
    { id: "floatCoating" as AssetId, left: 4, top: 12, height: 50, rotate: -24, depth: 0.6 },
    { id: "floatClear" as AssetId, left: 33, top: 28, height: 64, rotate: -17, depth: 1 },
    { id: "floatEtching" as AssetId, left: 68, top: 8, height: 48, rotate: -27, depth: 0.45 },
  ],
  /** 물방울 — x/y(%) · 크기(시각 영역 폭 대비 %) · 가로세로비 · 기울기 */
  drops: [
    { x: 22, y: 6, size: 4.2, ratio: 1, rotate: 0 },
    { x: 15, y: 16, size: 2.6, ratio: 1, rotate: 0 },
    { x: 40, y: 8, size: 12, ratio: 0.62, rotate: -50 },
    { x: 78, y: 4, size: 10, ratio: 0.55, rotate: 28 },
    { x: 86, y: 18, size: 2.8, ratio: 1, rotate: 0 },
    { x: 70, y: 32, size: 2.2, ratio: 1, rotate: 0 },
    { x: 2, y: 58, size: 11, ratio: 0.8, rotate: 18 },
    { x: 14, y: 72, size: 3.2, ratio: 1, rotate: 0 },
    { x: 56, y: 68, size: 9, ratio: 0.7, rotate: 36 },
    { x: 82, y: 76, size: 7.5, ratio: 0.6, rotate: -22 },
    { x: 66, y: 60, size: 2.4, ratio: 1, rotate: 0 },
    { x: 30, y: 88, size: 1.8, ratio: 1, rotate: 0 },
  ],
};

/* ── ② 회사 소개 ── */
export const companyIntro = {
  /** 출처: 콘텐츠 제작 가이드(엑셀) MAIN 시트 '회사 소개 요약' — 회사 제공 문구 */
  title: "브랜드의 성공을 담는 패키징",
  body: "화장품 용기 턴키 패키징 전문기업으로 글로벌 생산 네트워크를 통한 가격 경쟁력과 품질을 제공합니다.",
  source: "엑셀 MAIN 시트 '회사 소개 요약'",
};

/** FIND → DRESS → MATCH → DELIVER (문구 출처: YY NOTES Vol.01 회사 소개) */
export interface Service {
  key: string;
  name: string;
  /** 한글 한 줄 */
  line: string;
  /** 하는 일 */
  scope: string;
}

export const services: Service[] = [
  { key: "find", name: "FIND", line: "딱 맞는 병을 찾아요", scope: "프리몰드 소싱" },
  { key: "dress", name: "DRESS", line: "브랜드의 옷을 입혀요", scope: "코팅 · 인쇄 후가공" },
  { key: "match", name: "MATCH", line: "캡과 드롭퍼, 짝을 맞춰요", scope: "부자재 매칭" },
  { key: "deliver", name: "DELIVER", line: "문 앞까지 책임져요", scope: "발주 · 입출고 · 납품" },
];

export const servicesSource = "YY NOTES Vol.01 회사 소개";

/* ── ③ 공정 모션 ── */
export const processScene = {
  /** 기준병 YS-SRRR30-04 · 30ml (스포이드 없는 상태) */
  base: "procClear" as AssetId,
  /** 표면 효과 — 코팅 · 인쇄(코팅 후 인쇄로 대체, 단독 이미지 미제공) · 부식 · 라벨 */
  layers: ["procCoating", "procPrinting", "procEtching", "procLabel"] as AssetId[],
  /** 위에서 수직으로 내려와 체결되는 스포이드 — 캡(불투명)과 피펫(유리, multiply) */
  dropperCap: "dropperCap" as AssetId,
  dropperPipette: "dropperPipette" as AssetId,
  /** 라벨이 피펫을 가리는 구간(캔버스 높이 대비 %) — proc-label 실측 */
  labelBand: { top: 44.4, bottom: 72.5 }, // proc-label(부식 후 라벨) 실측 710–1160행
  /** 체결 후 함께 등장하는 실제 제품 (기준병 양옆) */
  expandTo: ["YS-SRRR15-01_02", "YS-SRRR30-02_01", "YS-SRRR30-04_01", "YS-SRRR50-02_01"] as AssetId[],
};

/* ── ⑥ 마지막 CTA — 문구 미확정 (기획서 부록 B5: 예시를 확정 카피로 취급하지 말 것) ── */
export const cta = {
  title: { text: "LET'S CREATE TOGETHER.", status: "draft", source: "기획서 2.0 §4.1.6 초안" } as Copy,
  sub: { text: "브랜드에 어울리는 패키징을 함께 찾아드립니다.", status: "draft", source: "기획서 2.0 §4.1.6 초안" } as Copy,
  button: "CONTACT US ↗",
};

/* ── ⑤ 슬로건 (마지막 CTA 앞) ── */
export const slogan = {
  lines: ["병 하나,", "처음부터 끝까지"],
  status: "final" as const,
  source: "기획서 2.0 부록 B2 · YY NOTES Vol.01",
  sub: {
    text: "하나의 용기가 완성되기까지, 브랜드의 생각을 구체적인 형태로 연결합니다.",
    status: "draft",
    source: "기획서 2.0 부록 B2 임시 초안",
  } as Copy,
};
