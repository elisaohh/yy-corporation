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
    moq: null,
    material: null,
    isPlaceholder: false,
    ...spec,
  };
}

export const products: Product[] = [
  glassBottle("YS-SRRR15-01"),
  glassBottle("YS-SRRR20-01", {
    capacity: "20ml",
    dimensions: "33.7 × 68.7 (가로 × 세로)",
    moq: "5,000",
    material: "유리",
    neck: "18파이",
    specSource: "자료/01_기준유리병/치수/기준유리병 치수.txt",
  }),
  glassBottle("YS-SRRR30-02"),
  glassBottle("YS-SRRR30-04"),
  glassBottle("YS-SRRR50-02"),
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
