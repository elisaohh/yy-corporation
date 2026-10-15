import { productImageIds } from "./productImages";

/**
 * 제품 데이터 — 기획서 2.0 §4.3 스키마.
 *
 * 2026-10-14 기준: 제공받은 유리병 5종 (자료/03_제품).
 * - 제품명은 확인 전까지 제품 코드를 그대로 쓴다.
 * - 규격은 확인된 자료만 넣는다. 현재 확인된 것은 YS-SRRR20-01(자료/01_기준유리병/치수) 하나뿐.
 *   코드의 숫자로 용량을 추정해 넣지 않는다.
 * - 다른 자료(뉴스레터 등)의 특정 제품 값을 옮겨 쓰지 않는다.
 *
 * 정렬: 배열 순서 = 화면 순서(수동 지정).
 */

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** data/categories.ts 의 slug */
  category: string;
  /** 첫 번째가 대표 이미지, 두 번째가 호버 이미지 */
  images: string[];
  code: string | null;
  capacity: string | null;
  dimensions: string | null;
  moq: string | null;
  material: string | null;
  /** 병목(Neck) 규격 — 값이 있을 때만 표시 */
  neck?: string | null;
  description?: string | null;
  /** 기능 검증용 임시 항목 여부 */
  isPlaceholder: boolean;
  /** 규격 출처 */
  specSource?: string;
}

/** MOQ · 재질 기본값 — 제품별 자료가 없을 때 (2026-10-15 사용자 지시) */
const DEFAULT_MOQ = "5,000";
const DEFAULT_MATERIAL = "유리";

function glassBottle(code: string, spec: Partial<Product> = {}): Product {
  const slug = code.toLowerCase();
  return {
    id: slug,
    slug,
    name: code,
    category: "glass-bottle",
    images: productImageIds(code),
    code,
    capacity: null,
    dimensions: null,
    isPlaceholder: false,
    ...spec,
    // 2026-10-15 사용자 지시: MOQ · 재질 자료가 없으면 5,000 · 유리로 표시
    moq: spec.moq ?? DEFAULT_MOQ,
    material: spec.material ?? DEFAULT_MATERIAL,
  };
}

/**
 * 규격 출처: 자료/03_제품/제품규격/제품규격.txt (머리글 없는 표)
 *   열: 코드 · 형태 · 제품명 · 용량 · (의미 미확인 값 1.25/2.0 — 표시하지 않음) · 넥 · 가로×세로
 * MOQ · 재질은 SRRR20-01만 확인(자료/01_기준유리병/치수).
 */
const SPEC_SOURCE = "자료/03_제품/제품규격/제품규격.txt";

export const products: Product[] = [
  glassBottle("YS-SRRR15-01", {
    name: "Y1 라운드 RR 15ml (OL15)",
    capacity: "15ml",
    dimensions: "31.5 × 64.0 (가로 × 세로)",
    neck: "Ø18",
    specSource: SPEC_SOURCE,
  }),
  glassBottle("YS-SRRR20-01", {
    name: "Y1 라운드 RR 20ml",
    capacity: "20ml",
    dimensions: "33.7 × 68.7 (가로 × 세로)",
    moq: "5,000",
    material: "유리",
    neck: "Ø18",
    specSource: `${SPEC_SOURCE} · 자료/01_기준유리병/치수`,
  }),
  glassBottle("YS-SRRR30-02", {
    name: "Y1 라운드 RR 30ml",
    capacity: "30ml",
    dimensions: "38.0 × 71.3 (가로 × 세로)",
    neck: "Ø18",
    specSource: SPEC_SOURCE,
  }),
  glassBottle("YS-SRRR30-04", {
    name: "Y1 단 라운드 RR 30ml",
    capacity: "30ml",
    dimensions: "38.0 × 74.4 (가로 × 세로)",
    neck: "Ø18",
    specSource: SPEC_SOURCE,
  }),
  glassBottle("YS-SRRR50-02", {
    name: "Y1 라운드 RR 50ml",
    capacity: "50ml",
    dimensions: "38.0 × 99.2 (가로 × 세로)",
    neck: "Ø18",
    specSource: SPEC_SOURCE,
  }),
];

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

/** 제품이 한 개라도 있는 카테고리인지 */
export function hasProducts(categorySlug: string): boolean {
  return products.some((product) => product.category === categorySlug);
}

/** 문의 폼에 넣을 제품 표기: 제품명 · 코드(이름과 다를 때만) */
export function productInquiryLabel(product: Product): string {
  return product.code && product.code !== product.name ? `${product.name} · ${product.code}` : product.name;
}

/** 목록 한 번에 보여 줄 개수 — 초과 시 LOAD MORE (기획서 부록 D) */
export const PRODUCTS_PAGE_SIZE = 12;
