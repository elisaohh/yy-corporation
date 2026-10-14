"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { Logo } from "@/components/brand/Logo";
import { AssetImage } from "@/components/media/AssetImage";
import { Reveal } from "@/components/motion/Reveal";
import { Pending } from "@/components/ui/Pending";
import type { SloganVariant } from "@/config/variants";
import layers from "@/data/hero-layers.json";
import { slogan } from "@/data/home";

/**
 * ⑤ 슬로건 '병 하나, 처음부터 끝까지' — 시안 3종(2026-10-15 비교 중). 얇은 글씨 → 굵은 글씨.
 *   a: 미스트 배경 + 반투명 로고 그래픽(단색 파생본 — 그래픽 전용 규칙)
 *   b: 옐로(1225C) 배경 + 히어로 사진의 물방울이 천천히 떠다님
 *   c: 흰 배경 + 기준병 제품 사진
 */
export function Slogan({ variant = "a" }: { variant?: SloganVariant }) {
  const [first, second] = slogan.lines;

  const bg = variant === "a" ? "bg-mist" : variant === "b" ? "bg-point-1225" : "bg-paper";

  return (
    <section data-header-theme="light" aria-label="브랜드 슬로건" className={`relative flex min-h-[86svh] items-center overflow-hidden py-28 ${bg}`}>
      {variant === "a" && (
        <div aria-hidden="true" className="pointer-events-none absolute -right-[6%] top-1/2 w-[min(70vw,980px)] -translate-y-1/2 opacity-[0.06]">
          <Logo variant="verticalCorporation" tone="monoCharcoal" decorative className="h-auto w-full" />
        </div>
      )}
      {variant === "b" && <FloatingDrops />}

      <div className={`container-yy relative ${variant === "c" ? "grid items-center gap-12 md:grid-cols-12 md:gap-8" : ""}`}>
        <div className={variant === "c" ? "md:col-span-7" : ""}>
          <h2 className="text-[clamp(44px,7vw,116px)] leading-[1.12] font-bold tracking-[-0.045em] text-charcoal">
            <Reveal as="span" className="block">
              {first}
            </Reveal>
            <Reveal as="span" delay={300} className={`block ${variant === "c" ? "" : "md:pl-[14%]"}`}>
              {second}
            </Reveal>
          </h2>
          {slogan.sub.text && (
            <Reveal delay={600} className={`mt-10 md:mt-14 ${variant === "c" ? "" : "md:pl-[14%]"}`}>
              <p className={`max-w-[34ch] text-[clamp(16px,1.3vw,18px)] leading-[1.75] ${variant === "b" ? "text-charcoal/75" : "text-ash"}`}>{slogan.sub.text}</p>
              {slogan.sub.status !== "final" && (
                <p className="mt-3">
                  <Pending kind="draft" />
                </p>
              )}
            </Reveal>
          )}
        </div>
        {variant === "c" && (
          <Reveal delay={200} className="md:col-span-5">
            <div className="aspect-square bg-card">
              <AssetImage id="YS-SRRR30-04_01" decorative className="size-full object-contain mix-blend-multiply" />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/** b안: 히어로 사진에서 잘라낸 물방울 몇 개가 옐로 바탕 위를 천천히 떠다닌다(multiply 합성) */
const SPOTS = [
  { i: 0, left: 72, top: 14, w: 15 },
  { i: 1, left: 6, top: 64, w: 13 },
  { i: 2, left: 84, top: 62, w: 9 },
  { i: 3, left: 60, top: 70, w: 6 },
  { i: 4, left: 90, top: 34, w: 4 },
  { i: 7, left: 22, top: 18, w: 3.5 },
];

function FloatingDrops() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      root.querySelectorAll<HTMLElement>("[data-float]").forEach((el) => {
        gsap.to(el, { y: gsap.utils.random(-26, -14), x: gsap.utils.random(-10, 10), rotation: gsap.utils.random(-6, 6), duration: gsap.utils.random(3.6, 6), ease: "sine.inOut", yoyo: true, repeat: -1 });
      });
    });
    return () => mm.revert();
  }, []);
  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0">
      {SPOTS.map((s) => {
        const d = layers.drops[s.i];
        if (!d) return null;
        return (
          <div key={s.i} className="absolute mix-blend-multiply" style={{ left: `${s.left}%`, top: `${s.top}%`, width: `${s.w}vw`, aspectRatio: `${d.w * layers.width} / ${d.h * layers.height}` }}>
            <div data-float className="size-full">
              {/* eslint-disable-next-line @next/next/no-img-element -- 히어로 사진에서 잘라낸 물방울 */}
              <img src={d.src} alt="" className="size-full" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
