"use client";

import { useEffect, useRef } from "react";
import { isStill } from "@/lib/still";

/** 띠 칸 — src가 없으면 "실사 준비 중" 칸 */
export type TrackItem = { en: string; ko: string; src?: string; alt?: string };

/** 원통 안쪽에서 보이는 범위(가운데 기준 좌우 각도) */
const ARC_DEG = 62;
/** 흐르는 속도(도/초) — 한 칸 넘어가는 데 약 5초 */
const SPEED = 6;

/**
 * PACKAGING TURN-KEY 02 · 03 사진 띠 (2026-10-16, 레퍼런스: 오목하게 휜 띠가 계속 흐르는 모션).
 * - 사진이 원통 안쪽 면에 놓인 것처럼 가운데는 멀리(작게), 양 끝은 가까이(크게) 보이고, 왼쪽으로 천천히 끝없이 흐른다.
 * - 페이지 스크롤과 무관. 화면에 보일 때만 움직이고, 마우스를 올리면 천천히 멈춘다.
 * - 모션 줄이기 · ?still: 멈춘 상태(같은 휜 배치).
 * - 같은 사진을 반복해 띠를 채운다. 반복분은 보조기기에 숨기고, 항목 목록은 화면 밖 텍스트로 한 번만 읽힌다.
 */
export function CurvedMarquee({ label, items }: { label: string; items: TrackItem[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  // 원통 둘레를 채울 만큼 반복
  const reps = Math.max(2, Math.ceil(14 / items.length));
  const cards = Array.from({ length: items.length * reps }, (_, i) => items[i % items.length]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const els = Array.from(stage.querySelectorAll<HTMLElement>("[data-card]"));
    const arc = (ARC_DEG * Math.PI) / 180;
    let W = 0, R = 0, step = 0, total = 0, cardW = 0;

    const measure = () => {
      W = stage.clientWidth;
      if (!W) return; // 숨겨져 폭이 0일 때는 이전 값 유지(0이면 위치 계산이 깨짐)
      const mobile = W < 520;
      cardW = W * (mobile ? 0.36 : 0.3);
      const gap = W * 0.018;
      R = W / 2 / Math.sin(arc);
      step = (cardW + gap) / R;
      total = step * els.length;
      stage.style.perspective = `${Math.round(W * 1.15)}px`;
      els.forEach((el) => (el.style.width = `${cardW}px`));
    };

    let offset = 0;
    const place = () => {
      if (!total) return;
      els.forEach((el, i) => {
        // -total/2 ~ total/2 범위로 감아서 가운데 기준 각도
        let a = (((i * step - offset) % total) + total) % total;
        if (a > total / 2) a -= total;
        const visible = Math.abs(a) < arc + step;
        el.style.visibility = visible ? "visible" : "hidden";
        if (!visible) return;
        const x = R * Math.sin(a);
        const z = R * (1 - Math.cos(a));
        el.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, 0, ${z.toFixed(1)}px) rotateY(${(-a * 180) / Math.PI}deg)`;
      });
    };

    measure();
    offset = step * 0.5; // 가운데에 칸 사이가 오도록 → 가운데 두 장이 나란히
    place();
    const ro = new ResizeObserver(() => {
      measure();
      place();
    });
    ro.observe(stage);

    if (isStill() || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => ro.disconnect();

    let visible = false;
    let hover = false;
    let speed = SPEED;
    let last = 0;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      // 마우스를 올리면 부드럽게 감속, 떼면 다시 가속
      speed += ((hover ? 0 : SPEED) - speed) * Math.min(1, dt * 3);
      offset += ((speed * Math.PI) / 180) * dt;
      place();
      raf = visible && !document.hidden ? requestAnimationFrame(tick) : 0;
    };
    const onEnter = () => (hover = true);
    const onLeave = () => (hover = false);
    const onVis = () => {
      if (!document.hidden && visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    io.observe(stage);
    stage.addEventListener("mouseenter", onEnter);
    stage.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      ro.disconnect();
      io.disconnect();
      cancelAnimationFrame(raf);
      stage.removeEventListener("mouseenter", onEnter);
      stage.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [items.length]);

  return (
    // 폭 · 위치 · 높이는 01 · 04 겹침 사진 영역과 같게(오른쪽 정렬, 폭 min(72%, (화면높이-280px)×1.6), 높이 = 폭의 62%)
    <div className="ml-auto w-full md:w-[min(72%,calc((100svh-280px)*1.6))]">
      <ul className="sr-only" aria-label={label}>
        {items.map((t) => (
          <li key={t.en}>
            {t.ko} ({t.en}){t.src ? "" : " — 실사 준비 중"}
          </li>
        ))}
      </ul>
      <div
        ref={stageRef}
        aria-hidden="true"
        className="relative aspect-[100/75] overflow-hidden md:aspect-[100/62]"
      >
        {cards.map((t, i) => (
          <div key={i} data-card className="invisible absolute left-1/2 top-1/2 aspect-[4/5] overflow-hidden bg-card [backface-visibility:hidden] [will-change:transform]">
            {t.src ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element -- 실사 웹 사본 */}
                <img src={t.src} alt="" loading="lazy" draggable={false} className="size-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 flex flex-wrap items-baseline gap-x-2 bg-gradient-to-t from-intro/75 to-transparent px-3 pb-2.5 pt-8 text-on-dark">
                  <span className="text-[14px] font-bold tracking-[-0.02em]">{t.ko}</span>
                  <span className="font-en text-[10px] tracking-[0.1em] text-on-dark/75">{t.en}</span>
                </span>
              </>
            ) : (
              <div className="flex size-full flex-col justify-between p-3 md:p-4">
                <span className="font-en text-[clamp(14px,1.4vw,20px)] leading-none font-extrabold tracking-[-0.04em] text-stone">{t.en}</span>
                <span>
                  <span className="block text-[14px] font-bold tracking-[-0.02em] text-charcoal">{t.ko}</span>
                  <span className="mt-1 block text-[11px] text-ash">실사 준비 중</span>
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
