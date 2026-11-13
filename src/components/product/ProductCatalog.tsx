"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { siteConfig } from "@/config/site";
import { allCategory, GLASS_CATEGORY, glassTypes, productCategories } from "@/data/categories";
import { PRODUCTS_PAGE_SIZE, hasProducts, products, type Product } from "@/data/products";

/** 제품이 한 개라도 있는 카테고리만 탭으로 보인다 — 제품이 추가되면 자동으로 나타난다 */
const tabs = [allCategory, ...productCategories.filter((category) => category.visible && (category.showWhenEmpty || hasProducts(category.slug)))];
const validSlugs = new Set<string>(tabs.map((tab) => tab.slug));

/** 이전 목록이 흐려지는 시간 */
const OUT_MS = 200;
/** 카드 사이 등장 간격과 최대 지연 단계 */
const STAGGER_MS = 45;
const STAGGER_MAX = 8;

/** 용량 숫자(ml) — "30ml" → "30". 용량이 없거나 ml가 아니면 null */
const mlOf = (product: Product) => product.capacity?.match(/(\d+(?:\.\d+)?)\s*ml/i)?.[1] ?? null;

/** GLASS 세부 종류 값이 맞는지 */
const validTypes = new Set(glassTypes.map((t) => t.slug));

/** 종류(탭) + GLASS 세부 종류(type, GLASS일 때만) */
function inCategory(slug: string, type: string | null = null) {
  const list = slug === allCategory.slug ? products : products.filter((p) => p.category === slug);
  return slug === GLASS_CATEGORY && type ? list.filter((p) => p.type === type) : list;
}

/** 그 종류 제품에 있는 용량만 — 작은 것부터 */
function mlChoicesOf(slug: string, type: string | null = null) {
  return [...new Set(inCategory(slug, type).map(mlOf).filter((ml): ml is string => ml !== null))].sort((a, b) => Number(a) - Number(b));
}

/** 목록 상태 = 종류 + 세부 종류 + 용량(없으면 전체) */
const keyOf = (category: string, type: string | null, ml: string | null) => `${category}|${type ?? ""}|${ml ?? ""}`;
const parseKey = (key: string) => {
  const [category, type, ml] = key.split("|");
  return { category, type: type || null, ml: ml || null };
};

function filterBy(key: string) {
  const { category, type, ml } = parseKey(key);
  return inCategory(category, type).filter((p) => !ml || mlOf(p) === ml);
}

/**
 * PRODUCT 목록 — 종류(카테고리) 탭 + (GLASS일 때) 세부 종류 버튼 + 용량(ml) 필터 + 그리드 + LOAD MORE + 빈 카테고리 안내.
 * 선택은 URL(?category= · ?type= · ?ml=)에 저장해 상세에서 돌아와도 유지된다. 용량 버튼은 고른 종류 제품에 있는 용량만 나온다.
 *
 * 탭 전환: 탭 표시는 즉시 바뀌고, 목록은 0.2초 동안 흐려진 뒤
 * 새 카드가 살짝 아래에서 떠오르며 순서대로 나타난다. 전환 중에는 높이를 고정해 화면이 출렁이지 않게 한다.
 */
