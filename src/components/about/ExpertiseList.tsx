"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { aboutMedia, expertise } from "@/data/about";

gsap.registerPlugin(ScrollTrigger);

/**
 * ABOUT ⑤ 전문 역량 — 왼쪽 세로 리스트(화면 가운데 항목 강조) + 오른쪽 고정 사진이 항목에 맞춰 바뀐다(데스크톱).
 * 모바일은 항목마다 사진을 위에 둔다. 모션 줄이기 · 스크립트 전에는 모든 항목이 진하게 보인다.
 */
export function ExpertiseList() {
  const ref = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const triggers = Array.from(list.children).map((el, i) =>
      ScrollTrigger.create({ trigger: el, start: "top 55%", end: "bottom 55%", onToggle: (self) => self.isActive && setActive(i) }),
    );
    setActive(0);
    return () => triggers.forEach((t) => t.kill());
  }, []);

  const shown = active ?? 0;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
      <ol ref={ref} className="border-b border-stone lg:col-span-7">
        {expertise.map((item, i) => {
          const on = active === null || active === i;
          return (
            <li
              key={item.key}
              aria-current={active === i ? "step" : undefined}
              className="border-t border-stone py-10 transition-colors duration-500 md:py-14"
              style={{ color: on ? "var(--color-charcoal)" : "color-mix(in srgb, var(--color-ash) 40%, var(--color-paper))" }}
            >
              {/* 모바일: 항목 사진 */}
              <div className="mb-6 aspect-[4/3] max-w-[420px] overflow-hidden bg-card lg:hidden">
                {/* eslint-disable-next-line @next/next/no-img-element -- 현장 사진 */}
                <img src={aboutMedia.expertise[item.key]} alt="" loading="lazy" className="size-full object-cover" />
              </div>
              <p className="flex items-baseline gap-4">
                <span className="font-en text-[12px] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-en text-[clamp(40px,5.6vw,92px)] leading-[0.9] font-extrabold tracking-[-0.045em] uppercase">{item.key}</span>
              </p>
              <div className={`mt-6 grid gap-2 transition-opacity duration-500 md:grid-cols-[140px_minmax(0,1fr)] md:gap-8 ${on ? "opacity-100" : "opacity-40"}`}>
                <p className="font-en text-[12px] font-medium tracking-[0.14em] uppercase" style={{ color: on ? "var(--color-ash)" : undefined }}>
                  {item.service}
                </p>
                <div>
                  <p className="text-[clamp(18px,1.5vw,21px)] font-semibold tracking-[-0.02em]">{item.line}</p>
                  <p className="mt-3 max-w-[44ch] text-[15px] leading-[1.8]" style={{ color: on ? "var(--color-ash)" : undefined }}>
                    {item.body}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* 데스크톱: 고정 사진 — 활성 항목에 맞춰 교차 전환 */}
      <div aria-hidden="true" className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-[calc(var(--header-h)+64px)] ml-auto aspect-[4/5] w-full max-w-[360px] overflow-hidden bg-card">
          {expertise.map((item, i) => (
            // eslint-disable-next-line @next/next/no-img-element -- 현장 사진
            <img
              key={item.key}
              src={aboutMedia.expertise[item.key]}
              alt=""
              loading="lazy"
              className="absolute inset-0 size-full object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-yy-out)]"
              style={{ opacity: shown === i ? 1 : 0, transform: shown === i ? "scale(1)" : "scale(1.06)" }}
            />
          ))}
          <p className="absolute bottom-4 left-4 bg-paper/90 px-2 py-1 font-en text-[11px] font-semibold tracking-[0.14em] uppercase">
            {expertise[shown]?.key}
          </p>
        </div>
      </div>
    </div>
  );
}
