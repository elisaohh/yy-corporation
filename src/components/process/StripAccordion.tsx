"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

/** 사진 칸 — src가 없으면 "실사 준비 중" 칸 */
export type TrackItem = { en: string; ko: string; src?: string; alt?: string };

/** 폭 · 위치는 01 · 04 겹침 사진 영역과 같게(오른쪽 정렬, 폭 min(72%, (화면높이-280px)×1.6)) */
const BOX = "ml-auto w-full md:w-[min(72%,calc((100svh-280px)*1.6))]";
const pad = (n: number) => String(n).padStart(2, "0");

function Photo({ item, className = "", bare = false }: { item: TrackItem; className?: string; bare?: boolean }) {
  // bare: 접힌 띠처럼 좁을 때 — 사진이 없으면 빈 회색 칸만
  if (!item.src && bare) return <div className={`size-full bg-card ${className}`} />;
  return item.src ? (
    /* eslint-disable-next-line @next/next/no-img-element -- 실사 웹 사본 */
    <img src={item.src} alt={item.alt ?? item.ko} draggable={false} className={`size-full object-cover ${className}`} />
  ) : (
    <div className={`flex size-full flex-col justify-between bg-card p-4 md:p-5 ${className}`}>
      <span aria-hidden="true" className="font-en text-[clamp(18px,2vw,30px)] leading-none font-extrabold tracking-[-0.04em] text-stone">
        {item.en}
      </span>
      <span className="text-[12px] text-ash">{item.ko} · 실사 준비 중</span>
    </div>
  );
}

/** 좌우로 밀기(터치) → -1 / +1 */
function useSwipe(onStep: (dir: 1 | -1) => void) {
  const start = useRef<number | null>(null);
  return {
    onPointerDown: (e: ReactPointerEvent) => {
      if (e.pointerType !== "mouse") start.current = e.clientX;
    },
    onPointerUp: (e: ReactPointerEvent) => {
      if (start.current === null) return;
      const dx = e.clientX - start.current;
      start.current = null;
      if (Math.abs(dx) > 40) onStep(dx < 0 ? 1 : -1);
    },
    onPointerCancel: () => (start.current = null),
  };
}

/**
 * PACKAGING TURN-KEY 02 · 03 사진 — 펼쳐지는 띠: 공정 사진을 세로 띠로 나란히 두고, 마우스를 올린 띠가 넓어지며 사진 전체 · 이름이 보인다.
 * 나머지 띠는 좁아져 영문 이름만 세로로 남는다. 터치: 좌우로 밀기 · 띠 누르기. 키보드: 띠마다 포커스, ← →.
 */
export function StripAccordion({ label, items }: { label: string; items: TrackItem[] }) {
  const [active, setActive] = useState(0);
  const n = items.length;
  const set = (i: number) => setActive(Math.max(0, Math.min(n - 1, i)));
  const swipe = useSwipe((d) => set(active + d));

  return (
    <div className={BOX}>
      <ul
        aria-label={label}
        {...swipe}
        className="flex touch-pan-y gap-1.5 select-none md:gap-2"
        style={{ aspectRatio: "100 / 62" }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            const to = Math.max(0, Math.min(n - 1, active + (e.key === "ArrowRight" ? 1 : -1)));
            set(to);
            (e.currentTarget.querySelectorAll("button")[to] as HTMLButtonElement | undefined)?.focus();
          }
        }}
      >
        {items.map((it, i) => {
          const on = i === active;
          return (
            <li
              key={it.en}
              className="relative min-w-0 overflow-hidden bg-card transition-[flex-grow] duration-700 ease-[var(--ease-yy-out)]"
              style={{ flexGrow: on ? 6 : 1, flexBasis: 0 }}
            >
              <button
                type="button"
                aria-pressed={on}
                aria-label={`${pad(i + 1)} ${it.ko}`}
                onMouseEnter={() => set(i)}
                onFocus={() => set(i)}
                onClick={() => set(i)}
                className="absolute inset-0 block size-full text-left"
              >
                {/* 사진은 펼친 폭 기준으로 두고 가운데를 보여 준다(접혀도 찌그러지지 않음) */}
                <span className={`absolute inset-0 transition-[filter] duration-700 ${on ? "" : "brightness-[0.82] grayscale-[30%]"}`}>
                  <Photo item={it} bare={!on} />
                </span>
                {/* 접힌 띠: 영문 이름 세로 */}
                <span
                  aria-hidden="true"
                  className={`absolute bottom-4 left-1/2 -translate-x-1/2 font-en text-[11px] tracking-[0.16em] whitespace-nowrap transition-opacity duration-300 [writing-mode:vertical-rl] ${
                    on ? "opacity-0" : "opacity-100 delay-200"
                  } ${it.src ? "text-on-dark" : "text-ash"}`}
                >
                  {it.en}
                </span>
                {/* 펼친 띠: 번호 · 이름 */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 flex items-baseline gap-2 bg-gradient-to-t from-intro/70 to-transparent px-4 pb-3.5 pt-10 text-on-dark transition-opacity duration-500 ${
                    on && it.src ? "opacity-100 delay-300" : "opacity-0"
                  }`}
                >
                  <span className="font-en text-[12px] tabular-nums text-on-dark/75">{pad(i + 1)}</span>
                  <span className="text-[16px] font-bold tracking-[-0.02em]">{it.ko}</span>
                  <span className="font-en text-[11px] tracking-[0.1em] text-on-dark/75">{it.en}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
