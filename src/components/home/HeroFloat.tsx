"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { Logo } from "@/components/brand/Logo";
import { hero, slogan } from "@/data/home";
import layers from "@/data/hero-layers.json";
import { isStill } from "@/lib/still";

/**
 * ① HOME 인트로 (2026-10-15 디자인 시스템 개편 — Momix의 장면 리듬만 참고)
 * 약 2.5초, 세 장면을 끊어서 잇는다:
 *   1) 흰 화면에 공식 로고 → 2) 유리병 접사(사진을 크게 확대한 상태) → 3) 전체 구도로 물러나며 공식 문구가 올라온다.
 * 이후에는 물방울만 아주 작게 스스로 떠다닌다(마우스 · 스크롤 반응 없음).
 * 사진: 사용자 제공(자료/07_히어로) → scripts/build-hero-layers.mjs로 병 층 + 물방울 층 분리.
 * 모션 줄이기 · ?still: 마지막 장면을 바로 보여 준다.
 */
const ASPECT = `${layers.width} / ${layers.height}`;
const RATIO = (layers.width / layers.height).toFixed(4);
const MAX_W = 1180;

export function HeroFloat() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add({ motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" }, (context) => {
      const q = gsap.utils.selector(section);
      const loader = q("[data-loader]")[0];
      const photo = q("[data-photo]")[0];
      const lines = q("[data-line]");

      if (context.conditions?.reduce || isStill()) {
        gsap.set(loader, { autoAlpha: 0 });
        return;
      }

      gsap.set(photo, { scale: 1.9, transformOrigin: "52% 58%" });
      gsap.set(lines, { yPercent: 110 });

      const tl = gsap.timeline();
      if (process.env.NODE_ENV === "development") (window as unknown as Record<string, unknown>).__yyHero = tl;
      tl.to(q("[data-loader-logo]"), { autoAlpha: 1, duration: 0.5, ease: "power2.out" })
        // 장면 1 → 2: 로고 화면이 끊기듯 걷히고 유리병 접사
        .to(loader, { autoAlpha: 0, duration: 0.25, ease: "none" }, "+=0.35")
        // 장면 2 → 3: 접사에서 전체 구도로
        .to(photo, { scale: 1, duration: 1.3, ease: "expo.inOut" }, "+=0.15")
        .to(lines, { yPercent: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" }, "-=0.45")
        .add(() => startDrift(), "-=0.2");

      function startDrift() {
        q("[data-bob]").forEach((el) => {
          gsap.to(el, {
            y: -gsap.utils.random(5, 10),
            x: gsap.utils.random(-3, 3),
            duration: gsap.utils.random(3.6, 5.4),
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: gsap.utils.random(0, 1),
          });
        });
      }

      // 스크롤 · 키 입력이 있으면 바로 마지막 장면
      const skip = () => {
        if (tl.progress() < 1) tl.progress(1);
        off();
      };
      const off = () => {
        window.removeEventListener("wheel", skip);
        window.removeEventListener("touchmove", skip);
        window.removeEventListener("keydown", skip);
      };
      window.addEventListener("wheel", skip, { passive: true });
      window.addEventListener("touchmove", skip, { passive: true });
      window.addEventListener("keydown", skip);
      tl.eventCallback("onComplete", off);
      return off;
    }, section);
    return () => mm.revert();
  }, []);


  return (
    <section ref={sectionRef} data-header-theme="light" aria-labelledby="hero-title" className="relative overflow-hidden bg-paper">
      <div className="container-yy grid h-[100svh] min-h-[620px] grid-rows-[minmax(0,1fr)_auto] pb-10 pt-[var(--header-h)] md:pb-14">
        {/* 사진 — 병(바탕 층) + 물방울 층 */}
        <div aria-hidden="true" className="relative flex min-h-0 items-center justify-center overflow-hidden [container-type:size]">
          <div data-photo className="relative" style={{ aspectRatio: ASPECT, width: `min(100cqw, 104cqh * ${RATIO}, ${MAX_W}px)` }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- 층 합성용 원본 비율 그대로 */}
            <img src={layers.base} alt="" width={layers.width} height={layers.height} fetchPriority="high" className="absolute inset-0 size-full" />
            {layers.drops.map((d) => (
              <div key={d.src} className="absolute mix-blend-multiply" style={{ left: `${d.x}%`, top: `${d.y}%`, width: `${d.w}%`, height: `${d.h}%` }}>
                <div data-bob className="size-full">
                  {/* eslint-disable-next-line @next/next/no-img-element -- 사진에서 잘라낸 물방울 */}
                  <img src={d.src} alt="" className="size-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 공식 문구 — 제목축(1단) */}
        <div className="grid gap-6 pt-6 md:grid-cols-12 md:items-end md:gap-8">
          <h1 id="hero-title" aria-label={hero.lead} className="t-display md:col-span-8">
            {slogan.lines.map((line) => (
              <span key={line} aria-hidden="true" className="block overflow-hidden pb-[0.08em]">
                <span data-line className="block">
                  {line}
                </span>
              </span>
            ))}
          </h1>
        </div>
      </div>

      {/* 장면 1 — 흰 화면의 공식 로고 */}
      <div data-loader className="absolute inset-0 z-30 grid place-items-center bg-paper">
        <div data-loader-logo style={{ opacity: 0 }}>
          <Logo placement="loader" />
        </div>
      </div>
    </section>
  );
}
