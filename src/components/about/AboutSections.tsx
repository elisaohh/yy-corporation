"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type CSSProperties } from "react";
import { isStill } from "@/lib/still";
import { aboutVisuals, business, story, vision, type AboutVisual } from "@/data/about";

gsap.registerPlugin(ScrollTrigger);

/**
 * ABOUT (2026-10-15 전면 리디자인 — Chapter Transition + Visual Storytelling)
 *   제목 영역 — 공용 PageIntro(미스트 a안)를 about/page.tsx에서 그대로 사용.
 *   01 Story    — 흰 바탕, 35/65 에디토리얼. 왼쪽 제목은 섹션 안에서만 sticky. 강조 문장 + 이미지 2장.
 *   02 Vision   — 딥 차콜, 이미지 없음. 큰 문장 세 줄이 차례로 올라오고 마지막 줄에 포인트 밑줄(화면 고정 없음).
 *   03 Business — 라이트 그레이, 사업 4개를 이미지 · 텍스트 교차 블록으로.
 * 모션: 데스크톱은 이미지 미세 확대 · 텍스트 이동 · 강조 띠/밑줄 그어짐, 모바일은 투명도만. 모션 줄이기에서는 모두 바로 보인다.
 * 이미지는 생성 이미지(실제 YY 제품 · 시설 사진 아님) — data/about.ts aboutVisuals.
 */

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

/**
 * 강조 표시 — 문구는 그대로 두고 지정한 구절만 감싼다.
 *   marker: 밝은 바탕 — 글자 아래쪽에 포인트 색(1225, 면 전용) 띠
 *   line:   차콜 바탕 — 포인트 색(4008, 선 전용) 밑줄
 *   bold:   모션 없이 굵기 · 진한 색만
 * marker · line은 스크롤 시 왼쪽에서 그어진다(모션 줄이기 · ?still에서는 처음부터 보임).
 */
type MarkKind = "marker" | "line" | "bold";
const markStyle: Record<Exclude<MarkKind, "bold">, CSSProperties> = {
  marker: {
    backgroundImage: "linear-gradient(var(--color-point-1225), var(--color-point-1225))",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "0 88%",
    backgroundSize: "100% 0.32em",
    boxDecorationBreak: "clone",
    WebkitBoxDecorationBreak: "clone",
  },
  line: {
    backgroundImage: "linear-gradient(var(--color-point-4008), var(--color-point-4008))",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "0 100%",
    backgroundSize: "100% 0.06em",
    paddingBottom: "0.04em",
    boxDecorationBreak: "clone",
    WebkitBoxDecorationBreak: "clone",
  },
};

