import data from "../../content/products.json";

/**
 * 제품 데이터 — content/products.json(관리 화면 /admin에서 고친다)을 읽어 화면용으로 바꾼다.
 * - 화면에는 제품 코드만 쓴다. 제품명(내부 이름)은 절대 넣지 않는다 — 데이터에도 두지 않는다.
 * - 규격은 확인된 값만 넣는다. 비운 칸은 화면에 "—"로 나온다.
 * - 목록 순서 = 화면 순서. home이 켜진 제품만 홈 PRODUCT에 나온다(같은 순서).
 */

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** data/categories.ts 의 slug */
  category: string;
  /** 사진 경로 — 첫 번째가 대표 이미지, 두 번째가 마우스 올림 이미지 */
  images: string[];
  code: string | null;
  capacity: string | null;
  dimensions: string | null;
  material: string | null;
  /** 병목(Neck) 규격 — 값이 있을 때만 표시 */
  neck?: string | null;
  description?: string | null;
  /** 홈 PRODUCT에 보일지 */
  home: boolean;
  /** 기능 검증용 임시 항목 여부 */
  isPlaceholder: boolean;
}

interface ProductEntry {
  code: string;
  category?: string;
  capacity?: string;
  dimensions?: string;
  material?: string;
  neck?: string;
  description?: string;
  home?: boolean;
  images?: string[];
}

const text = (value?: string) => (value && value.trim() ? value.trim() : null);

export const products: Product[] = (data.items as ProductEntry[]).map((item) => {
  const code = item.code.trim();
  const slug = code.toLowerCase();
  return {
    id: slug,
    slug,
    name: code,
    category: item.category || "glass-bottle",
    images: (item.images ?? []).filter(Boolean),
    code,
    capacity: text(item.capacity),
    dimensions: text(item.dimensions),
    material: text(item.material),
    neck: text(item.neck),
    description: text(item.description),
    home: item.home ?? false,
    isPlaceholder: false,
  };
});

/** 홈 PRODUCT에 보일 제품 */
export const homeProducts = products.filter((product) => product.home);

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

/** 문의 폼에 넣을 제품 표기: 제품 코드 */
export function productInquiryLabel(product: Product): string {
  return product.code ?? product.name;
}

/** 목록 한 번에 보여 줄 개수 — 초과 시 LOAD MORE (기획서 부록 D) */
export const PRODUCTS_PAGE_SIZE = 12;
