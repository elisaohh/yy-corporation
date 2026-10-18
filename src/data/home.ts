import type { AssetId } from "./assets";
import type { Copy } from "./content";

/**
 * HOME 문구 · 구성 데이터.
 * 순서: 브랜드 인트로 → 회사 소개(FIND·DRESS·MATCH·DELIVER 통합) → 공정 모션 → PRODUCT 컬렉션 → 슬로건 → CTA
 * status: final(확정) / draft(임시 초안 — 교체 예정) / missing(미정)
 */

/* ── ① 히어로 — 사진(병 3개 · 물방울) + 타이포(Inter · Pretendard) ── */
export const hero = {
  eyebrow: "COSMETIC PACKAGING PARTNER",
  /** 영문 대형 제목 — 화면에서는 대문자로 표시 */
  title: "From Bottle to Brand",
  /** 첫 줄은 YY NOTES 공식 문구 */
  lead: "병 하나, 처음부터 끝까지.",
  sub: "브랜드에 맞는 패키징을 함께 만들어갑니다.",
  cta: { label: "Explore our work", href: "/products" },
  source: "사용자 제공 히어로 사진 · 문구(2026-10-15)",
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
  labelBand: { top: 48.8, bottom: 75.4 }, // proc-label(부식 후 라벨) 실측 780–1206행 — 라벨 이미지를 바꾸면 다시 잰다
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
