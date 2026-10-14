"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { vision } from "@/data/about";

gsap.registerPlugin(ScrollTrigger);

/**
 * ABOUT ③ 비전 — 큰 한 문장이 스크롤에 따라 넓은 자간에서 제자리로 모이며 또렷해진다(기획서 4.2 '자간/크기 변화').
 * 그 아래 두 축(턴키 · 브랜드 가치)과 회사 문장.
 */
export function VisionStatement() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        section.querySelector("[data-statement]"),
        { letterSpacing: "0.06em", opacity: 0.18 },
        {
          letterSpacing: "-0.03em",
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top 85%", end: "top 25%", scrub: 0.6 },
        },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} data-header-theme="light" aria-labelledby="vision-title" className="bg-mist py-28 md:py-40">
      <div className="container-yy">
        <h2 id="vision-title" className="label-en text-ash">
          {vision.label}
        </h2>
        <p data-statement className="mt-10 max-w-[20ch] text-[clamp(32px,4.8vw,76px)] leading-[1.18] font-bold tracking-[-0.03em] md:mt-14">
          {vision.statement}
        </p>

        <div className="mt-20 grid gap-12 md:mt-28 md:grid-cols-2 md:gap-10">
          {vision.pillars.map((pillar, i) => (
            <Reveal key={pillar.en} delay={i * 120} className="border-t border-charcoal/20 pt-7">
              <p className="font-en text-[clamp(18px,1.6vw,22px)] font-semibold tracking-[-0.01em]">{pillar.en}</p>
              <p className="mt-1 text-[15px] text-ash">{pillar.ko}</p>
              <p className="mt-6 max-w-[42ch] text-[16px] leading-[1.8]">{pillar.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20 md:mt-28">
          <blockquote className="max-w-[46ch] text-[clamp(17px,1.5vw,21px)] leading-[1.75] text-charcoal/85">
            “{vision.quote}”
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
