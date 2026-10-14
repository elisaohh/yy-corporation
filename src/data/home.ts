import type { AssetId } from "./assets";
import type { Copy } from "./content";

/**
 * HOME 문구 · 구성 데이터 (기획서 2.0 부록 B).
 * status: final(확정) / draft(임시 초안 — 교체 예정) / missing(미정)
 */

/** ③ 슬로건 — 순서대로 등장 */
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

/** ④ 사업 역량 — FIND → DRESS → MATCH → DELIVER (문구 출처: YY NOTES Vol.01 회사 소개) */
export interface Service {
  key: string;
  name: string;
  /** 한글 한 줄 */
  line: string;
  /** 하는 일 */
  scope: string;
  /** 패널에 나란히 놓을 이미지 (제품 렌더 · 생성 예시 · 임시 도형). 공장 사진은 권한 확인 전 사용 금지 */
  images: AssetId[];
  /** 생성 예시 이미지가 포함되면 안내 문구 표시 */
  generatedExample?: boolean;
}

export const services: Service[] = [
  {
    key: "find",
    name: "FIND",
    line: "딱 맞는 병을 찾아요",
    scope: "프리몰드 소싱",
    images: ["YS-SRRR15-01_02", "YS-SRRR30-04_02", "YS-SRRR50-02_02"],
  },
  {
    key: "dress",
    name: "DRESS",
    line: "브랜드의 옷을 입혀요",
    scope: "코팅 · 인쇄 후가공",
    images: ["finishCoating", "finishPrinting", "finishEtching", "finishLabel"],
    generatedExample: true,
  },
  {
    key: "match",
    name: "MATCH",
    line: "캡과 드롭퍼, 짝을 맞춰요",
    scope: "부자재 매칭",
    images: ["YS-SRRR20-01_03"],
  },
  { key: "deliver", name: "DELIVER", line: "문 앞까지 책임져요", scope: "발주 · 입출고 · 납품", images: ["svcDeliver"] },
];

export const servicesSource = "YY NOTES Vol.01 회사 소개";

/**
 * ⑤ 대표 제품 2–3개.
 * 회사가 대표 제품을 아직 지정하지 않아 임시로 선정했다(기준병 + 형태가 다른 2종). 지정되면 id만 바꾼다.
 */
export const featuredProductIds = ["ys-srrr20-01", "ys-srrr30-04", "ys-srrr50-02"];
export const featuredSelectionConfirmed = false;

/** ⑥ 마지막 CTA — 문구 미확정 (기획서 부록 B5: 예시를 확정 카피로 취급하지 말 것) */
export const cta = {
  title: { text: "LET'S CREATE TOGETHER.", status: "draft", source: "기획서 2.0 §4.1.6 초안" } as Copy,
  sub: { text: "브랜드에 어울리는 패키징을 함께 찾아드립니다.", status: "draft", source: "기획서 2.0 §4.1.6 초안" } as Copy,
  button: "CONTACT US ↗",
};
