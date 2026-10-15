"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { business, story, vision } from "@/data/about";

gsap.registerPlugin(ScrollTrigger);

/**
 * ABOUT 본문 — Story · Vision · Business 세 파트 (2026-10-15 시안 3종, 비교 중: /about?v=a|b|c)
 * 공통: 배경 사진 · 영상 없음, 가운데 정렬 없음(모두 왼쪽 정렬), 흰색 · 차콜 + 노랑은 쓰지 않음.
 * 모션은 레퍼런스(Bryhel 정돈된 등장, Momix 장면 리듬)를 참고해 파트마다 한 가지만.
 *   a 에디토리얼 2단 — 왼쪽 파트 번호 · 이름, 오른쪽 내용. 파트 시작선이 그어지고 제목이 아래에서 차오른다.
 *   b 챕터 전환     — 파트마다 큰 영문 챕터명이 스크롤에 따라 옆에서 밀려 들어오며 진해진다. Vision은 차콜 면.
 *   c 고정 목차     — 왼쪽 목차(01 Story / 02 Vision / 03 Business)가 고정되고 현재 파트가 표시된다.
 */
export type AboutVariant = "a" | "b" | "c";

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

/* ── a: 에디토리얼 2단 ── */
function VariantA() {
  const ref = useRef<HTMLDivElement>(null);
  usePartMotion(ref);
  const bodies = [<StoryBody key="s" />, <VisionBody key="v" />, <BusinessBody key="b" />];
  return (
    <div ref={ref}>
      {PARTS.map((p, i) => (
        <section key={p.id} id={p.id} data-header-theme="light" aria-label={p.name} className="bg-paper pb-24 pt-10 md:pb-36 md:pt-14">
          <div className="container-yy">
            <span data-line aria-hidden="true" className="block h-px origin-left bg-charcoal" />
            <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:gap-8">
              <p className="flex items-baseline gap-4 self-start lg:sticky lg:top-[calc(var(--header-h)+32px)] lg:col-span-3">
                <span className="font-en text-[13px] tabular-nums text-ash">{p.no}</span>
                <span className="font-en text-[clamp(22px,1.8vw,28px)] font-medium tracking-[-0.02em]">{p.name}</span>
              </p>
              <div className="lg:col-span-9">{bodies[i]}</div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
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

/* ── c: 고정 목차 ── */
function VariantC() {
  const ref = useRef<HTMLDivElement>(null);
  usePartMotion(ref);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const triggers = PARTS.map((p, i) =>
      ScrollTrigger.create({ trigger: el.querySelector(`#${p.id}`), start: "top 50%", end: "bottom 50%", onToggle: (s) => s.isActive && setActive(i) }),
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div ref={ref} data-header-theme="light" className="bg-paper">
      <div className="container-yy grid gap-10 py-24 md:py-32 lg:grid-cols-12 lg:gap-8">
        {/* 목차 */}
        <nav aria-label="ABOUT 목차" className="hidden lg:col-span-3 lg:block">
          <ol className="sticky top-[calc(var(--header-h)+48px)] grid gap-4">
            {PARTS.map((p, i) => (
              <li key={p.id}>
                <button type="button" onClick={() => go(p.id)} className="group flex items-center gap-4 text-left">
                  <span
                    aria-hidden="true"
                    className="block h-px bg-charcoal transition-[width] duration-500 ease-[var(--ease-yy-out)]"
                    style={{ width: active === i ? 40 : 12 }}
                  />
                  <span className={`font-en text-[13px] tabular-nums transition-colors ${active === i ? "text-charcoal" : "text-charcoal/35"}`}>{p.no}</span>
                  <span className={`font-en text-[20px] font-medium tracking-[-0.02em] transition-colors ${active === i ? "text-charcoal" : "text-charcoal/35 group-hover:text-charcoal/70"}`}>
                    {p.name}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        {/* 파트 */}
        <div className="grid gap-32 md:gap-48 lg:col-span-9">
          {PARTS.map((p, i) => (
            <section key={p.id} id={p.id} aria-label={p.name} className="scroll-mt-[calc(var(--header-h)+48px)]">
              <p className="mb-10 flex items-baseline gap-4 lg:hidden">
                <span className="font-en text-[13px] tabular-nums text-ash">{p.no}</span>
                <span className="font-en text-[22px] font-medium">{p.name}</span>
              </p>
              {i === 0 ? <StoryBody /> : i === 1 ? <VisionBody /> : <BusinessBody />}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AboutParts({ variant = "a" }: { variant?: AboutVariant }) {
  if (variant === "b") return <VariantB />;
  if (variant === "c") return <VariantC />;
  return <VariantA />;
}
