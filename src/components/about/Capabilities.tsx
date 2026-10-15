"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { capabilities } from "@/data/about";

gsap.registerPlugin(ScrollTrigger);

/**
 * ABOUT 비전 아래 03 DECORATION · 04 GLOBAL SOURCING — 흰 바탕, 큰 영문 단어 중심의 절제된 구성.
 * 스크롤 모션: 위 구분선이 왼쪽부터 그어지고 → 영문 단어가 아래에서 차오르고 → 한글 제목 · 설명이 이어서 나타난다.
 * 데스크톱에서는 영문 단어가 스크롤에 따라 아주 조금 옆으로 흘러 깊이감을 준다.
 */
export function Capabilities() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 1024px)" }, (ctx) => {
      if (!ctx.conditions?.motion) return;
      gsap.utils.toArray<HTMLElement>("[data-cap]", section).forEach((row, i) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 78%", toggleActions: "play none none reverse" } });
        tl.fromTo(row.querySelector("[data-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "power3.inOut" })
          .fromTo(row.querySelector("[data-no]"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.6")
          .fromTo(row.querySelector("[data-word]"), { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: "power4.out" }, "-=0.5")
          .fromTo(row.querySelectorAll("[data-copy]"), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power2.out" }, "-=0.7");
        if (ctx.conditions?.desktop) {
          gsap.fromTo(
            row.querySelector("[data-drift]"),
            { xPercent: i % 2 ? -4 : 4 },
            { xPercent: i % 2 ? 2 : -2, ease: "none", scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: 0.6 } },
          );
        }
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} data-header-theme="light" aria-label="후가공 · 글로벌 소싱" className="overflow-hidden bg-paper py-24 md:py-36">
      <div className="container-yy grid gap-20 md:gap-28">
        {capabilities.map((c, i) => (
          <article key={c.en} data-cap className="relative">
            <span data-rule aria-hidden="true" className="block h-px origin-left bg-charcoal" />
            <div className="mt-6 md:mt-8">
              <p data-no className="font-en text-[13px] tabular-nums tracking-[0.14em] text-ash">
                {c.no}
                <span className="ml-3 inline-block size-1.5 -translate-y-[3px] rounded-full bg-point-4008 align-middle" />
              </p>
            </div>

            <div data-drift className={i % 2 ? "md:text-right" : ""}>
              <h3 className="mt-6 overflow-hidden pb-[0.04em] md:mt-8">
                <span data-word className="block font-en text-[clamp(44px,8.6vw,148px)] leading-[0.92] font-extrabold tracking-[-0.05em] text-charcoal">
                  {c.en}
                </span>
              </h3>
            </div>

            <div className={`mt-8 grid gap-4 md:mt-12 md:grid-cols-12 md:gap-8`}>
              <p data-copy className={`text-[clamp(20px,1.8vw,26px)] leading-[1.35] font-bold tracking-[-0.03em] md:col-span-4 ${i % 2 ? "md:col-start-3" : "md:col-start-6"}`}>
                {c.ko}
              </p>
              <p data-copy className={`max-w-[40ch] text-[16px] leading-[1.85] text-ash md:col-span-4 ${i % 2 ? "md:col-start-7" : "md:col-start-10 md:col-span-3"}`}>
                {c.body}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
