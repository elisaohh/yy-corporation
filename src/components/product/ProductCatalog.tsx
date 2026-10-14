"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { siteConfig } from "@/config/site";
import { allCategory, productCategories } from "@/data/categories";
import { PRODUCTS_PAGE_SIZE, products } from "@/data/products";

const tabs = [allCategory, ...productCategories.filter((category) => category.visible)];
const validSlugs = new Set<string>(tabs.map((tab) => tab.slug));

/**
 * PRODUCT 목록 — 카테고리 탭 + 그리드 + LOAD MORE + 빈 카테고리 안내.
 * 선택한 탭은 URL(?category=)에 저장해 상세에서 돌아와도 유지된다.
 */
export function ProductCatalog() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const requested = params.get("category") ?? allCategory.slug;
  const active = validSlugs.has(requested) ? requested : allCategory.slug;

  const filtered = active === allCategory.slug ? products : products.filter((p) => p.category === active);
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PAGE_SIZE);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const focusIndex = useRef<number | null>(null);

  // 탭이 바뀌면 처음 12개로 되돌린다
  useEffect(() => {
    setVisibleCount(PRODUCTS_PAGE_SIZE);
  }, [active]);

  // LOAD MORE 후 새로 나타난 첫 카드로 포커스 이동(키보드 사용자)
  useEffect(() => {
    if (focusIndex.current !== null) {
      cardRefs.current[focusIndex.current]?.focus();
      focusIndex.current = null;
    }
  }, [visibleCount]);

  const selectTab = useCallback(
    (slug: string) => {
      const query = slug === allCategory.slug ? "" : `?category=${slug}`;
      router.replace(`${pathname}${query}`, { scroll: false });
    },
    [pathname, router],
  );

  const loadMore = () => {
    focusIndex.current = visibleCount;
    setVisibleCount((count) => count + PRODUCTS_PAGE_SIZE);
  };

  const shown = filtered.slice(0, visibleCount);
  const mobileCols = siteConfig.productMobileColumns === 1 ? "grid-cols-1" : "grid-cols-2";
  const activeLabel = tabs.find((tab) => tab.slug === active);

  return (
    <section data-header-theme="light" className="container-yy pb-32" aria-label="제품 목록">
      <div className="flex flex-col gap-4 border-b border-stone md:flex-row md:items-end md:justify-between">
        <div
          role="group"
          aria-label="제품 카테고리"
          className="-mx-[var(--gutter)] flex gap-7 overflow-x-auto px-[var(--gutter)] [scrollbar-width:none] md:mx-0 md:gap-9 md:px-0"
        >
          {tabs.map((tab) => {
            const isActive = tab.slug === active;
            return (
              <button
                key={tab.slug}
                type="button"
                aria-pressed={isActive}
                onClick={() => selectTab(tab.slug)}
                className={`label-en relative min-h-12 shrink-0 pt-3 transition-colors duration-200 before:absolute before:left-1/2 before:top-[10px] before:size-1 before:-translate-x-1/2 before:rounded-full before:bg-current before:transition-opacity ${
                  isActive ? "text-charcoal before:opacity-100" : "text-ash before:opacity-0 hover:text-charcoal"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <p className="pb-3 text-[13px] text-ash" aria-live="polite">
          {activeLabel?.labelKo} 제품 {filtered.length}개
        </p>
      </div>

      <div key={active} className="fade-in pt-10 md:pt-14">
        {filtered.length === 0 ? (
          <div className="grid justify-items-start gap-3 border border-dashed border-stone px-6 py-12 md:px-10">
            <p className="text-[18px] font-medium tracking-[-0.015em]">이 카테고리에 등록된 제품이 아직 없습니다.</p>
            <p className="text-ash">다른 카테고리를 보거나 전체 제품에서 찾아보세요.</p>
            <button type="button" onClick={() => selectTab(allCategory.slug)} className="link-en mt-2">
              VIEW ALL PRODUCTS →
            </button>
          </div>
        ) : (
          <>
            <ul className={`grid ${mobileCols} gap-x-4 gap-y-10 md:grid-cols-2 md:gap-x-6 md:gap-y-14 lg:grid-cols-3 lg:gap-x-8`}>
              {shown.map((product, index) => (
                <li key={product.id}>
                  <ProductCard
                    product={product}
                    fromCategory={active === allCategory.slug ? undefined : active}
                    linkRef={(el) => {
                      cardRefs.current[index] = el;
                    }}
                  />
                </li>
              ))}
            </ul>

            {filtered.length > visibleCount && (
              <div className="mt-16 flex justify-center">
                <button type="button" onClick={loadMore} className="btn btn-secondary btn-en">
                  LOAD MORE
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
