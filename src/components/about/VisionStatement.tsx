"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { aboutMedia, vision, visionVideoCandidates } from "@/data/about";

gsap.registerPlugin(ScrollTrigger);

/**
 * ABOUT ③ 비전 — 어두운 배경 위 현장 사진(또는 영상)이 스크롤에 따라 천천히 확대된다.
 * 큰 한 문장이 넓은 자간에서 제자리로 모이며 또렷해지고(기획서 4.2 '자간/크기 변화'), 두 축은 반투명 카드로.
 */
export function VisionStatement() {
  const ref = useRef<HTMLElement>(null);
  // 개발 서버 미리보기: /about?vision=1~6 → 후보 영상
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const n = Number(new URLSearchParams(window.location.search).get("vision"));
    const c = visionVideoCandidates[n - 1];
    if (c) setPreview(c.src);
  }, []);
  const video = preview ?? aboutMedia.vision.video;

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
    <section ref={ref} data-header-theme="dark" data-surface="dark" aria-labelledby="vision-title" className="relative overflow-hidden bg-intro py-20 text-on-dark md:py-24 lg:flex lg:min-h-[100svh] lg:items-center lg:py-[calc(var(--header-h)+24px)]">
      <div aria-hidden="true" className="absolute inset-0">
        <div data-bg className="absolute inset-0">
          {video ? (
            <video key={video} src={video} autoPlay muted loop playsInline className="size-full object-cover opacity-50" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- 배경 사진
            <img src={aboutMedia.vision.image} alt="" loading="lazy" className="size-full object-cover opacity-40" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-intro/80 via-intro/55 to-intro/90" />
      </div>

      <div className="container-yy relative w-full">
        <h2 id="vision-title" className="label-en flex items-center gap-3 text-on-dark-sub">
          <span className="size-1.5 rounded-full bg-point-1225" aria-hidden="true" />
          {vision.label}
        </h2>
        <p data-statement className="mt-6 max-w-[24ch] text-[clamp(28px,3.4vw,54px)] leading-[1.2] font-bold tracking-[-0.03em] md:mt-8">
          {vision.statement}
        </p>

        <div className="mt-12 grid gap-4 md:mt-14 md:grid-cols-2 md:gap-6">
          {vision.pillars.map((pillar, i) => (
            <Reveal key={pillar.en} delay={i * 120} className="border border-white/15 bg-white/[0.06] p-6 backdrop-blur-md md:p-8">
              <p className="font-en text-[clamp(18px,1.6vw,22px)] font-semibold tracking-[-0.01em]">{pillar.en}</p>
              <p className="mt-1 text-[15px] text-on-dark-sub">{pillar.ko}</p>
              <p className="mt-4 max-w-[46ch] text-[15px] leading-[1.75] text-on-dark/85">{pillar.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 md:mt-12">
          <blockquote className="max-w-[60ch] border-l-2 border-point-1225 pl-6 text-[clamp(16px,1.3vw,18px)] leading-[1.7] text-on-dark/90">
            {vision.quote}
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
