"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { AssetImage } from "@/components/media/AssetImage";
import { HEADER_THEME_EVENT } from "@/components/layout/headerEvents";
import type { AssetId } from "@/data/assets";
import { exampleNotice, finishingProcesses } from "@/data/process";

gsap.registerPlugin(ScrollTrigger);

/**
 * ① 시네마틱 인트로 + ② 화이트 전환 — 스크롤 연동(scrub) 고정 구간 (기획서 2.0 부록 B1).
 *
 * 장면: 어둠 속 빛이 기준병을 드러냄 → 코팅 · 인쇄 · 부식 · 라벨 효과 → 여러 병이 수평 정렬
 *      → 한 병으로 초점 → 카메라가 다가가며 빛이 화면을 채워 화이트로 연결.
 * 구현: 흰 바탕 사진을 multiply로 합성해, 가운데 빛(흰 타원) 안에서만 병이 보이게 한다.
 *       → 빛이 커지는 것이 곧 "빛이 병을 드러내는" 연출이 되고, 마지막에 빛이 화면을 채우면 화이트로 이어진다.
 *
 * 지금은 사진 기반 시퀀스(heroMode: "sequence")다. 스포이드 조립 장면은 3D 단계에서 추가한다.
 * 후가공 장면 이미지는 생성 예시 — 화면에 안내 문구를 표시한다.
 */

const SCENES: { id: AssetId; key: string }[] = [
  { id: "finishCoating", key: "coating" },
  { id: "finishPrinting", key: "printing" },
  { id: "finishEtching", key: "etching" },
  { id: "finishLabel", key: "labeling" },
];

/** 수평 정렬 순서: 기준병(투명)을 가운데 */
const ROW_ORDER = [-2, -1, 1, 2]; // SCENES 순서대로의 자리, 투명 병은 0