function Mark({ text, marks, dark = false }: { text: string; marks: [string, MarkKind][]; dark?: boolean }) {
  const pattern = new RegExp(`(${marks.map(([p]) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`);
  return (
    <>
      {text.split(pattern).map((part, i) => {
        const kind = marks.find(([p]) => p === part)?.[1];
        if (!kind) return part;
        if (kind === "bold") return <strong key={i} className={`font-bold ${dark ? "text-on-dark" : "text-charcoal"}`}>{part}</strong>;
        return (
          <em key={i} data-mark={kind} className="not-italic" style={markStyle[kind]}>
            {part}
          </em>
        );
      })}
    </>
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
            <Mark text={story.title} marks={[["친환경 유리의 감성", "marker"]]} />
          </h2>
        </div>

        <div>
          <p data-rise className="max-w-[30ch] text-[clamp(22px,2.2vw,32px)] leading-[1.5] font-medium tracking-[-0.03em] text-charcoal/80">
            <Mark text={highlight} marks={[["맑고 투명한 감성", "bold"], ["변치 않는 보존성", "bold"]]} />
          </p>
          <div data-fade className="mt-10 grid max-w-[64ch] gap-5 md:mt-12 md:grid-cols-2 md:gap-10">
            <p className="text-[16px] leading-[1.85] text-charcoal/75">
              <Mark text={first} marks={[["‘지속 가능한 아름다움’", "bold"]]} />
            </p>
            <p className="text-[16px] leading-[1.85] text-charcoal/75">
              <Mark text={last} marks={[["선한 영향력", "bold"]]} />
            </p>
          </div>

          {/* 큰 이미지 + 보조 이미지(구도 · 크기 다르게) — 본문 폭보다 작게 */}
          <div className="mt-14 grid max-w-[640px] grid-cols-12 items-end gap-4 md:mt-20 md:gap-5">
            <Visual v={aboutVisuals.storyMain} className="col-span-12 aspect-[3/2] md:col-span-8" sizes="(min-width: 768px) 420px, 100vw" />
            <Visual v={aboutVisuals.storySub} className="col-span-6 col-start-7 aspect-[4/5] md:col-span-4 md:col-start-auto" sizes="(min-width: 768px) 210px, 50vw" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 02 Vision ── */
function Vision() {
  const lines = vision.statementLines;
  return (
    <section id="vision" data-header-theme="dark" data-surface="dark" aria-labelledby="vision-title" className="bg-intro py-28 text-on-dark md:py-40">
      <div className="container-yy">
        <ChapterLabel no="02" name="Our Vision" dark />
        {/* 줄마다 아래에서 올라오고, 마지막 줄 밑줄이 그어진다. 흐린 상태로 기다리지 않는다. */}
        <h2 id="vision-title" className="mt-10 text-[clamp(34px,5.4vw,88px)] leading-[1.18] font-bold tracking-[-0.045em] md:mt-14">
          {lines.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.12em]">
              <span data-vision-line className="block">
                {i === lines.length - 1 ? <Mark text={line} marks={[[line, "line"]]} /> : line}
              </span>
            </span>
          ))}
        </h2>

        <div className="mt-20 grid gap-14 md:mt-28 md:grid-cols-2 md:gap-10 lg:gap-16">
          {vision.pillars.map((p) => {
            const sentences = p.body.split(/(?<=\.)\s+/);
            return (
              <article key={p.en} data-pillar className="relative pt-8">
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-white/25" />
                <span aria-hidden="true" data-pillar-line className="absolute left-0 top-0 h-[2px] w-16 origin-left bg-point-4008" />
                <h3 className="font-en text-[clamp(22px,2vw,30px)] leading-[1.2] font-semibold tracking-[-0.025em]">{p.en}</h3>
                <p className="mt-2 text-[17px] font-semibold text-on-dark">{p.ko}</p>
                <div className="mt-6 grid gap-3">
                  {sentences.map((s, i) => (
                    <p key={i} className="max-w-[40ch] text-[16px] leading-[1.8] text-on-dark/90">
                      {s}
                    </p>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        <p data-fade className="mt-20 max-w-[44ch] border-l-2 border-point-4008 pl-6 text-[clamp(18px,1.6vw,23px)] leading-[1.75] text-on-dark/80 md:mt-28">
          <Mark text={vision.quote} marks={[["친환경 유리의 아름다운 감성", "bold"], ["무결점 턴키 프로세스", "bold"]]} dark />
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
              <Mark text={business.title.join(" ")} marks={[["프리미엄 패키징", "marker"]]} />
            </h2>
            <p data-fade className="mt-6 max-w-[46ch] text-[16px] leading-[1.85] text-charcoal/75">
              <Mark text={business.lead} marks={[["브랜드의 가치를 극대화", "bold"]]} />
            </p>
          </div>
        </div>

        <div className="mt-20 grid gap-20 md:mt-28 md:gap-28">
          {business.items.map((item, i) => {
            const v = aboutVisuals.business[item.no];
            const flip = i % 2 === 1;
            return (
              <article key={item.no} data-block className="grid items-center gap-8 md:grid-cols-12 md:gap-8">
                <Visual
                  v={v}
                  className={`aspect-[3/2] w-[88%] md:row-start-1 md:w-auto md:col-span-6 lg:col-span-5 ${flip ? "ml-auto md:ml-0 md:col-start-7 lg:col-start-8" : "md:col-start-1"}`}
                  sizes="(min-width: 1200px) 500px, (min-width: 768px) 46vw, 88vw"
                />
                <div data-block-text className={`md:row-start-1 md:col-span-5 ${flip ? "md:col-start-1 lg:col-start-2" : "md:col-start-8"}`}>
                  <p className="flex items-center gap-3 font-en text-[13px] tabular-nums text-ash">
                    <span aria-hidden="true" className="h-[2px] w-6 bg-point-4008" />
                    {item.no}
                  </p>
                  <h3 className="mt-4 font-en text-[clamp(28px,2.8vw,44px)] leading-[1.05] font-bold tracking-[-0.04em]">{item.en}</h3>
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

        // 02 Vision — 세 줄이 차례로 올라온 뒤 마지막 줄 밑줄이 그어짐(한 번 재생, 다 보인 상태로 끝남)
        const visionLines = q("[data-vision-line]");
        if (visionLines.length) {
          const tl = gsap.timeline({ scrollTrigger: { trigger: visionLines[0], start: "top 80%" } });
          tl.from(visionLines, desktop ? { yPercent: 110, duration: 1.1, stagger: 0.16, ease: "power3.out" } : { autoAlpha: 0, duration: 0.8, stagger: 0.12 });
          const lastMark = visionLines[visionLines.length - 1].querySelector("[data-mark]");
          if (lastMark) tl.from(lastMark, { backgroundSize: "0% 0.06em", duration: 0.9, ease: "power2.inOut" }, "-=0.3");
        }
        q("[data-pillar]").forEach((p) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: p, start: "top 85%" } });
          tl.from(p.querySelector("[data-pillar-line]"), { scaleX: 0, duration: 0.7, ease: "power2.out" }).from(p.querySelectorAll(":scope > :not([aria-hidden])"), { autoAlpha: 0, y: desktop ? 20 : 0, duration: 0.7, stagger: 0.08, ease: "power2.out" }, 0.1);
        });

        // 밝은 바탕 강조 띠 — 제목이 들어온 뒤 왼쪽에서 칠해짐
        q("[data-mark='marker']").forEach((m) => {
          gsap.from(m, { backgroundSize: "0% 0.32em", duration: 0.9, delay: 0.4, ease: "power2.inOut", scrollTrigger: { trigger: m, start: "top 85%" } });
        });
      },
    );
    return () => mm.revert();
  }, []);

  return (
    <div ref={ref}>

      <Story />
      <Vision />
      <Business />
    </div>
  );
}
