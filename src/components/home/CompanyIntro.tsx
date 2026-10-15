"use client";

import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { companyIntro, services } from "@/data/home";

gsap.registerPlugin(ScrollTrigger);

/**
 * ② 짧은 회사 소개 + FIND · DRESS · MATCH · DELIVER (2026-10-15 A안 확정, 배경 미스트)
 * 4열 큰 단어 — 스크롤을 따라 노란 선이 그어지고 단어가 하나씩 아래에서 올라온다.
 * 아래 공정 모션과의 간격을 줄이려고 아래 여백을 위보다 작게 둔다.
 */
export function CompanyIntro() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cols = gsap.utils.toArray<HTMLElement>("[data-col]", section);
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section.querySelector("[data-cols]"), start: "top 85%", end: "bottom 85%", scrub: 0.8 },
      });
      cols.forEach((col, i) => {
        tl.fromTo(col.querySelector("[data-line]"), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "none" }, i * 0.45)
          .fromTo(col.querySelector("[data-word]"), { yPercent: 105 }, { yPercent: 0, duration: 1, ease: "power2.out" }, i * 0.45)
          .fromTo(col.querySelectorAll("[data-sub]"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.8 }, i * 0.45 + 0.4);
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} data-header-theme="light" aria-labelledby="company-intro-title" className="bg-mist pb-20 pt-28 md:pb-28 md:pt-40">
      <div className="container-yy">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-8">
          <Reveal className="lg:col-span-6">
            <h2 id="company-intro-title" className="text-[clamp(32px,3.8vw,56px)] leading-[1.22] font-bold tracking-[-0.035em]">
              {companyIntro.title}
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-5 lg:col-start-8">
            <p className="max-w-[38ch] text-[clamp(16px,1.3vw,18px)] leading-[1.75] text-ash">{companyIntro.body}</p>
            <Link href="/about" className="link-en mt-6">
              ABOUT →
            </Link>
          </Reveal>
        </div>

        <ol data-cols className="mt-20 grid gap-x-6 gap-y-14 sm:grid-cols-2 md:mt-28 lg:grid-cols-4">
          {services.map((s, i) => (
            <li key={s.key} data-col>
              <span data-line className="block h-[2px] origin-left bg-point-4008" />
              <p className="mt-6 font-en text-[12px] tabular-nums text-ash">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-3 overflow-hidden">
                <span data-word className="block font-en text-[clamp(44px,5.4vw,92px)] leading-[0.95] font-extrabold tracking-[-0.045em]">
                  {s.name}
                </span>
              </p>
              <p data-sub className="mt-5 text-[18px] font-semibold tracking-[-0.02em]">{s.line}</p>
              <p data-sub className="mt-1 text-[14px] text-ash">{s.scope}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
