"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { productCategories } from "@/data/categories";

/** ← BACK TO PRODUCTS — 떠나온 카테고리 탭으로 돌아간다 */
export function BackToProducts() {
  const from = useSearchParams().get("from");
  const valid = from && productCategories.some((category) => category.slug === from);
  return (
    <Link href={valid ? `/products?category=${from}` : "/products"} className="link-en">
      ← BACK TO PRODUCTS
    </Link>
  );
}

/** Suspense 대기 중에 같은 자리를 차지하는 링크 */
export function BackToProductsFallback() {
  return (
    <Link href="/products" className="link-en">
      ← BACK TO PRODUCTS
    </Link>
  );
}
