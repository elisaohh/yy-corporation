"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { business, story, vision } from "@/data/about";

gsap.registerPlugin(ScrollTrigger);

/**
 * ABOUT 본문 — Story · Vision · Business (B안 "챕터 전환", 2026-10-15 한 화면 구성)
 * 데스크톱에서는 파트마다 한 화면 안에 담는다.
 *   01 Story    — 한 화면, 고정 없음. 왼쪽 챕터명 + 제목, 오른쪽 문장.
 *   02 Vision   — 차콜 면, 한 화면 고정(약 1.2화면 스크롤): 큰 문장이 단어마다 진해진 뒤 → 두 축과 문장이 이어서 나타난다.
 *   03 Business — 한 화면 고정(약 2화면 스크롤): 왼쪽 목록이 01 → 04로 넘어가며 오른쪽 설명이 바뀐다(단계마다 멈춤). 목록을 눌러도 이동.
 * 챕터명은 화면에 들어올 때 옆에서 밀려 들어오며 진해진다. 모바일 · 모션 줄이기: 고정 없이 차례로.
 * 배경 사진 · 영상 없음, 모두 왼쪽 정렬.
 */

function Chapter({ no, name, dark = false }: { no: string; name: string; dark?: boolean }) {
  return (
    <p className="flex items-baseline gap-5">
      <span className={`font-en text-[13px] tabular-nums ${dark ? "text-on-dark-sub" : "text-ash"}`}>{no}</span>
      <span data-chapter className="block font-en text-[clamp(56px,8.4vw,140px)] leading-[0.9] font-medium tracking-[-0.055em]">
        {name}
      </span>
    </p>
  );
}

