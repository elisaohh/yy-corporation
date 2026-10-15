"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { siteConfig } from "@/config/site";
import { allCategory, productCategories } from "@/data/categories";
import { PRODUCTS_PAGE_SIZE, hasProducts, products } from "@/data/products";

/** 제품이 한 개라도 있는 카테고리만 탭으로 보인다 — 제품이 추가되면 자동으로 나타난다 */
const tabs = [allCategory, ...productCategories.filter((category) => category.visible && hasProducts(category.slug))];
const validSlugs = new Set<string>(tabs.map((tab) => tab.slug));

/** 이전 목록이 흐려지는 시간 */
const OUT_MS = 200;
/** 카드 사이 등장 간격과 최대 지연 단계 */
const STAGGER_MS = 45;
const STAGGER_MAX = 8;

function filterBy(slug: string) {
  return slug === allCategory.slug ? products : products.filter((p) => p.category === slug);
}

/**
 * PRODUCT 목록 — 카테고리 탭 + 그리드 + LOAD MORE + 빈 카테고리 안내.
 * 선택한 탭은 URL(?category=)에 저장해 상세에서 돌아와도 유지된다.
 *
 * 탭 전환: 탭 표시는 즉시 바뀌고, 목록은 0.2초 동안 흐려진 뒤
 * 새 카드가 살짝 아래에서 떠오르며 순서대로 나타난다. 전환 중에는 높이를 고정해 화면이 출렁이지 않게 한다.
 */
export function ProductCatalog() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const requested = params.get("category") ?? allCategory.slug;
  const active = validSlugs.has(requested) ? requested : allCategory.slug;

  const [displayed, setDisplayed] = useState(active);
  const [fadingOut, setFadingOut] = useState(false);
  const [lockHeight, setLockHeight] = useState<number | null>(null);
  /** 이 순번부터 등장 애니메이션 적용 (null이면 없음) */
  const [animateFrom, setAnimateFrom] = useState<number | null>(null);
  const [swapKey, setSwapKey] = useState(0);
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PAGE_SIZE);

  const listWrapRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const focusIndex = useRef<number | null>(null);
  const releaseTimer = useRef<number | undefined>(undefined);

  // 탭 전환 연출
  useEffect(() => {
    if (active === displayed) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplayed(active);
      setVisibleCount(PRODUCTS_PAGE_SIZE);
      setAnimateFrom(null);
      return;
    }
    window.clearTimeout(releaseTimer.current);
    setLockHeight(listWrapRef.current?.offsetHeight ?? null);
    setFadingOut(true);
    const swap = window.setTimeout(() => {
      setDisplayed(active);
      setVisibleCount(PRODUCTS_PAGE_SIZE);
      setAnimateFrom(0);
      setSwapKey((key) => key + 1);
      setFadingOut(false);
      // 새 카드가 자리를 잡은 뒤 높이 고정 해제
      releaseTimer.current = window.setTimeout(() => setLockHeight(null), 700);
    }, OUT_MS);
    return () => window.clearTimeout(swap);
  }, [active, displayed]);

  useEffect(() => () => window.clearTimeout(releaseTimer.current), []);

  // LOAD MORE 후 새로 나타난 첫 카드로 포커스 이동(키보드 사용자)
  useEffect(() => {
    if (focusIndex.current !== null) {
      cardRefs.current[focusIndex.current]?.focus({ preventScroll: true });
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
    setAnimateFrom(visibleCount);
    setVisibleCount((count) => count + PRODUCTS_PAGE_SIZE);
  };

  const filtered = filterBy(displayed);
  const shown = filtered.slice(0, visibleCount);
  const activeCount = filterBy(active).length;
  const mobileCols = siteConfig.productMobileColumns === 1 ? "grid-cols-1" : "grid-cols-2";
  const activeLabel = tabs.find((tab) => tab.slug === active);

  const enterStyle = (index: number): { className: string; style?: CSSProperties } => {
    if (animateFrom === null || index < animateFrom) return { className: "" };
    const step = Math.min(index - animateFrom, STAGGER_MAX);
    return { className: "card-in", style: { ["--stagger" as string]: `${step * STAGGER_MS}ms` } };
  };

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
                className={`label-en relative min-h-12 shrink-0 pt-3 transition-colors duration-300 before:absolute before:left-1/2 before:top-[10px] before:size-1 before:-translate-x-1/2 before:rounded-full before:bg-current before:transition-opacity before:duration-300 ${
                  isActive ? "text-charcoal before:opacity-100" : "text-ash before:opacity-0 hover:text-charcoal"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <p className="pb-3 text-[13px] text-ash" aria-live="polite">
          {activeLabel?.labelKo} 제품 {activeCount}개
        </p>
      </div>

      <div
        ref={listWrapRef}
        className={`pt-10 transition-opacity ease-[var(--ease-yy-out)] md:pt-14 ${fadingOut ? "opacity-0" : "opacity-100"}`}
        style={{ transitionDuration: `${OUT_MS}ms`, minHeight: lockHeight ?? undefined }}
      >
        {filtered.length === 0 ? (
          <div
            key={`empty-${swapKey}`}
            className={`grid justify-items-start gap-3 border border-dashed border-stone px-6 py-12 md:px-10 ${animateFrom !== null ? "card-in" : ""}`}
          >
            <p className="text-[18px] font-medium tracking-[-0.015em]">이 카테고리에 등록된 제품이 아직 없습니다.</p>
            <p className="text-ash">다른 카테고리를 보거나 전체 제품에서 찾아보세요.</p>
            <button type="button" onClick={() => selectTab(allCategory.slug)} className="link-en mt-2">
              VIEW ALL PRODUCTS →
            </button>
          </div>
        ) : (
          <>
            <ul
              key={swapKey}
              className={`grid ${mobileCols} gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-14 lg:grid-cols-4 lg:gap-x-8`}
            >
              {shown.map((product, index) => {
                const enter = enterStyle(index);
                return (
                  <li key={product.id} className={enter.className} style={enter.style}>
                    <ProductCard
                      product={product}
                      fromCategory={displayed === allCategory.slug ? undefined : displayed}
                      linkRef={(el) => {
                        cardRefs.current[index] = el;
                      }}
                    />
                  </li>
                );
              })}
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
