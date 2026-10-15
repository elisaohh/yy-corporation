"use client";

import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import type { IntroVariant } from "@/config/variants";
import { companyIntro, services } from "@/data/home";

gsap.registerPlugin(ScrollTrigger);

/**
 * ② 짧은 회사 소개 + FIND · DRESS · MATCH · DELIVER — 시안 3종(2026-10-15 비교 중, config/variants.ts)
 *   a: 차콜 배경 · 4열 큰 단어가 스크롤에 따라 차례로 올라옴
 *   b: 미스트 배경 · 데스크톱에서 화면을 고정하고 4개 패널이 가로로 흐름
 *   c: 스톤 배경 · 왼쪽 제목 고정 + 오른쪽 큰 세로 목록, 화면 가운데 항목 강조
 * 아래 공정 모션과의 간격을 줄이려고 아래 여백을 위보다 작게 둔다.
 */
export function CompanyIntro({ variant = "a" }: { variant?: IntroVariant }) {
  if (variant === "b") return <IntroPanels />;
  if (variant === "c") return <IntroList />;
  return <IntroColumns />;
}

function Heading({ dark = false }: { dark?: boolean }) {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-8">
      <Reveal className="lg:col-span-6">
        <h2 id="company-intro-title" className="text-[clamp(32px,3.8vw,56px)] leading-[1.22] font-bold tracking-[-0.035em]">
          {companyIntro.title}
        </h2>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-5 lg:col-start-8">
        <p className={`max-w-[38ch] text-[clamp(16px,1.3vw,18px)] leading-[1.75] ${dark ? "text-on-dark-sub" : "text-ash"}`}>{companyIntro.body}</p>
        <Link href="/about" className="link-en mt-6">
          ABOUT →
        </Link>
      </Reveal>
    </div>
  );
}

/* ── a: 차콜 · 4열 ── */
function IntroColumns() {
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
    <section ref={ref} data-header-theme="dark" data-surface="dark" aria-labelledby="company-intro-title" className="bg-intro pb-20 pt-28 text-on-dark md:pb-28 md:pt-40">
      <div className="container-yy">
        <Heading dark />
        <ol data-cols className="mt-20 grid gap-x-6 gap-y-14 sm:grid-cols-2 md:mt-28 lg:grid-cols-4">
          {services.map((s, i) => (
            <li key={s.key} data-col>
              <span data-line className="block h-[2px] origin-left bg-point-1225" />
              <p className="mt-6 font-en text-[12px] tabular-nums text-on-dark-sub">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-3 overflow-hidden">
                <span data-word className="block font-en text-[clamp(44px,5.4vw,92px)] leading-[0.95] font-extrabold tracking-[-0.045em]">
                  {s.name}
                </span>
              </p>
              <p data-sub className="mt-5 text-[18px] font-semibold tracking-[-0.02em]">{s.line}</p>
              <p data-sub className="mt-1 text-[14px] text-on-dark-sub">{s.scope}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── b: 미스트 · 가로 패널 ── */
function IntroPanels() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const track = section.querySelector<HTMLElement>("[data-track]");
      if (!track) return;
      const distance = () => track.scrollWidth - window.innerWidth;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true },
      });
      tl.to(track, { x: () => -distance(), ease: "none" });
      gsap.utils.toArray<HTMLElement>("[data-panel-word]", section).forEach((word) => {
        gsap.fromTo(
          word,
          { xPercent: 18, autoAlpha: 0.25 },
          { xPercent: 0, autoAlpha: 1, ease: "none", scrollTrigger: { trigger: word, containerAnimation: tl, start: "left 95%", end: "left 45%", scrub: true } },
        );
      });
    });
    return () => mm.revert();
  }, []);

  return (
    // 고정(pin) 시 GSAP이 section을 감싸므로, React가 지우는 최상위 노드는 바깥 div로 둔다
    <div>
    <section ref={ref} data-header-theme="light" aria-labelledby="company-intro-title" className="overflow-hidden bg-mist">
      <div className="pb-20 pt-28 md:pb-24 lg:flex lg:h-[100svh] lg:items-center lg:py-0">
        <div data-track className="flex flex-col gap-6 px-[var(--gutter)] lg:w-max lg:flex-row lg:items-stretch lg:gap-6">
          <div className="lg:flex lg:w-[min(560px,42vw)] lg:shrink-0 lg:flex-col lg:justify-center lg:pr-10">
            <h2 id="company-intro-title" className="text-[clamp(32px,3.8vw,56px)] leading-[1.22] font-bold tracking-[-0.035em]">
              {companyIntro.title}
            </h2>
            <p className="mt-8 max-w-[34ch] text-[clamp(16px,1.3vw,18px)] leading-[1.75] text-ash">{companyIntro.body}</p>
            <Link href="/about" className="link-en mt-6">
              ABOUT →
            </Link>
          </div>
          {services.map((s, i) => (
            <article key={s.key} className="flex flex-col justify-between bg-paper p-8 md:p-10 lg:h-[min(72svh,620px)] lg:w-[min(46vw,640px)] lg:shrink-0">
              <p className="font-en text-[12px] tabular-nums text-ash">{String(i + 1).padStart(2, "0")} / 04</p>
              <div className="mt-16 lg:mt-0">
                <p data-panel-word className="font-en text-[clamp(56px,8.4vw,150px)] leading-[0.9] font-extrabold tracking-[-0.05em]">
                  {s.name}
                </p>
                <p className="mt-6 text-[clamp(18px,1.6vw,22px)] font-semibold tracking-[-0.02em]">{s.line}</p>
                <p className="mt-1 text-[15px] text-ash">{s.scope}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
    </div>
  );
}

/* ── c: 스톤 · 큰 세로 목록 ── */
function IntroList() {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const triggers = Array.from(list.children).map((el, i) =>
      ScrollTrigger.create({ trigger: el, start: "top 58%", end: "bottom 58%", onToggle: (self) => self.isActive && setActive(i) }),
    );
    setActive(0);
    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <section data-header-theme="light" aria-labelledby="company-intro-title" className="bg-stone pb-20 pt-28 md:pb-24 md:pt-40">
      <div className="container-yy grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+48px)]">
            <h2 id="company-intro-title" className="text-[clamp(32px,3.4vw,52px)] leading-[1.22] font-bold tracking-[-0.035em]">
              {companyIntro.title}
            </h2>
            <p className="mt-8 max-w-[34ch] text-[clamp(16px,1.3vw,18px)] leading-[1.75] text-charcoal/70">{companyIntro.body}</p>
            <Link href="/about" className="link-en mt-6">
              ABOUT →
            </Link>
          </div>
        </div>
        <ol ref={listRef} className="lg:col-span-8">
          {services.map((s, i) => {
            const on = active === null || active === i;
            return (
              <li
                key={s.key}
                className="border-t border-charcoal/20 py-8 transition-[color,opacity] duration-500 md:py-12"
                style={{ color: on ? "var(--color-charcoal)" : "color-mix(in srgb, var(--color-charcoal) 28%, var(--color-stone))" }}
              >
                <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
                  <p className="font-en text-[clamp(56px,9vw,152px)] leading-[0.86] font-extrabold tracking-[-0.055em]">{s.name}</p>
                  <div className={`pb-2 transition-opacity duration-500 ${on ? "opacity-100" : "opacity-0"}`}>
                    <p className="text-[18px] font-semibold tracking-[-0.02em]">{s.line}</p>
                    <p className="mt-1 text-[14px] text-charcoal/65">{s.scope}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
