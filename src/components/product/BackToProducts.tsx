"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { productCategories } from "@/data/categories";

/**
 * 뒤로가기 화살표 — 떠나온 카테고리 탭의 제품 목록으로 돌아간다.
 * (2026-10-14 결정: 글자 없이 화살표만. 화면 낭독기는 aria-label로 안내)
 */
export function BackToProducts() {
  const from = useSearchParams().get("from");
  const valid = from && productCategories.some((category) => category.slug === from);
  return <BackArrow href={valid ? `/products?category=${from}` : "/products"} />;
}

/** Suspense 대기 중에 같은 자리를 차지하는 링크 */
export function BackToProductsFallback() {
  return <BackArrow href="/products" />;
}

function BackArrow({ href }: { href: string }) {
  return (
    <Link
      href={href}
      aria-label="제품 목록으로 돌아가기"
      className="group -ml-2.5 inline-flex size-11 items-center justify-center text-charcoal"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-6 transition-transform duration-300 ease-[var(--ease-yy-out)] group-hover:-translate-x-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
      >
        <path d="M21 12H4" />
        <path d="M10 5.5 3.5 12 10 18.5" />
      </svg>
    </Link>
  );
}
