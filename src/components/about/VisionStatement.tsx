"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { aboutMedia, vision } from "@/data/about";

gsap.registerPlugin(ScrollTrigger);

/**
 * ABOUT ③ 비전 — 어두운 배경 위 현장 사진(또는 영상)이 스크롤에 따라 천천히 확대된다.
 * 큰 한 문장이 넓은 자간에서 제자리로 모이며 또렷해지고(기획서 4.2 '자간/크기 변화'), 두 축은 반투명 카드로.
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
        { letterSpacing: "0.06em", opacity: 0.2 },
        { letterSpacing: "-0.03em", opacity: 1, ease: "none", scrollTrigger: { trigger: section, start: "top 80%", end: "top 15%", scrub: 0.6 } },
      );
      gsap.fromTo(
        section.querySelector("[data-bg]"),
        { scale: 1.18, yPercent: -6 },
        { scale: 1.02, yPercent: 6, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.6 } },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} data-header-theme="dark" data-surface="dark" aria-labelledby="vision-title" className="relative overflow-hidden bg-intro py-28 text-on-dark md:py-40">
      <div aria-hidden="true" className="absolute inset-0">
        <div data-bg className="absolute inset-0">
          {aboutMedia.vision.video ? (
            <video src={aboutMedia.vision.video} autoPlay muted loop playsInline className="size-full object-cover opacity-45" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- 배경 사진
            <img src={aboutMedia.vision.image} alt="" loading="lazy" className="size-full object-cover opacity-40" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-intro/80 via-intro/55 to-intro/90" />
      </div>

      <div className="container-yy relative">
        <h2 id="vision-title" className="label-en text-point-1225">
          {vision.label}
        </h2>
        <p data-statement className="mt-10 max-w-[20ch] text-[clamp(32px,4.8vw,76px)] leading-[1.18] font-bold tracking-[-0.03em] md:mt-14">
          {vision.statement}
        </p>

        <div className="mt-20 grid gap-4 md:mt-28 md:grid-cols-2 md:gap-6">
          {vision.pillars.map((pillar, i) => (
            <Reveal key={pillar.en} delay={i * 120} className="border border-white/15 bg-white/[0.06] p-8 backdrop-blur-md md:p-10">
              <p className="font-en text-[12px] tabular-nums text-on-dark-sub">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-6 font-en text-[clamp(20px,1.8vw,26px)] font-semibold tracking-[-0.01em]">{pillar.en}</p>
              <p className="mt-1 text-[15px] text-on-dark-sub">{pillar.ko}</p>
              <p className="mt-6 max-w-[42ch] text-[16px] leading-[1.8] text-on-dark/85">{pillar.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20 md:mt-28">
          <blockquote className="max-w-[46ch] border-l-2 border-point-1225 pl-6 text-[clamp(17px,1.5vw,21px)] leading-[1.75] text-on-dark/90">
            {vision.quote}
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
