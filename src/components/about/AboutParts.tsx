"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { business, story, vision } from "@/data/about";

gsap.registerPlugin(ScrollTrigger);

/**
 * ABOUT 본문 — Story · Vision · Business 세 파트 (2026-10-15 B안 "챕터 전환" 확정)
 * 파트마다 큰 영문 챕터명이 스크롤에 따라 옆에서 밀려 들어오며 진해지고, Vision은 차콜 면으로 전환.
 * 배경 사진 · 영상 없음, 모두 왼쪽 정렬.
 */
const PARTS = [
  { id: "story", no: "01", name: "Story" },
  { id: "vision", no: "02", name: "Vision" },
  { id: "business", no: "03", name: "Business" },
] as const;

/* ── 공통 내용 블록 ── */

function StoryBody() {
  return (
    <div>
      <h2 data-rise className="max-w-[20ch] text-[clamp(30px,3.6vw,56px)] leading-[1.25] font-bold tracking-[-0.04em]">
        {story.title}
      </h2>
      <p data-fade className="mt-12 max-w-[40ch] text-[clamp(18px,1.5vw,21px)] leading-[1.75] font-medium tracking-[-0.02em] md:mt-16">
        {story.sentences[0]}
      </p>
      <div data-fade className="mt-10 grid gap-8 md:grid-cols-2 md:gap-10">
        {story.sentences.slice(1).map((s, i) => (
          <p key={i} className="text-[16px] leading-[1.85] text-ash">
            {s}
          </p>
        ))}
      </div>
    </div>
  );
}

function VisionBody({ dark = false }: { dark?: boolean }) {
  const words = vision.statement.split(" ");
  return (
    <div>
      <h2 data-words className="max-w-[22ch] text-[clamp(30px,3.6vw,56px)] leading-[1.25] font-bold tracking-[-0.04em]">
        {words.map((w, i) => (
          <span key={i} data-word className="inline-block">
            {w}
            {i < words.length - 1 && " "}
          </span>
        ))}
      </h2>
      <div data-fade className="mt-14 grid gap-10 md:mt-20 md:grid-cols-2 md:gap-10">
        {vision.pillars.map((p) => (
          <div key={p.en} className={`border-t pt-6 ${dark ? "border-white/20" : "border-charcoal/20"}`}>
            <p className="font-en text-[15px] font-semibold tracking-[-0.01em]">{p.en}</p>
            <p className={`mt-1 text-[15px] ${dark ? "text-on-dark-sub" : "text-ash"}`}>{p.ko}</p>
            <p className={`mt-5 max-w-[44ch] text-[15px] leading-[1.8] ${dark ? "text-on-dark/80" : "text-charcoal/80"}`}>{p.body}</p>
          </div>
        ))}
      </div>
      <p data-fade className={`mt-14 max-w-[52ch] text-[clamp(16px,1.3vw,18px)] leading-[1.8] md:mt-20 ${dark ? "text-on-dark/90" : "text-charcoal"}`}>
        {vision.quote}
      </p>
    </div>
  );
}

function BusinessBody() {
  return (
    <div>
      <h2 data-rise className="max-w-[18ch] text-[clamp(30px,3.6vw,56px)] leading-[1.25] font-bold tracking-[-0.04em]">
        {business.title.join(" ")}
      </h2>
      <p data-fade className="mt-8 max-w-[46ch] text-[16px] leading-[1.8] text-ash md:mt-10">
        {business.lead}
      </p>
      <ol className="mt-14 border-b border-charcoal/15 md:mt-20">
        {business.items.map((item) => (
          <li key={item.no} data-row className="grid gap-2 border-t border-charcoal/15 py-7 md:grid-cols-12 md:items-baseline md:gap-6 md:py-9">
            <p className="font-en text-[12px] tabular-nums text-ash md:col-span-1">{item.no}</p>
            <p className="font-en text-[clamp(20px,1.9vw,28px)] leading-[1.1] font-semibold tracking-[-0.03em] md:col-span-4">{item.en}</p>
            <p className="text-[16px] font-semibold md:col-span-3">{item.ko}</p>
            <p className="text-[15px] leading-[1.8] text-ash md:col-span-4">{item.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** 파트 안의 공통 등장: 제목 차오름(data-rise) · 단어 진해짐(data-words) · 블록 옅게(data-fade) · 줄 등장(data-row) */
function usePartMotion(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      el.querySelectorAll<HTMLElement>("[data-rise]").forEach((h) => {
        gsap.fromTo(h, { yPercent: 18, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: h, start: "top 85%" } });
      });
      el.querySelectorAll<HTMLElement>("[data-words]").forEach((h) => {
        gsap.fromTo(h.querySelectorAll("[data-word]"), { opacity: 0.15 }, { opacity: 1, stagger: 0.5, ease: "none", scrollTrigger: { trigger: h, start: "top 80%", end: "bottom 45%", scrub: 0.5 } });
      });
      el.querySelectorAll<HTMLElement>("[data-fade]").forEach((b) => {
        gsap.fromTo(b, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, ease: "power1.out", scrollTrigger: { trigger: b, start: "top 88%" } });
      });
      el.querySelectorAll<HTMLElement>("[data-line]").forEach((l) => {
        gsap.fromTo(l, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power3.inOut", scrollTrigger: { trigger: l, start: "top 90%" } });
      });
      gsap.utils.toArray<HTMLElement>("[data-row]", el).forEach((r, i) => {
        gsap.fromTo(r, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, delay: (i % 4) * 0.08, ease: "power1.out", scrollTrigger: { trigger: r, start: "top 90%" } });
      });
    });
    return () => mm.revert();
  }, [root]);
}

/* ── b: 챕터 전환 ── */
function VariantB() {
  const ref = useRef<HTMLDivElement>(null);
  usePartMotion(ref);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      el.querySelectorAll<HTMLElement>("[data-chapter]").forEach((c) => {
        gsap.fromTo(
          c,
          { xPercent: 12, opacity: 0.12 },
          { xPercent: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: c, start: "top bottom", end: "top 40%", scrub: 0.6 } },
        );
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={ref}>
      {PARTS.map((p, i) => {
        const dark = p.id === "vision";
        return (
          <section
            key={p.id}
            id={p.id}
            data-header-theme={dark ? "dark" : "light"}
            data-surface={dark ? "dark" : undefined}
            aria-label={p.name}
            className={`overflow-hidden pb-24 pt-20 md:pb-36 md:pt-28 ${dark ? "bg-intro text-on-dark" : "bg-paper"}`}
          >
            <div className="container-yy">
              <p className="flex items-baseline gap-5">
                <span className={`font-en text-[13px] tabular-nums ${dark ? "text-on-dark-sub" : "text-ash"}`}>{p.no}</span>
                <span data-chapter className="block font-en text-[clamp(64px,11vw,190px)] leading-[0.9] font-medium tracking-[-0.055em]">
                  {p.name}
                </span>
              </p>
              <div className="mt-14 grid gap-10 md:mt-20 lg:grid-cols-12 lg:gap-8">
                <div className="lg:col-span-10 lg:col-start-3">{i === 0 ? <StoryBody /> : i === 1 ? <VisionBody dark /> : <BusinessBody />}</div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function AboutParts() {
  return <VariantB />;
}