export function ProductCatalog() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const requested = params.get("category") ?? allCategory.slug;
  const activeCategory = validSlugs.has(requested) ? requested : allCategory.slug;
  const showTypes = activeCategory === GLASS_CATEGORY;
  const requestedType = params.get("type");
  const activeType = showTypes && requestedType && validTypes.has(requestedType) ? requestedType : null;
  const mlChoices = mlChoicesOf(activeCategory, activeType);
  const requestedMl = params.get("ml");
  const activeMl = requestedMl && mlChoices.includes(requestedMl) ? requestedMl : null;
  const active = keyOf(activeCategory, activeType, activeMl);

  const [displayed, setDisplayed] = useState(active);
  const [fadingOut, setFadingOut] = useState(false);
  const [lockHeight, setLockHeight] = useState<number | null>(null);
  /** 이 순번부터 등장 애니메이션 적용 (null이면 없음) */
  const [animateFrom, setAnimateFrom] = useState<number | null>(null);
  const [swapKey, setSwapKey] = useState(0);
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PAGE_SIZE);

  const listWrapRef = useRef<HTMLDivElement>(null);
  const mlRowRef = useRef<HTMLDivElement>(null);
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

  // 고른 용량 버튼이 휴대폰 화면 밖에 있으면 보이게(가로 스크롤만)
  useEffect(() => {
    const row = mlRowRef.current;
    const on = row?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (row && on) row.scrollLeft = Math.max(0, on.offsetLeft - row.clientWidth + on.offsetWidth + 16);
  }, [activeMl, activeCategory, activeType]);

  // LOAD MORE 후 새로 나타난 첫 카드로 포커스 이동(키보드 사용자)
  useEffect(() => {
    if (focusIndex.current !== null) {
      cardRefs.current[focusIndex.current]?.focus({ preventScroll: true });
      focusIndex.current = null;
    }
  }, [visibleCount]);

  const go = useCallback(
    (category: string, type: string | null, ml: string | null) => {
      const query = new URLSearchParams();
      if (category !== allCategory.slug) query.set("category", category);
      if (type && category === GLASS_CATEGORY) query.set("type", type);
      if (ml) query.set("ml", ml);
      const qs = query.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [pathname, router],
  );
  /** 종류를 바꾸면 고른 용량은 그 종류에도 있을 때만 유지 */
  const selectTab = (slug: string) => go(slug, null, activeMl && mlChoicesOf(slug).includes(activeMl) ? activeMl : null);
  /** 세부 종류를 바꾸면 고른 용량은 그 세부 종류에도 있을 때만 유지 */
  const selectType = (type: string | null) =>
    go(activeCategory, type, activeMl && mlChoicesOf(activeCategory, type).includes(activeMl) ? activeMl : null);
  const activeTypeLabel = glassTypes.find((t) => t.slug === activeType);

  const loadMore = () => {
    focusIndex.current = visibleCount;
    setAnimateFrom(visibleCount);
    setVisibleCount((count) => count + PRODUCTS_PAGE_SIZE);
  };

  const filtered = filterBy(displayed);
  const shown = filtered.slice(0, visibleCount);
  const activeCount = filterBy(active).length;
  const mobileCols = siteConfig.productMobileColumns === 1 ? "grid-cols-1" : "grid-cols-2";
  const activeLabel = tabs.find((tab) => tab.slug === activeCategory);
  const shownFrom = parseKey(displayed);

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
            const isActive = tab.slug === activeCategory;
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
          {activeLabel?.labelKo}
          {activeTypeLabel ? ` · ${activeTypeLabel.labelKo}` : ""}
          {activeMl ? ` · ${activeMl}ml` : ""} 제품 {activeCount}개
        </p>
      </div>

      {/* 필터 한 줄(A안) — 왼쪽: GLASS 세부 종류(회색 바탕 묶음 버튼) · 세로선 · 오른쪽: 용량(작은 글자 버튼). 휴대폰은 두 줄로 */}
      {(showTypes || mlChoices.length > 1) && (
        <div className="flex flex-col gap-3 border-b border-stone py-4 md:flex-row md:items-center md:gap-0 md:py-5">
          {showTypes && (
            <div
              role="group"
              aria-label="유리 세부 종류"
              className="-mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] [scrollbar-width:none] md:mx-0 md:px-0"
            >
              <div className="inline-flex shrink-0 rounded-full bg-card p-1">
                {[null, ...glassTypes.map((t) => t.slug)].map((type) => {
                  const on = type === activeType;
                  const label = type ? glassTypes.find((t) => t.slug === type)?.label : "ALL";
                  return (
                    <button
                      key={type ?? "all"}
                      type="button"
                      aria-pressed={on}
                      onClick={() => selectType(type)}
                      className={`h-8 shrink-0 rounded-full px-4 font-en text-[12px] font-semibold tracking-[0.08em] transition-[background-color,color,box-shadow] duration-200 md:h-9 md:px-5 ${
                        on ? "bg-paper text-charcoal shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : "text-ash hover:text-charcoal"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {showTypes && mlChoices.length > 0 && <span aria-hidden="true" className="mx-5 hidden h-6 w-px bg-stone md:block" />}

          {/* 용량 — GLASS는 세부 종류마다 용량이 하나뿐이어도 보인다(어떤 용량이 있는지 알 수 있게) */}
          {(mlChoices.length > 1 || (showTypes && mlChoices.length > 0)) && (
            <div
              role="group"
              aria-label="용량"
              ref={mlRowRef}
              className="-mx-[var(--gutter)] flex items-center gap-1 overflow-x-auto px-[var(--gutter)] [scrollbar-width:none] md:mx-0 md:px-0"
            >
              {[null, ...mlChoices].map((ml) => {
                const on = ml === activeMl;
                return (
                  <button
                    key={ml ?? "all"}
                    type="button"
                    aria-pressed={on}
                    aria-label={ml ? `${ml}ml` : "모든 용량"}
                    onClick={() => go(activeCategory, activeType, ml)}
                    className={`h-8 shrink-0 rounded-md px-3 font-en text-[13px] tabular-nums transition-colors duration-200 ${
                      on ? "bg-card font-semibold text-charcoal" : "text-ash hover:text-charcoal"
                    }`}
                  >
                    {ml ? `${ml}ml` : "ALL"}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

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
            <p className="text-[18px] font-medium tracking-[-0.015em]">
              {shownFrom.type ? "이 종류에 등록된 제품이 아직 없습니다." : "이 카테고리에 등록된 제품이 아직 없습니다."}
            </p>
            <p className="text-ash">다른 카테고리를 보거나 전체 제품에서 찾아보세요.</p>
            <button type="button" onClick={() => selectTab(allCategory.slug)} className="link-en mt-2">
              VIEW ALL PRODUCTS →
            </button>
          </div>
        ) : (
          <>
            <ul
              key={swapKey}
              className={`grid ${mobileCols} gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-14 lg:mx-auto lg:max-w-[1000px] lg:gap-x-8`}
            >
              {shown.map((product, index) => {
                const enter = enterStyle(index);
                return (
                  <li key={product.id} className={enter.className} style={enter.style}>
                    <ProductCard
                      product={product}
                      fromCategory={shownFrom.category === allCategory.slug ? undefined : shownFrom.category}
                      fromType={shownFrom.type ?? undefined}
                      fromMl={shownFrom.ml ?? undefined}
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
