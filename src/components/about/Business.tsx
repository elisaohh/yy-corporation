"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { business } from "@/data/about";

gsap.registerPlugin(ScrollTrigger);

/**
 * ABOUT · OUR BUSINESS — 왼쪽 라벨 / 오른쪽 큰 제목(단어마다 스크롤 따라 진해짐) + 설명,
 * 아래 사업 영역 4줄(01–04): 줄마다 선이 그어지며 등장, 마우스를 올리면 바탕이 옅게 깔리고 영문이 살짝 밀린다.
 */
export function Business() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        section.querySelectorAll("[data-word]"),
        { opacity: 0.14 },
        { opacity: 1, stagger: 0.5, ease: "none", scrollTrigger: { trigger: section.querySelector("[data-title]"), start: "top 80%", end: "bottom 45%", scrub: 0.5 } },
      );
      gsap.utils.toArray<HTMLElement>("[data-row]", section).forEach((row) => {
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: "top 85%", toggleActions: "play none none reverse" } })
          .fromTo(row.querySelector("[data-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "power3.inOut" })
          .fromTo(row.querySelectorAll("[data-cell]"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power2.out" }, "-=0.55");
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} data-header-theme="light" aria-labelledby="business-title" className="bg-paper py-24 md:py-36">
      <div className="container-yy">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
          <p className="label-en flex items-center gap-3 self-start text-ash lg:col-span-3 lg:pt-4">
            <span className="size-1.5 rounded-full bg-point-4008" aria-hidden="true" />
            {business.label}
          </p>
          <div className="lg:col-span-9">
            <h2 id="business-title" data-title className="max-w-[18ch] text-[clamp(32px,4.4vw,68px)] leading-[1.22] font-bold tracking-[-0.04em] text-charcoal">
              {business.title.map((w, i) => (
                <span key={i} data-word className="inline-block">
                  {w}
                  {i < business.title.length - 1 && "\u00a0"}
                </span>
              ))}
            </h2>
            <p className="mt-8 max-w-[46ch] text-[clamp(16px,1.3vw,18px)] leading-[1.8] text-ash md:mt-10">{business.lead}</p>
          </div>
        </div>

        <ol className="mt-20 md:mt-28">
          {business.items.map((item) => (
            <li key={item.no} data-row className="group relative">
              <span data-rule aria-hidden="true" className="block h-px origin-left bg-charcoal/80" />
              <div className="relative grid gap-3 py-8 transition-colors duration-500 group-hover:bg-mist md:grid-cols-12 md:items-baseline md:gap-8 md:px-4 md:py-12">
                <p data-cell className="font-en text-[13px] tabular-nums tracking-[0.14em] text-ash md:col-span-1">
                  {item.no}
                </p>
                <p
                  data-cell
                  className="font-en text-[clamp(28px,3.2vw,50px)] leading-[1] font-extrabold tracking-[-0.04em] text-charcoal transition-transform duration-500 ease-[var(--ease-yy-out)] group-hover:translate-x-2 md:col-span-5"
                >
                  {item.en}
                </p>
                <p data-cell className="text-[18px] font-bold tracking-[-0.02em] md:col-span-2">
                  {item.ko}
                </p>
                <p data-cell className="max-w-[44ch] text-[15px] leading-[1.8] text-ash md:col-span-4">
                  {item.body}
                </p>
              </div>
            </li>
          ))}
          <li aria-hidden="true" className="h-px bg-charcoal/80" />
        </ol>
      </div>
    </section>
  );
}
