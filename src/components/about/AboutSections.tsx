"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { isStill } from "@/lib/still";
import { aboutIntro, aboutVisuals, business, story, vision, type AboutVisual } from "@/data/about";

gsap.registerPlugin(ScrollTrigger);

/**
 * ABOUT (2026-10-15 전면 리디자인 — Chapter Transition + Visual Storytelling)
 *   00 Intro    — 미스트, 대형 슬로건. 스크롤하면 슬로건이 살짝 위로 밀리며 Story로 이어진다.
 *   01 Story    — 흰 바탕, 35/65 에디토리얼. 왼쪽 제목은 섹션 안에서만 sticky. 강조 문장 + 이미지 2장.
 *   02 Vision   — 딥 차콜, 이미지 없음. 대형 문장이 스크롤에 따라 단어마다 진해진다(화면 고정 없음).
 *   03 Business — 라이트 그레이, 사업 4개를 이미지 · 텍스트 교차 블록으로.
 * 모션: 데스크톱은 이미지 미세 확대 · 텍스트 이동, 모바일은 투명도만. 모션 줄이기에서는 모두 바로 보인다.
 * 이미지는 생성 이미지(실제 YY 제품 · 시설 사진 아님) — data/about.ts aboutVisuals.
 */

/* ── 00 Intro ── */
function Intro() {
  const lines = aboutIntro.slogan.split(", ");
  return (
    <section data-header-theme="light" aria-labelledby="about-title" className="bg-mist">
      <div className="container-yy flex min-h-[78svh] flex-col justify-end pb-16 pt-[calc(var(--header-h)+72px)] md:min-h-[86svh] md:pb-24">
        <div data-intro-drift>
          <p className="font-en text-[13px] tracking-[0.04em] text-ash">About</p>
          <h1 id="about-title" className="mt-6 text-[clamp(46px,8.4vw,148px)] leading-[1.04] font-bold tracking-[-0.05em] text-charcoal">
            {lines.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <span data-intro-line className="block">
                  {line}
                  {i < lines.length - 1 && ","}
                </span>
              </span>
            ))}
          </h1>
          <p data-intro-sub className="mt-8 max-w-[34ch] text-[clamp(17px,1.4vw,20px)] leading-[1.7] text-charcoal/75 md:mt-10">
            {aboutIntro.lead}
          </p>
        </div>
      </div>
    </section>
  );
}

function ChapterLabel({ no, name, dark = false }: { no: string; name: string; dark?: boolean }) {
  return (
    <p className={`flex items-baseline gap-3 font-en text-[13px] tracking-[0.02em] ${dark ? "text-on-dark-sub" : "text-ash"}`}>
      <span className="tabular-nums">{no}</span>
      <span aria-hidden="true">/</span>
      <span>{name}</span>
    </p>
  );
}

function Visual({ v, className = "", sizes }: { v: AboutVisual; className?: string; sizes: string }) {
  return (
    <div data-visual className={`relative overflow-hidden bg-card ${className}`}>
      <div data-visual-img className="absolute inset-0">
        <Image src={v.src} alt={v.alt} fill sizes={sizes} className="object-cover" style={{ objectPosition: v.position }} />
      </div>
    </div>
  );
}

