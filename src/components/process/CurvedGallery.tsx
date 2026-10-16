"use client";

import { useEffect, useRef, useState } from "react";

/** 사진 칸 — src가 없으면 "실사 준비 중" 칸 */
export type TrackItem = { en: string; ko: string; src?: string; alt?: string };

/** 이웃한 사진 사이 각도 */
const STEP_DEG = 34;
/** 따라가는 부드러움(클수록 빨리 따라감) */
const EASE = 7;

/**
 * PACKAGING TURN-KEY 02 · 03 사진 (2026-10-16, 자동 흐름 · 클릭 대신).
 * - 사진을 볼록한 원통 바깥면에 놓아, 앞의 사진은 크고 가깝게 · 옆 사진은 비스듬히 물러나 보인다.
 * - 마우스: 영역 위에서 커서를 좌우로 움직이면 커서 위치에 맞는 사진이 앞으로 돈다.
 *   터치 · 마우스 끌기: 좌우로 밀어 돌리고, 놓으면 가장 가까운 사진에 맞춰 선다. 키보드: ← → 로 한 장씩.
 * - 사진은 반복하지 않는다(실제 장수만). 01 · 04 겹침 사진과 같은 흰 테두리 · 그림자, 같은 폭 · 높이 · 위치.
 * - 모션 줄이기: 부드러운 따라감 없이 바로 이동.
 */
export function CurvedGallery({ label, items }: { label: string; items: TrackItem[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const n = items.length;
  // 처음에는 가운데쯤 사진이 앞(양옆에 이웃이 보이도록)
  const start = Math.floor((n - 1) / 2);
  const [front, setFront] = useState(start);
  const target = useRef(start);
  const current = useRef(start);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const els = Array.from(stage.querySelectorAll<HTMLElement>("[data-card]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const step = (STEP_DEG * Math.PI) / 180;
    let W = 0, R = 0, cardW = 0;

    const measure = () => {
      const w = stage.clientWidth;
      if (!w) return;
      W = w;
      cardW = W * (W < 520 ? 0.5 : 0.42);
      R = (cardW + W * 0.05) / step;
      stage.style.perspective = `${Math.round(W * 1.6)}px`;
      els.forEach((el) => (el.style.width = `${cardW}px`));
    };

    let shown = -1;
    const place = () => {
      if (!R) return;
      els.forEach((el, i) => {
        const a = (i - current.current) * step;
        const hidden = Math.abs(a) > step * 2.2;
        el.style.visibility = hidden ? "hidden" : "visible";
        if (hidden) return;
        // 볼록: 옆으로 갈수록 뒤로 물러나고(z−), 바깥을 향해 돌아선다
        const x = R * Math.sin(a);
        const z = R * (Math.cos(a) - 1);
        el.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, 0, ${z.toFixed(1)}px) rotateY(${((a * 180) / Math.PI).toFixed(2)}deg)`;
        el.style.zIndex = String(100 - Math.round(Math.abs(a) * 20));
        // 옆 사진은 조금 옅게 → 앞 사진에 시선
        el.style.filter = `brightness(${(1 - Math.min(0.18, Math.abs(a) * 0.22)).toFixed(3)})`;
      });
      const f = Math.round(current.current);
      if (f !== shown) {
        shown = f;
        setFront(f);
      }
    };

    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const diff = target.current - current.current;
      current.current = reduce || Math.abs(diff) < 0.001 ? target.current : current.current + diff * Math.min(1, dt * EASE);
      place();
      raf = current.current !== target.current ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    const clamp = (v: number) => Math.max(0, Math.min(n - 1, v));

    // 마우스(호버): 커서의 가로 위치 → 앞에 올 사진
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || dragging) return;
      const r = stage.getBoundingClientRect();
      const t = (e.clientX - r.left) / r.width;
      target.current = clamp(((t - 0.1) / 0.8) * (n - 1));
      kick();
    };
    // 끌기(터치 · 마우스 누른 채): 민 만큼 돌리고, 놓으면 가까운 사진에 맞춤
    let dragging = false;
    let startX = 0;
    let startT = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      startX = e.clientX;
      startT = target.current;
    };
    const onDrag = (e: PointerEvent) => {
      if (!dragging) return;
      target.current = clamp(startT - (e.clientX - startX) / (cardW * 0.9));
      kick();
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      target.current = Math.round(target.current);
      kick();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      target.current = clamp(Math.round(target.current) + (e.key === "ArrowRight" ? 1 : -1));
      kick();
    };

    measure();
    place();
    const ro = new ResizeObserver(() => {
      measure();
      place();
    });
    ro.observe(stage);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onDrag);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    stage.addEventListener("keydown", onKey);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onDrag);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      stage.removeEventListener("keydown", onKey);
    };
  }, [n]);

  const cur = items[Math.max(0, Math.min(n - 1, front))];

  return (
    // 폭 · 위치 · 높이는 01 · 04 겹침 사진 영역과 같게(오른쪽 정렬, 폭 min(72%, (화면높이-280px)×1.6), 높이 = 폭의 62%)
    <div className="ml-auto w-full md:w-[min(72%,calc((100svh-280px)*1.6))]">
      <div
        ref={stageRef}
        role="group"
        aria-roledescription="gallery"
        aria-label={`${label} — 좌우 방향키로 넘겨 보기`}
        tabIndex={0}
        className="relative aspect-[100/80] cursor-grab touch-pan-y select-none overflow-x-clip active:cursor-grabbing md:aspect-[100/62]"
      >
        {items.map((t, i) => (
          <figure
            key={t.en}
            data-card
            aria-hidden={i !== front}
            className="invisible absolute left-1/2 top-1/2 m-0 aspect-[4/5] overflow-hidden bg-card shadow-[0_24px_60px_-28px_rgba(43,43,42,0.45)] ring-[6px] ring-paper [will-change:transform] md:ring-8"
          >
            {t.src ? (
              /* eslint-disable-next-line @next/next/no-img-element -- 실사 웹 사본 */
              <img src={t.src} alt={t.alt ?? t.ko} draggable={false} className="size-full object-cover" />
            ) : (
              <div className="flex size-full flex-col justify-between p-4 md:p-5">
                <span className="font-en text-[clamp(18px,1.9vw,28px)] leading-none font-extrabold tracking-[-0.04em] text-stone">{t.en}</span>
                <span className="text-[12px] text-ash">실사 준비 중</span>
              </div>
            )}
          </figure>
        ))}
      </div>

      {/* 앞에 온 사진 이름 + 위치 */}
      <div className="mt-6 flex items-baseline gap-3 border-t border-stone pt-4">
        <span className="font-en text-[12px] tabular-nums text-ash">{String(front + 1).padStart(2, "0")}</span>
        <span aria-live="polite" className="text-[17px] font-bold tracking-[-0.02em] text-charcoal">
          {cur.ko}
        </span>
        <span className="font-en text-[12px] tracking-[0.1em] text-ash">{cur.en}</span>
        <span className="ml-auto font-en text-[12px] tabular-nums text-ash">/ {String(n).padStart(2, "0")}</span>
      </div>
    </div>
  );
}
