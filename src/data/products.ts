import type { AssetId } from "./assets";

/**
 * 제품 데이터 — 기획서 2.0 §4.3 스키마.
 *
 * ⚠ 현재 목록은 전부 "기능 검증용 임시 제품"이다.
 *   탭 · LOAD MORE(13개 이상) · 빈 카테고리 · 상세 · 문의 연결을 시험하기 위한 것이며,
 *   제품명 · 코드 · 용량 · 사이즈 · MOQ · 재질은 모두 비워 두었다(화면에는 "—" 표시).
 *   실제 제품 자료가 오면 이 배열을 실제 항목으로 교체하고 isPlaceholder를 false로 둔다.
 *   다른 자료(뉴스레터 등)의 특정 제품 값을 옮겨 쓰지 않는다.
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
  images: AssetId[];
  code: string | null;
  capacity: string | null;
  dimensions: string | null;
  moq: string | null;
  material: string | null;
  /** 병목(Neck) 규격 — 엑셀 가이드 요청 항목. 값이 있을 때만 표시 */
  neck?: string | null;
  description?: string | null;
  /** 기능 검증용 임시 항목 여부 */
  isPlaceholder: boolean;
}

/** 카테고리별 임시 이미지 세트 (대표 · 호버 · 입구 · 바닥) */
const placeholderImages: Record<string, AssetId[]> = {
  "glass-bottle": ["phBottleA", "phBottleB", "phViewTop", "phViewBottom"],
  dropper: ["phDropperA", "phDropperB", "phViewTop", "phViewBottom"],
  cap: ["phCapA", "phCapB", "phViewTop"],
};

/**
 * 임시 제품 구성: 유리용기 6 · 드로퍼 5 · 캡 3 = 14개.
 * ACCESSORIES는 비워 두어 "빈 카테고리" 안내를 확인할 수 있게 했다.
 */
const placeholderPlan: [category: string, count: number][] = [
  ["glass-bottle", 6],
  ["dropper", 5],
  ["cap", 3],
];

function buildPlaceholders(): Product[] {
  const list: Product[] = [];
  let n = 0;
  for (const [category, count] of placeholderPlan) {
    for (let i = 0; i < count; i++) {
      n += 1;
      const no = String(n).padStart(2, "0");
      list.push({
        id: `sample-${no}`,
        slug: `sample-${no}`,
        name: `임시 제품 ${no}`,
        category,
        images: placeholderImages[category],
        code: null,
        capacity: null,
        dimensions: null,
        moq: null,
        material: null,
        isPlaceholder: true,
      });
    }
  }
  return list;
}

export const products: Product[] = buildPlaceholders();

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

/** 문의 폼에 넣을 제품 표기: 제품명 · 코드(있을 때) */
export function productInquiryLabel(product: Product): string {
  return product.code ? `${product.name} · ${product.code}` : product.name;
}

/** 목록 한 번에 보여 줄 개수 — 초과 시 LOAD MORE (기획서 부록 D) */
export const PRODUCTS_PAGE_SIZE = 12;