/* ── 01 Story ── */
function StoryPart() {
  return (
    <section id="story" data-header-theme="light" aria-labelledby="story-title" className="overflow-hidden bg-paper">
      <div className="container-yy flex flex-col gap-14 py-20 md:py-24 lg:h-[100svh] lg:min-h-[640px] lg:justify-center lg:gap-16 lg:py-[calc(var(--header-h)+24px)]">
        <Chapter no="01" name="Story" />
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <h2 id="story-title" className="max-w-[18ch] text-[clamp(28px,3vw,48px)] leading-[1.28] font-bold tracking-[-0.04em] lg:col-span-5">
            {story.title}
          </h2>
          <div className="grid gap-6 lg:col-span-6 lg:col-start-7">
            <p className="text-[clamp(17px,1.4vw,20px)] leading-[1.75] font-medium tracking-[-0.02em]">{story.sentences[0]}</p>
            {story.sentences.slice(1).map((s, i) => (
              <p key={i} className="text-[15px] leading-[1.85] text-ash">
                {s}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 02 Vision (차콜) ── */
function VisionPart() {
  const words = vision.statement.split(" ");
  return (
    // 고정(pin) 시 GSAP이 section을 감싸므로 React가 지우는 최상위 노드는 바깥 div
    <div>
      <section id="vision" data-vision data-header-theme="dark" data-surface="dark" aria-labelledby="vision-title" className="overflow-hidden bg-intro text-on-dark">
        <div className="container-yy flex flex-col gap-12 py-20 md:py-24 lg:h-[100svh] lg:min-h-[640px] lg:justify-center lg:gap-14 lg:py-[calc(var(--header-h)+24px)]">
          <Chapter no="02" name="Vision" dark />
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <h2 id="vision-title" className="max-w-[20ch] text-[clamp(28px,3.4vw,54px)] leading-[1.22] font-bold tracking-[-0.04em] lg:col-span-7">
              {words.map((w, i) => (
                <span key={i} data-word className="inline-block">
                  {w}
                  {i < words.length - 1 && " "}
                </span>
              ))}
            </h2>
            <div data-vision-rest className="grid gap-8 lg:col-span-5 lg:col-start-8">
              {vision.pillars.map((p) => (
                <div key={p.en} className="border-t border-white/20 pt-5">
                  <p className="font-en text-[15px] font-semibold tracking-[-0.01em]">{p.en}</p>
                  <p className="mt-1 text-[14px] text-on-dark-sub">{p.ko}</p>
                  <p className="mt-3 text-[14px] leading-[1.75] text-on-dark/80">{p.body}</p>
                </div>
              ))}
              <p className="text-[15px] leading-[1.75] text-on-dark/90">{vision.quote}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── 03 Business ── */
function BusinessPart({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  const items = business.items;
  return (
    <div>
      <section id="business" data-business data-header-theme="light" aria-labelledby="business-title" className="overflow-hidden bg-paper">
        <div className="container-yy flex flex-col gap-12 py-20 md:py-24 lg:h-[100svh] lg:min-h-[640px] lg:justify-center lg:gap-14 lg:py-[calc(var(--header-h)+24px)]">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-6">
              <Chapter no="03" name="Business" />
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <h2 id="business-title" className="text-[clamp(22px,1.9vw,30px)] leading-[1.35] font-bold tracking-[-0.03em]">
                {business.title.join(" ")}
              </h2>
              <p className="mt-3 text-[15px] leading-[1.75] text-ash">{business.lead}</p>
            </div>
          </div>

          {/* 데스크톱: 목록 + 설명 (한 화면) */}
          <div className="hidden gap-8 border-t border-charcoal/15 pt-8 lg:grid lg:grid-cols-12">
            <ol className="grid gap-1 lg:col-span-6" role="tablist" aria-label="사업 영역">
              {items.map((item, i) => (
                <li key={item.no}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={active === i}
                    onClick={() => onPick(i)}
                    className="flex w-full items-baseline gap-5 py-1 text-left"
                  >
                    <span className={`font-en text-[12px] tabular-nums transition-colors duration-500 ${active === i ? "text-charcoal" : "text-charcoal/30"}`}>{item.no}</span>
                    <span
                      className={`font-en text-[clamp(26px,2.6vw,42px)] leading-[1.15] font-semibold tracking-[-0.035em] transition-colors duration-500 ${
                        active === i ? "text-charcoal" : "text-charcoal/25 hover:text-charcoal/50"
                      }`}
                    >
                      {item.en}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="relative min-h-[200px] lg:col-span-5 lg:col-start-8" role="tabpanel" aria-live="polite">
              {items.map((item, i) => (
                <div
                  key={item.no}
                  aria-hidden={active !== i}
                  className="absolute inset-0 transition-[opacity,transform] duration-500 ease-[var(--ease-yy-out)]"
                  style={{ opacity: active === i ? 1 : 0, transform: active === i ? "translateY(0)" : "translateY(10px)" }}
                >
                  <p className="font-en text-[13px] tabular-nums text-ash">{item.no} / 04</p>
                  <p className="mt-4 text-[clamp(22px,1.9vw,30px)] font-bold tracking-[-0.03em]">{item.ko}</p>
                  <p className="mt-4 max-w-[42ch] text-[16px] leading-[1.8] text-ash">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 모바일 · 태블릿: 목록 */}
          <ol className="border-b border-charcoal/15 lg:hidden">
            {items.map((item) => (
              <li key={item.no} className="grid gap-2 border-t border-charcoal/15 py-6">
                <p className="flex items-baseline gap-3">
                  <span className="font-en text-[12px] tabular-nums text-ash">{item.no}</span>
                  <span className="font-en text-[22px] font-semibold tracking-[-0.03em]">{item.en}</span>
                </p>
                <p className="text-[16px] font-semibold">{item.ko}</p>
                <p className="text-[15px] leading-[1.8] text-ash">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}

export function AboutParts() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const businessST = useRef<ScrollTrigger | null>(null);
  const count = business.items.length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    // 챕터명 — 화면에 들어올 때 옆에서 밀려 들어오며 진해짐(모든 화면)
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      el.querySelectorAll<HTMLElement>("[data-chapter]").forEach((c) => {
        gsap.fromTo(c, { xPercent: 10, opacity: 0.12 }, { xPercent: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: c, start: "top bottom", end: "top 55%", scrub: 0.5 } });
      });
    });

    // 데스크톱: Vision · Business 한 화면 고정
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const visionEl = el.querySelector<HTMLElement>("[data-vision]");
      if (visionEl) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: visionEl, start: "top top", end: () => `+=${window.innerHeight * 1.2}`, pin: true, scrub: 0.5, anticipatePin: 1 },
        });
        tl.fromTo(visionEl.querySelectorAll("[data-word]"), { opacity: 0.16 }, { opacity: 1, stagger: 0.12, duration: 0.4, ease: "none" })
          .fromTo(visionEl.querySelector("[data-vision-rest]"), { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }, "+=0.1")
          .to({}, { duration: 0.3 });
      }

      const biz = el.querySelector<HTMLElement>("[data-business]");
      if (biz) {
        businessST.current = ScrollTrigger.create({
          trigger: biz,
          start: "top top",
          end: () => `+=${window.innerHeight * 2}`,
          pin: true,
          anticipatePin: 1,
          snap: { snapTo: 1 / (count - 1), duration: { min: 0.25, max: 0.6 }, delay: 0.06, ease: "power2.inOut" },
          onUpdate: (self) => setActive(Math.min(count - 1, Math.round(self.progress * (count - 1)))),
        });
      }
      return () => {
        businessST.current = null;
      };
    });

    // 모바일 · 태블릿 Vision 단어 명암(고정 없음)
    mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
      const h = el.querySelector<HTMLElement>("#vision-title");
      if (h) gsap.fromTo(h.querySelectorAll("[data-word]"), { opacity: 0.16 }, { opacity: 1, stagger: 0.5, ease: "none", scrollTrigger: { trigger: h, start: "top 80%", end: "bottom 50%", scrub: 0.4 } });
    });

    return () => mm.revert();
  }, [count]);

  /** 목록 클릭 → 해당 단계 위치로 스크롤(고정 중), 고정이 없으면 바로 전환 */
  const pick = (i: number) => {
    const st = businessST.current;
    if (!st) {
      setActive(i);
      return;
    }
    window.scrollTo({ top: st.start + ((st.end - st.start) * i) / (count - 1), behavior: "smooth" });
  };

  return (
    <div ref={ref}>
      <StoryPart />
      <VisionPart />
      <BusinessPart active={active} onPick={pick} />
    </div>
  );
}
