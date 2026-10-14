"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { expertise } from "@/data/about";

gsap.registerPlugin(ScrollTrigger);

/**
 * ABOUT ⑤ 전문 역량 — 얇은 구분선의 세로 리스트, 화면 가운데를 지나는 항목이 진하게 강조된다(부록 E).
 * 모션 줄이기 · 스크립트 전에는 모든 항목이 진하게 보인다.
 */
export function ExpertiseList() {
  const ref = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const triggers = Array.from(list.children).map((el, i) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => self.isActive && setActive(i),
      }),
    );
    setActive(0);
    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <ol ref={ref} className="border-b border-stone">
      {expertise.map((item, i) => {
        const on = active === null || active === i;
        return (
          <li
            key={item.key}
            aria-current={active === i ? "step" : undefined}
            className="grid gap-4 border-t border-stone py-10 transition-colors duration-500 md:grid-cols-12 md:gap-8 md:py-14"
            style={{ color: on ? "var(--color-charcoal)" : "color-mix(in srgb, var(--color-ash) 40%, var(--color-paper))" }}
          >
            <p className="flex items-baseline gap-4 md:col-span-6">
              <span className="font-en text-[12px] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-en text-[clamp(40px,6.4vw,104px)] leading-[0.9] font-extrabold tracking-[-0.045em] uppercase">
                {item.key}
              </span>
            </p>
            <div className={`md:col-span-5 md:col-start-8 transition-opacity duration-500 ${on ? "opacity-100" : "opacity-40"}`}>
              <p className="font-en text-[12px] font-medium tracking-[0.14em] uppercase" style={{ color: on ? "var(--color-ash)" : undefined }}>
                {item.service}
              </p>
              <p className="mt-2 text-[clamp(18px,1.5vw,21px)] font-semibold tracking-[-0.02em]">{item.line}</p>
              <p className="mt-3 max-w-[40ch] text-[15px] leading-[1.8]" style={{ color: on ? "var(--color-ash)" : undefined }}>
                {item.body}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