export function IntroSequence() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let lastTheme = "dark";
    const setTheme = (theme: "dark" | "light") => {
      if (theme === lastTheme) return;
      lastTheme = theme;
      section.dataset.headerTheme = theme;
      window.dispatchEvent(new Event(HEADER_THEME_EVENT));
    };

    const mm = gsap.matchMedia();
    mm.add(
      { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" },
      (context) => {
        const q = gsap.utils.selector(section);
        const clear = q("[data-bottle='clear']")[0];
        const finishes = q("[data-bottle='finish']");
        const texts = q("[data-scene-text]");
        const glow = q("[data-glow]")[0];
        const veil = q("[data-veil]")[0];
        const hint = q("[data-hint]")[0];
        const notice = q("[data-notice]")[0];

        // 공통 시작 상태 (빛과 모든 병은 화면 정중앙)
        gsap.set([clear, ...finishes], { x: 0, y: 0, xPercent: -50, yPercent: -50, left: "50%", top: "50%", transformOrigin: "50% 68%" });
        gsap.set(glow, { x: 0, y: 0, xPercent: -50, yPercent: -50, left: "50%", top: "50%" });

        if (context.conditions?.reduce) {
          gsap.set(glow, { scale: 1, opacity: 1 });
          gsap.set(clear, { opacity: 1 });
          gsap.set([...finishes, ...texts, notice, hint], { opacity: 0 });
          return;
        }

        gsap.set(glow, { scale: 0.18, opacity: 0 });
        gsap.set(clear, { opacity: 0, scale: 0.94 });
        gsap.set(finishes, { opacity: 0 });
        gsap.set(texts, { opacity: 0, y: 18 });
        gsap.set([veil, notice], { opacity: 0 });

        /** 정렬 간격: 화면 크기에 맞춰 다시 계산(invalidateOnRefresh) */
        const gap = () => Math.min(window.innerWidth * 0.17, window.innerHeight * 0.27);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${window.innerHeight * 5.5}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setTheme(self.progress > 0.9 ? "light" : "dark"),
          },
        });

        // 1) 빛이 병을 드러냄
        tl.to(hint, { opacity: 0, duration: 0.4 }, 0.1)
          .to(glow, { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" }, 0)
          .to(clear, { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" }, 0.1);

        // 2) 후가공 효과 4장면
        let at = 1.7;
        finishes.forEach((img, i) => {
          const prev = i === 0 ? clear : finishes[i - 1];
          tl.to(img, { opacity: 1, duration: 0.5 }, at)
            .to(prev, { opacity: 0, duration: 0.5 }, at)
            .to(texts[i], { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, at + 0.1);
          if (i < finishes.length - 1) tl.to(texts[i], { opacity: 0, y: -14, duration: 0.3 }, at + 1.0);
          at += 1.3;
        });
        tl.to(notice, { opacity: 1, duration: 0.4 }, 1.8);

        // 3) 여러 병이 수평으로 정렬
        const rowStart = at; // 6.9
        tl.to(texts[texts.length - 1], { opacity: 0, y: -14, duration: 0.3 }, rowStart - 0.3)
          .to(clear, { opacity: 1, scale: 0.62, x: 0, duration: 1 }, rowStart)
          .to(glow, { scaleX: 3.2, scaleY: 0.92, duration: 1 }, rowStart);
        finishes.forEach((img, i) => {
          tl.to(img, { opacity: 1, scale: 0.62, x: () => ROW_ORDER[i] * gap(), duration: 1, ease: "power2.inOut" }, rowStart);
        });

        // 4) 한 병으로 초점
        const focus = rowStart + 1.5;
        finishes.forEach((img, i) => {
          tl.to(img, { opacity: 0, x: () => ROW_ORDER[i] * gap() * 1.6, duration: 0.8, ease: "power2.in" }, focus);
        });
        tl.to(notice, { opacity: 0, duration: 0.4 }, focus)
          .to(clear, { scale: 1, duration: 0.8, ease: "power2.inOut" }, focus)
          .to(glow, { scaleX: 1, scaleY: 1, duration: 0.8, ease: "power2.inOut" }, focus);

        // 5) 카메라가 다가가며 반사광으로 화이트
        const close = focus + 1.0;
        tl.to(clear, { scale: 3.6, duration: 1.4, ease: "power2.in" }, close)
          .to(glow, { scale: 7, duration: 1.4, ease: "power2.in" }, close)
          .to(veil, { opacity: 1, duration: 0.6 }, close + 1.0)
          .to(clear, { opacity: 0, duration: 0.4 }, close + 1.2);
      },
      section,
    );

    return () => {
      mm.revert();
      section.dataset.headerTheme = "dark";
    };
  }, []);

  const scenes = SCENES.map((scene) => ({ ...scene, info: finishingProcesses.find((p) => p.key === scene.key)! }));

  return (
    <section
      ref={sectionRef}
      data-header-theme="dark"
      data-surface="dark"
      data-no-top
      aria-label="인트로 — 투명한 유리병에 후가공이 더해지는 장면"
      className="relative h-[100svh] min-h-[560px] overflow-hidden bg-intro text-on-dark"
    >
      {/* 빛 — 병은 이 빛 안에서만 보인다(multiply) */}
      <div
        data-glow
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[128svh] w-[78svh] rounded-[50%] bg-[radial-gradient(ellipse_at_center,#ffffff_0%,#ffffff_42%,rgba(255,255,255,0.55)_58%,rgba(255,255,255,0)_74%)]"
        style={{ opacity: 0 }}
      />

      {/* 병 — 같은 캔버스(900×1600)라 겹쳐 두고 투명도로 장면 전환 */}
      <AssetImage
        id="heroBottleClear"
        data-bottle="clear"
        priority
        className="pointer-events-none absolute h-[min(78svh,900px)] w-auto max-w-none select-none mix-blend-multiply"
        style={{ opacity: 0 }}
        decorative
      />
      {scenes.map((scene) => (
        <AssetImage
          key={scene.id}
          id={scene.id}
          data-bottle="finish"
          decorative
          className="pointer-events-none absolute h-[min(78svh,900px)] w-auto max-w-none select-none mix-blend-multiply"
          style={{ opacity: 0 }}
        />
      ))}

      {/* 장면 문구 */}
      <div className="pointer-events-none absolute bottom-[clamp(28px,7svh,72px)] left-[var(--gutter)] right-[var(--gutter)] text-white mix-blend-difference">
        {scenes.map((scene, i) => (
          <div key={scene.key} data-scene-text className="absolute bottom-0 left-0 max-w-[30ch]" style={{ opacity: 0 }}>
            <p className="font-en text-[12px] tracking-[0.14em] tabular-nums opacity-70">
              {String(i + 1).padStart(2, "0")} / {String(scenes.length).padStart(2, "0")}
            </p>
            <p className="mt-3 font-en text-[clamp(30px,4.2vw,56px)] leading-none font-extralight tracking-[0.06em]">{scene.info.name}</p>
            <p className="mt-3 text-[15px] opacity-80">{scene.info.line}</p>
          </div>
        ))}
      </div>

      <p
        data-notice
        className="pointer-events-none absolute bottom-[clamp(28px,7svh,72px)] right-[var(--gutter)] hidden max-w-[24ch] text-right text-[12px] leading-snug text-white/70 mix-blend-difference md:block"
        style={{ opacity: 0 }}
      >
        {exampleNotice}
      </p>

      <p data-hint className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 font-en text-[11px] tracking-[0.2em] text-on-dark-sub">
        SCROLL
      </p>

      {/* 마지막 화이트 */}
      <div data-veil aria-hidden="true" className="pointer-events-none absolute inset-0 bg-paper" style={{ opacity: 0 }} />
    </section>
  );
}
