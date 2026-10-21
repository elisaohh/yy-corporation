/**
 * 제품 카테고리. 탭은 이 배열을 그대로 렌더링하므로, 카테고리를 추가할 때는
 * 항목만 추가하면 된다(예: 취급이 확인된 뒤의 플라스틱 용기).
 * 종류: ALL / BOTTLE / JAR / DROPPER / CAP / ACCESSORIES (기획서 2.0 부록 D의 GLASS BOTTLE을 BOTTLE · JAR로 나눔, 2026-10-21)
 */

export interface ProductCategory {
  /** URL·데이터 키 */
  slug: string;
  /** 탭 표기 (영문) */
  label: string;
  /** 국문 이름 */
  labelKo: string;
  /**
   * 탭에 노출할지 여부. 단, 제품이 하나도 없는 카테고리는 이 값과 상관없이 자동으로 숨겨지고
   * 제품이 추가되면 자동으로 나타난다(ProductCatalog).
   */
  visible: boolean;
}

export const productCategories: ProductCategory[] = [
  { slug: "glass-bottle", label: "BOTTLE", labelKo: "병", visible: true },
  { slug: "jar", label: "JAR", labelKo: "단지(크림 용기)", visible: true },
  { slug: "dropper", label: "DROPPER", labelKo: "드로퍼", visible: true },
  { slug: "cap", label: "CAP", labelKo: "캡", visible: true },
  { slug: "accessories", label: "ACCESSORIES", labelKo: "부자재", visible: true },
];

export type ProductCategorySlug = (typeof productCategories)[number]["slug"];

/** 전체 탭 */
export const allCategory = { slug: "all", label: "ALL", labelKo: "전체" } as const;
