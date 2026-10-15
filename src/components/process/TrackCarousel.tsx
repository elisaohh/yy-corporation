"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { isStill } from "@/lib/still";

/** 가로 띠 칸 — src가 없으면 "실사 준비 중" 칸 */
export type TrackItem = { en: string; ko: string; src?: string };

/** 자동으로 한 칸씩 넘어가는 간격(ms) */
const AUTO_MS = 3200;
/** 사용자가 직접 넘긴 뒤 자동 넘김을 쉬는 시간(ms) */
const RESUME_MS = 6000;

/**
 * PACKAGING TURN-KEY 02 · 03의 사진 띠 (2026-10-16: 페이지 스크롤과 분리).
 * - 한 화면에 사진 두 장씩(2026-10-16). 자체 가로 스크롤(손가락 · 트랙패드 · 이전/다음 버튼), 칸 단위로 맞춰 멈춤.
 * - 화면에 보이는 동안만 AUTO_MS마다 한 칸씩 자동으로 넘어가고, 끝에 닿으면 처음으로.
 * - 마우스를 올리거나 키보드 포커스가 있거나, 직접 넘긴 직후에는 멈춘다. 모션 줄이기에서는 자동 넘김 없음.
 */
export function TrackCarousel({ label, items }: { label: string; items: TrackItem[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [progress, setProgress] = useState(0);
  const paused = useRef(false);
  const visible = useRef(false);
  const resumeAt = useRef(0);

  const cards = () => Array.from(viewportRef.current?.querySelectorAll<HTMLElement>("[data-card]") ?? []);

  const goTo = useCallback((i: number) => {
    const vp = viewportRef.current;
    const list = Array.from(vp?.querySelectorAll<HTMLElement>("[data-card]") ?? []);
    if (!vp || !list.length) return;
    const target = list[Math.max(0, Math.min(i, list.length - 1))];
    vp.scrollTo({ left: target.offsetLeft - list[0].offsetLeft, behavior: "smooth" });
  }, []);

  /** 직접 넘김 — 잠시 자동 넘김을 쉰다 */
  const step = (dir: 1 | -1) => {
    resumeAt.current = Date.now() + RESUME_MS;
    goTo(index + dir);
  };

  // 스크롤 위치 → 현재 칸 · 처음/끝 · 진행 막대
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const onScroll = () => {
      const max = vp.scrollWidth - vp.clientWidth;
      const list = cards();
      const first = list[0]?.offsetLeft ?? 0;
      let nearest = 0;
      list.forEach((c, i) => {
        if (Math.abs(c.offsetLeft - first - vp.scrollLeft) < Math.abs(list[nearest].offsetLeft - first - vp.scrollLeft)) nearest = i;
      });
      setIndex(nearest);
      setAtStart(vp.scrollLeft <= 2);
      setAtEnd(vp.scrollLeft >= max - 2);
      setProgress(max > 0 ? vp.scrollLeft / max : 1);
    };
    onScroll();
    vp.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      vp.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // 자동 넘김
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp || isStill() || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.6 });
    io.observe(vp);
    const userMoved = () => (resumeAt.current = Date.now() + RESUME_MS);
    vp.addEventListener("pointerdown", userMoved);
    vp.addEventListener("wheel", userMoved, { passive: true });
    vp.addEventListener("touchstart", userMoved, { passive: true });
    const id = window.setInterval(() => {
      if (!visible.current || paused.current || Date.now() < resumeAt.current || document.hidden) return;
      const max = vp.scrollWidth - vp.clientWidth;
      if (max <= 2) return;
      if (vp.scrollLeft >= max - 2) vp.scrollTo({ left: 0, behavior: "smooth" });
      else {
        const list = cards();
        const first = list[0]?.offsetLeft ?? 0;
        const next = list.find((c) => c.offsetLeft - first > vp.scrollLeft + 2);
        if (next) vp.scrollTo({ left: next.offsetLeft - first, behavior: "smooth" });
      }
    }, AUTO_MS);
    return () => {
      io.disconnect();
      window.clearInterval(id);
      vp.removeEventListener("pointerdown", userMoved);
      vp.removeEventListener("wheel", userMoved);
      vp.removeEventListener("touchstart", userMoved);
    };
  }, []);

  return (
    // 폭 · 위치는 01 · 04 겹침 사진 영역과 같게(오른쪽 정렬, min(72%, (화면높이-280px)×1.6)) — 사진 높이도 그 영역 높이(폭의 62%)에 맞춰 4:5
    <div
      className="ml-auto w-full md:w-[min(72%,calc((100svh-280px)*1.6))]"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocusCapture={() => (paused.current = true)}
      onBlurCapture={() => (paused.current = false)}
    >
      <div
        ref={viewportRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        className="@container -mx-[var(--gutter)] snap-x snap-mandatory scroll-px-[var(--gutter)] overflow-x-auto px-[var(--gutter)] [scrollbar-width:none] md:mx-0 md:scroll-px-0 md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex w-max gap-4 md:gap-6">
          {items.map((t, k) => (
            <li key={t.en} data-card className="w-[calc((100cqw-1rem)/2)] shrink-0 snap-start md:w-[calc((100cqw-1.5rem)/2)]">
              <div className="relative aspect-[4/5] overflow-hidden bg-card">
                {t.src ? (
                  /* eslint-disable-next-line @next/next/no-img-element -- 실사 웹 사본 */
                  <img src={t.src} alt={`${t.ko} 예시`} loading="lazy" className="size-full object-cover" />
                ) : (
                  <div className="flex size-full flex-col justify-between p-5 md:p-6">
                    <span aria-hidden="true" className="font-en text-[clamp(28px,2.6vw,40px)] leading-none font-extrabold tracking-[-0.04em] text-stone">
                      {t.en}
                    </span>
                    <span className="text-[13px] text-ash">실사 준비 중</span>
                  </div>
                )}
              </div>
              <p className="mt-4 flex items-baseline gap-3">
                <span className="font-en text-[12px] tabular-nums text-ash">{String(k + 1).padStart(2, "0")}</span>
                <span className="text-[17px] font-bold tracking-[-0.02em] text-charcoal">{t.ko}</span>
                <span className="font-en text-[12px] tracking-[0.1em] text-ash">{t.en}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* 진행 막대 + 이전 / 다음 */}
      <div className="mt-6 flex items-center gap-5">
        <div aria-hidden="true" className="h-px flex-1 bg-stone">
          <div className="h-full origin-left bg-charcoal transition-transform duration-300" style={{ transform: `scaleX(${Math.min(1, 2 / items.length + (1 - 2 / items.length) * progress)})` }} />
        </div>
        <p className="font-en text-[12px] tabular-nums text-ash">
          {String(index + 1).padStart(2, "0")}–{String(Math.min(index + 2, items.length)).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </p>
        <div className="flex gap-2">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => step(dir)}
              disabled={dir < 0 ? atStart : atEnd}
              aria-label={dir < 0 ? "이전" : "다음"}
              className="inline-flex size-11 items-center justify-center rounded-full border border-stone text-charcoal transition-colors hover:border-charcoal disabled:opacity-35 disabled:hover:border-stone"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className={`size-4 ${dir < 0 ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
