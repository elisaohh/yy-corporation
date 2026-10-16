"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

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
 * A안 — 겹침 교체: 01 · 04와 같은 큰 사진 + 오른쪽 아래로 겹친 작은 사진(흰 테두리 · 그림자).
 * 큰 사진 = 지금 공정, 작은 사진 = 다음 공정. 아래 이름에 마우스를 올리거나 사진 위에서 커서를 좌우로 움직이면 부드럽게 바뀐다.
 * 터치: 좌우로 밀기 · 이름 누르기. 키보드: ← →, 이름 버튼.
 */
export function StackSwap({ label, items }: { label: string; items: TrackItem[] }) {
  const [active, setActive] = useState(0);
  const n = items.length;
  const set = (i: number) => setActive(Math.max(0, Math.min(n - 1, i)));
  const swipe = useSwipe((d) => set(active + d));
  const next = (active + 1) % n;

  return (
    <div className={BOX}>
      <div
        role="group"
        aria-label={`${label} — 좌우 방향키로 넘겨 보기`}
        tabIndex={0}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          set(Math.floor(((e.clientX - r.left) / r.width) * n));
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            set(active + (e.key === "ArrowRight" ? 1 : -1));
          }
        }}
        {...swipe}
        className="relative touch-pan-y select-none"
        style={{ aspectRatio: "100 / 62" }}
      >
        {/* 큰 사진 — 지금 공정 */}
        <div className="absolute left-0 top-0 aspect-[4/3] w-[70%] overflow-hidden bg-card">
          {items.map((it, i) => (
            <div
              key={it.en}
              aria-hidden={i !== active}
              className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-[var(--ease-yy-out)] ${i === active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"}`}
            >
              <Photo item={it} />
            </div>
          ))}
        </div>
        {/* 작은 사진 — 다음 공정(겹침, 스크롤 시 조금 더 빨리 움직임) */}
        <div
          data-shift={-24}
          className="absolute left-[52%] z-10 aspect-[4/3] w-[48%] overflow-hidden bg-card shadow-[0_24px_60px_-28px_rgba(43,43,42,0.45)] ring-[6px] ring-paper md:ring-8"
          style={{ top: `${(23 / 62) * 100}%` }}
        >
          {items.map((it, i) => (
            <div
              key={it.en}
              aria-hidden="true"
              className={`absolute inset-0 transition-opacity delay-100 duration-700 ease-[var(--ease-yy-out)] ${i === next ? "opacity-100" : "opacity-0"}`}
            >
              <Photo item={it} />
            </div>
          ))}
        </div>
      </div>

      {/* 공정 이름 — 마우스를 올리거나 포커스 · 누르면 그 공정으로 */}
      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-stone pt-4">
        {items.map((it, i) => (
          <li key={it.en}>
            <button
              type="button"
              aria-pressed={i === active}
              onMouseEnter={() => set(i)}
              onFocus={() => set(i)}
              onClick={() => set(i)}
              className={`inline-flex min-h-11 items-baseline gap-2 border-b-2 transition-colors duration-300 ${
                i === active ? "border-charcoal text-charcoal" : "border-transparent text-ash hover:text-charcoal"
              }`}
            >
              <span className="font-en text-[12px] tabular-nums">{pad(i + 1)}</span>
              <span className="text-[16px] font-bold tracking-[-0.02em]">{it.ko}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * B안 — 펼쳐지는 띠: 공정 사진을 세로 띠로 나란히 두고, 마우스를 올린 띠가 넓어지며 사진 전체 · 이름이 보인다.
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

/** 비교용 — ?v=a(기본) · ?v=b */
export function FinishingShowcase(props: { label: string; items: TrackItem[] }) {
  const [v, setV] = useState<"a" | "b">("a");
  useEffect(() => {
    setV(new URLSearchParams(window.location.search).get("v") === "b" ? "b" : "a");
  }, []);
  return v === "b" ? <StripAccordion {...props} /> : <StackSwap {...props} />;
}