/* ── 01 Story ── */
function Story() {
  const [first, highlight, last] = story.sentences;
  return (
    <section id="story" data-header-theme="light" aria-labelledby="story-title" className="bg-paper py-24 md:py-36">
      <div className="container-yy grid gap-12 lg:grid-cols-[35fr_65fr] lg:gap-16">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+40px)] lg:self-start">
          <ChapterLabel no="01" name="Our Story" />
          <h2 id="story-title" data-rise className="mt-6 max-w-[14ch] text-[clamp(30px,3.2vw,50px)] leading-[1.25] font-bold tracking-[-0.04em]">
            {story.title}
          </h2>
        </div>

        <div>
          <p data-rise className="max-w-[30ch] text-[clamp(22px,2.2vw,32px)] leading-[1.5] font-medium tracking-[-0.03em] text-charcoal">
            {highlight}
          </p>
          <div data-fade className="mt-10 grid max-w-[64ch] gap-5 md:mt-12 md:grid-cols-2 md:gap-10">
            <p className="text-[16px] leading-[1.85] text-charcoal/75">{first}</p>
            <p className="text-[16px] leading-[1.85] text-charcoal/75">{last}</p>
          </div>

          {/* 큰 이미지 + 보조 이미지(구도 · 크기 다르게) */}
          <div className="mt-14 grid grid-cols-12 items-end gap-4 md:mt-20 md:gap-6">
            <Visual v={aboutVisuals.storyMain} className="col-span-12 aspect-[3/2] md:col-span-8" sizes="(min-width: 1200px) 560px, (min-width: 768px) 60vw, 100vw" />
            <Visual v={aboutVisuals.storySub} className="col-span-7 col-start-6 aspect-[4/5] md:col-span-4 md:col-start-auto" sizes="(min-width: 1200px) 280px, (min-width: 768px) 30vw, 60vw" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 02 Vision ── */
