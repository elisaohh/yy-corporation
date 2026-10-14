"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { Logo } from "@/components/brand/Logo";
import { aboutIntro } from "@/data/about";

gsap.registerPlugin(ScrollTrigger);

/**
 * ABOUT ① 인트로 — 공식 로고를 크게 두고(기획서 4.2), 스크롤하면 로고가 작아지며 위로 물러난다.
 * 아래에 큰 영문 타이틀 + 공식 문구(부록 E). 사진 없음.
 */
export function AboutIntro() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(section);
      // 첫 등장: 로고 → 타이틀 → 문구
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(q("[data-logo]"), { autoAlpha: 0, scale: 0.94, duration: 1.2 })
        .from(q("[data-in]"), { autoAlpha: 0, y: 18, duration: 0.9, stagger: 0.1 }, "-=0.7");
      // 스크롤: 로고가 작아지며 위로, 옅어짐
      gsap.to(q("[data-logo-scroll]"), {
        scale: 0.55,
        yPercent: -35,
        autoAlpha: 0.15,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 0.6 },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} data-header-theme="light" aria-labelledby="about-title" className="relative bg-paper">
      <div className="container-yy flex min-h-[100svh] flex-col pb-12 pt-[calc(var(--header-h)+24px)] md:pb-16">
        <div className="grid flex-1 place-items-center py-10">
          <div data-logo-scroll>
            <div data-logo>
              <Logo placement="aboutIntro" priority className="h-[clamp(110px,18vw,200px)] w-auto" />
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <h1
            id="about-title"
            data-in
            className="font-en text-[clamp(56px,11vw,176px)] leading-[0.85] font-light tracking-[-0.03em] uppercase md:col-span-7"
          >
            {aboutIntro.title}
          </h1>
          <div data-in className="md:col-span-5 md:pb-3">
            <p className="text-[clamp(20px,1.8vw,26px)] leading-[1.4] font-semibold tracking-[-0.02em]">{aboutIntro.slogan}</p>
            <p className="mt-3 max-w-[34ch] text-[clamp(15px,1.2vw,17px)] leading-[1.75] text-ash">{aboutIntro.lead}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
