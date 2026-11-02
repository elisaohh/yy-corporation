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
  /** 첫 줄은 YY LETTER 공식 문구 */
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

/** FIND → DRESS → MATCH → DELIVER (문구 출처: YY LETTER Vol.01 회사 소개) */
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

export const servicesSource = "YY LETTER Vol.01 회사 소개";

/* ── ③ 공정 모션 ── */
export const processScene = {
  /** v2(2026-11-02): 공정마다 투명 병 + 그 공정 하나만 — 앞 공정을 덧입히지 않는다. 이전 버전은 git 태그 process-motion-v1 */
  base: "procV2Clear" as AssetId,
  /** 순서: 부식 → 코팅(3가지) → 인쇄 → 라벨. key는 data/process.ts의 공정 이름 · 설명을 가져올 때 쓴다 */
  steps: [
    { key: "etching", layers: ["procV2Etching"] },
    { key: "coating", layers: ["procV2CoatingGradation", "procV2CoatingMatte", "procV2CoatingGlossy"] },
    { key: "printing", layers: ["procV2Printing"] },
    { key: "labeling", layers: ["procV2Label"] },
  ] as { key: "etching" | "coating" | "printing" | "labeling"; layers: AssetId[] }[],
  /** 코팅 3종 회전판 — 배경을 오려 낸 병(steps의 coating과 같은 순서) */
  orbit: ["cutCoatingGradation", "cutCoatingMatte", "cutCoatingGlossy"] as AssetId[],
  /** 회전판 아래에 보이는 코팅 이름(orbit과 같은 순서) */
  orbitNames: [
    { en: "GRADIENT", ko: "그라데이션" },
    { en: "MATTE", ko: "무광" },
    { en: "GLOSSY", ko: "유광" },
  ],
  /** 부자재 장면: 인쇄 병(왼쪽 · 스포이드)과 라벨 병(오른쪽 · 펌프) — 배경을 오려 낸 사진 */
  duoBottles: ["cutPrinting", "cutLabel"] as AssetId[],
  /** 부자재 병 아래 이름(왼쪽 · 오른쪽) */
  duoNames: [
    { en: "DROPPER", ko: "스포이드" },
    { en: "PUMP", ko: "펌프" },
  ],
  /** 부자재 매칭 — 두 병에 동시에: 왼쪽 스포이드(캡 + 피펫) · 오른쪽 펌프(머리 + 빨대, 마지막에 투명 덮개) */
  match: { name: "MATCH", line: "스포이드 · 펌프 체결" },
  dropperCap: "dropperV2Cap" as AssetId,
  dropperPipette: "dropperV2Pipette" as AssetId,
  pumpHead: "pumpHead" as AssetId,
  pumpTube: "pumpTube" as AssetId,
  pumpOvercap: "pumpOvercap" as AssetId,
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
  source: "기획서 2.0 부록 B2 · YY LETTER Vol.01",
  sub: {
    text: "하나의 용기가 완성되기까지, 브랜드의 생각을 구체적인 형태로 연결합니다.",
    status: "draft",
    source: "기획서 2.0 부록 B2 임시 초안",
  } as Copy,
};