function Vision() {
  const words = vision.statement.split(" ");
  return (
    <section id="vision" data-header-theme="dark" data-surface="dark" aria-labelledby="vision-title" className="bg-intro py-28 text-on-dark md:py-40">
      <div className="container-yy">
        <ChapterLabel no="02" name="Our Vision" dark />
        <h2 id="vision-title" data-words className="mt-10 max-w-[17ch] text-[clamp(34px,5.4vw,88px)] leading-[1.15] font-bold tracking-[-0.045em] md:mt-14">
          {words.map((w, i) => (
            <span key={i} data-word className="inline-block">
              {w}
              {i < words.length - 1 && " "}
            </span>
          ))}
        </h2>

        <div className="mt-20 grid gap-14 md:mt-28 md:grid-cols-2 md:gap-10 lg:gap-16">
          {vision.pillars.map((p) => {
            const sentences = p.body.split(/(?<=\.)\s+/);
            return (
              <article key={p.en} data-fade className="border-t border-white/25 pt-8">
                <h3 className="font-en text-[clamp(22px,2vw,30px)] leading-[1.2] font-semibold tracking-[-0.025em]">{p.en}</h3>
                <p className="mt-2 text-[16px] font-semibold text-on-dark-sub">{p.ko}</p>
                <div className="mt-6 grid gap-3">
                  {sentences.map((s, i) => (
                    <p key={i} className="max-w-[40ch] text-[16px] leading-[1.8] text-on-dark/80">
                      {s}
                    </p>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        <p data-fade className="mt-20 max-w-[44ch] border-l border-white/30 pl-6 text-[clamp(17px,1.4vw,20px)] leading-[1.8] text-on-dark/90 md:mt-28">
          {vision.quote}
        </p>
      </div>
    </section>
  );
}

/* ── 03 Business ── */
function Business() {
  return (
    <section id="business" data-header-theme="light" aria-labelledby="business-title" className="bg-card py-24 md:py-36">
      <div className="container-yy">
        <div className="grid gap-8 lg:grid-cols-[35fr_65fr] lg:gap-16">
          <ChapterLabel no="03" name="Our Business" />
          <div>
            <h2 id="business-title" data-rise className="max-w-[16ch] text-[clamp(30px,3.2vw,50px)] leading-[1.25] font-bold tracking-[-0.04em]">
              {business.title.join(" ")}
            </h2>
            <p data-fade className="mt-6 max-w-[46ch] text-[16px] leading-[1.85] text-charcoal/75">
              {business.lead}
            </p>
          </div>
        </div>

        <div className="mt-20 grid gap-24 md:mt-28 md:gap-36">
          {business.items.map((item, i) => {
            const v = aboutVisuals.business[item.no];
            const flip = i % 2 === 1;
            return (
              <article key={item.no} data-block className="grid items-center gap-8 md:grid-cols-12 md:gap-8">
                <Visual
                  v={v}
                  className={`aspect-[3/2] md:col-span-7 ${flip ? "md:order-2 md:col-start-6" : ""}`}
                  sizes="(min-width: 1200px) 760px, (min-width: 768px) 58vw, 100vw"
                />
                <div data-block-text className={`md:col-span-4 ${flip ? "md:order-1 md:col-start-1" : "md:col-start-9"}`}>
                  <p className="font-en text-[13px] tabular-nums text-ash">{item.no}</p>
                  <h3 className="mt-4 font-en text-[clamp(28px,3vw,48px)] leading-[1.05] font-semibold tracking-[-0.04em]">{item.en}</h3>
                  <p className="mt-3 text-[clamp(18px,1.5vw,22px)] font-bold tracking-[-0.02em]">{item.ko}</p>
                  <p className="mt-5 max-w-[36ch] text-[16px] leading-[1.85] text-charcoal/75">{item.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function AboutSections() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add(
      { motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)" },
      (ctx) => {
        if (!ctx.conditions?.motion || isStill()) return;
        const desktop = Boolean(ctx.conditions?.desktop);
        const q = gsap.utils.selector(el);

        // 00 Intro — 슬로건 두 줄이 차오르고 보조 문장이 이어서 나타남, 스크롤하면 살짝 위로
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(q("[data-intro-line]"), { yPercent: 105, duration: 1.1, stagger: 0.12 })
          .from(q("[data-intro-sub]"), { autoAlpha: 0, duration: 0.8 }, "-=0.5");
        if (desktop) {
          gsap.to(q("[data-intro-drift]"), { y: -60, ease: "none", scrollTrigger: { trigger: q("[data-intro-drift]")[0], start: "top 40%", end: "bottom top", scrub: 0.5 } });
        }

        // 제목 · 강조 문장 — 데스크톱은 짧게 올라오며, 모바일은 투명도만
        q("[data-rise]").forEach((t) => {
          gsap.from(t, { autoAlpha: 0, y: desktop ? 28 : 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: t, start: "top 85%" } });
        });
        q("[data-fade]").forEach((t) => {
          gsap.from(t, { autoAlpha: 0, duration: 0.8, ease: "power1.out", scrollTrigger: { trigger: t, start: "top 88%" } });
        });

        // 이미지 — 걷히듯 나타나고 아주 작게 확대된 상태에서 원래 크기로
        q("[data-visual]").forEach((v) => {
          const img = v.querySelector("[data-visual-img]");
          const tl = gsap.timeline({ scrollTrigger: { trigger: v, start: "top 85%" } });
          tl.from(v, { autoAlpha: 0, duration: 0.9, ease: "power1.out" });
          if (desktop) tl.from(img, { scale: 1.08, duration: 1.6, ease: "power3.out" }, 0);
        });

        // Business 텍스트 — 이미지 뒤를 따라 짧게 이동
        q("[data-block-text]").forEach((t) => {
          gsap.from(t, { autoAlpha: 0, y: desktop ? 32 : 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: t, start: "top 85%" } });
        });

        // 02 Vision — 단어마다 진해짐(고정 없이, 문장이 화면 아래쪽 → 가운데 오는 동안)
        q("[data-words]").forEach((h) => {
          gsap.fromTo(h.querySelectorAll("[data-word]"), { opacity: 0.16 }, { opacity: 1, stagger: 0.5, ease: "none", scrollTrigger: { trigger: h, start: "top 82%", end: "bottom 48%", scrub: 0.4 } });
        });
      },
    );
    return () => mm.revert();
  }, []);

  return (
    <div ref={ref}>
      <Intro />
      <Story />
      <Vision />
      <Business />
    </div>
  );
}
