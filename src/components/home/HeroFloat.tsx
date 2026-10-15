"use client";

import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Fragment, useEffect, useRef } from "react";
import { Logo } from "@/components/brand/Logo";
import { hero } from "@/data/home";
import type { HeroVariant } from "@/config/variants";
import layers from "@/data/hero-layers.json";
import { isStill } from "@/lib/still";

gsap.registerPlugin(ScrollTrigger);

/**
 * ① HOME 히어로 — 사용자 제공 사진(자료/07_히어로)을 층으로 나눠 쓴다(scripts/build-hero-layers.mjs).
 * - 바탕 층: 병 3개(와 병에 맞닿은 물방울). 떠 있는 물방울은 사진 속 그대로 잘라 각각 따로 떠다닌다.
 * - 물방울은 multiply로 합성 — 병 앞을 지나도 흰 바탕이 비치지 않고 테두리만 남아 맑은 물방울처럼 보인다.
 * - 로딩: 로고 + 가는 진행선 → 화면이 위로 걷힘(약 1.4초, 휠 · 터치 · 키 입력 시 즉시)
 * - 데스크톱: 마우스 방향으로 깊이감, 스크롤하면 물방울이 병보다 빨리 위로 흘러간다.
 * - 모션 줄이기: 로딩 없이 정지 화면.
 */
const ASPECT = `${layers.width} / ${layers.height}`;
const RATIO = (layers.width / layers.height).toFixed(4);
/** 큰 화면에서 사진이 지나치게 커지지 않게 — 시안별 최대 폭 */
const MAX_W: Record<HeroVariant, number> = { a: 1240, b: 1380, c: 1180 };

/** 작은 물방울일수록 가볍게(크게) 움직인다 */
const depthOf = (w: number) => 0.55 + Math.min(0.75, 3 / w);

export function HeroFloat({ variant = "a" }: { variant?: HeroVariant }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mm = gsap.matchMedia();

    mm.add(
      { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)", fine: "(pointer: fine) and (min-width: 1024px)" },
      (context) => {
        const q = gsap.utils.selector(section);
        const loader = q("[data-loader]")[0];
        const bar = q("[data-loader-bar]")[0];
        const words = q("[data-word]");
        const fades = q("[data-fade]");
        const photo = q("[data-photo]")[0];
        const drops = q("[data-drop]");

        if (context.conditions?.reduce || isStill()) {
          gsap.set(loader, { autoAlpha: 0 });
          return;
        }

        // 1) 로딩 → 공개
        gsap.set(words, { yPercent: 110 });
        gsap.set(fades, { autoAlpha: 0, y: 14 });
        gsap.set(photo, { autoAlpha: 0, scale: 1.04, y: 24 });
        gsap.set(drops, { autoAlpha: 0, y: 26 });

        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        if (process.env.NODE_ENV === "development") (window as unknown as Record<string, unknown>).__yyHero = intro;
        intro
          .fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.85, ease: "power2.inOut" })
          .to(loader, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.8, ease: "power4.inOut" }, "+=0.05")
          .set(loader, { autoAlpha: 0 })
          .to(photo, { autoAlpha: 1, scale: 1, y: 0, duration: 1.6, ease: "power2.out" }, "-=0.5")
          .to(drops, { autoAlpha: 1, y: 0, duration: 1.4, stagger: { each: 0.04, from: "random" }, ease: "power2.out" }, "<0.2")
          .to(words, { yPercent: 0, duration: 1.1, stagger: 0.07 }, "<0.1")
          .to(fades, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, "-=0.7")
          .add(startFloating, "-=0.6");

        const skip = () => {
          if (intro.progress() < 1) intro.progress(1);
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
        intro.eventCallback("onComplete", off);

        // 2) 자동으로 계속 떠다니기 — 가로 · 세로 · 회전을 서로 다른 주기로 돌려 매번 다른 궤적
        function startFloating() {
          q("[data-bob]").forEach((el) => {
            const d = Number(el.dataset.bob);
            const bottle = d < 0.7;
            const loop = (vars: gsap.TweenVars, min: number, max: number) =>
              gsap.to(el, { ...vars, duration: gsap.utils.random(min, max), ease: "sine.inOut", yoyo: true, repeat: -1, delay: gsap.utils.random(0, 1.2) });
            loop({ y: (bottle ? -12 : -gsap.utils.random(14, 24)) * d }, bottle ? 4.5 : 3, bottle ? 5.5 : 4.6);
            loop({ x: gsap.utils.random(-1, 1) * (bottle ? 6 : 12) * d }, bottle ? 6 : 4.2, bottle ? 7.5 : 6.4);
            loop({ rotation: gsap.utils.random(-1, 1) * (bottle ? 1.2 : 6) }, 5, 8);
          });
        }

        // 3) 마우스 깊이감 (데스크톱)
        if (context.conditions?.fine) {
          const movers = q("[data-depth]").map((el) => ({
            depth: Number(el.dataset.depth),
            x: gsap.quickTo(el, "x", { duration: 1.4, ease: "power3.out" }),
            y: gsap.quickTo(el, "y", { duration: 1.4, ease: "power3.out" }),
          }));
          const onMove = (e: PointerEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            movers.forEach((m) => {
              m.x(nx * 22 * m.depth);
              m.y(ny * 16 * m.depth);
            });
          };
          window.addEventListener("pointermove", onMove);
          return () => {
            off();
            window.removeEventListener("pointermove", onMove);
          };
        }
        return off;
      },
      section,
    );

    // 스크롤: 물방울이 병보다 빨리 위로
    const scrollCtx = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.utils.toArray<HTMLElement>("[data-scroll]").forEach((el) => {
        gsap.to(el, {
          y: -110 * Number(el.dataset.scroll),
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 0.6 },
        });
      });
    }, section);

    return () => {
      mm.revert();
      scrollCtx.revert();
    };
  }, []);

  const words = hero.title.split(" ");
  const behind = variant === "b"; // 제목이 사진 뒤 가운데
  const arch = variant === "c"; // 옅은 아치 면 위에 병

  return (
    <section ref={sectionRef} data-header-theme="light" aria-labelledby="hero-title" className="relative overflow-hidden bg-paper">
      <div className="container-yy relative flex h-[100svh] min-h-[600px] flex-col pb-6 pt-[calc(var(--header-h)+12px)] md:pb-8 md:pt-[calc(var(--header-h)+16px)]">
        {/* 윗줄: 분야 · 공식 문구 */}
        <div className="flex flex-wrap items-start justify-between gap-x-10 gap-y-3">
          <p data-fade className="label-en text-[11px] tracking-[0.32em] text-ash md:text-[12px]">
            {hero.eyebrow}
          </p>
          {!behind && (
            <div data-fade className="text-[15px] leading-[1.6] md:text-right md:text-[17px]">
              <p className="font-medium text-charcoal">{hero.lead}</p>
              <p className="text-ash">{hero.sub}</p>
            </div>
          )}
        </div>

        {/* 사진 — 병(바탕 층) + 떠 있는 물방울 */}
        <div
          aria-hidden="true"
          className={`relative z-10 flex min-h-[min(100vw,460px)] flex-1 items-center justify-center [container-type:size] md:min-h-[320px] ${
            behind ? "mt-0" : "mt-2 md:-mb-[2.4vw]"
          }`}
        >
          {/* 남은 영역 안에서 사진 비율 그대로 최대 크기 (컨테이너 쿼리 단위) */}
          <div data-photo className="relative" style={{ aspectRatio: ASPECT, width: `min(${behind ? 108 : 100}cqw, ${arch ? 104 : 112}cqh * ${RATIO}, ${MAX_W[variant]}px)` }}>
            {arch && <div className="absolute inset-x-[9%] -bottom-[6%] top-[4%] rounded-t-full bg-mist" />}
            <div data-depth="0.3" className="absolute inset-0">
              <div data-scroll="0.35" className="absolute inset-0">
                <div data-bob="0.6" className={`absolute inset-0 ${arch ? "mix-blend-multiply" : ""}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- 층 합성용 원본 비율 그대로 */}
                  <img src={layers.base} alt="" width={layers.width} height={layers.height} fetchPriority="high" className="size-full" />
                </div>
              </div>
            </div>
            {layers.drops.map((d) => {
              const depth = depthOf(d.w);
              return (
                <div
                  key={d.src}
                  data-depth={depth.toFixed(2)}
                  className="absolute mix-blend-multiply"
                  style={{ left: `${d.x}%`, top: `${d.y}%`, width: `${d.w}%`, height: `${d.h}%` }}
                >
                  <div data-scroll={(depth * 0.9).toFixed(2)} className="size-full">
                    <div data-drop className="size-full">
                      <div data-bob={depth.toFixed(2)} className="size-full">
                        {/* eslint-disable-next-line @next/next/no-img-element -- 사진에서 잘라낸 물방울 */}
                        <img src={d.src} alt="" className="size-full" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 영문 대형 제목 — 병이 살짝 겹쳐 깊이를 만든다 (모바일은 두 줄) */}
        <h1
          id="hero-title"
          aria-label={hero.title}
          className={
            behind
              ? "pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 text-center font-en text-[clamp(60px,17vw,300px)] leading-[0.84] font-extrabold tracking-[-0.055em] text-charcoal uppercase"
              : `relative ${arch ? "z-20" : ""} mt-3 font-en text-[clamp(38px,12vw,96px)] leading-[0.92] font-extrabold tracking-[-0.045em] text-charcoal uppercase md:mt-0 md:whitespace-nowrap md:text-[clamp(52px,7.4vw,122px)]`
          }
        >
          {words.map((word, i) => (
            <Fragment key={`${word}-${i}`}>
              <span aria-hidden="true" className="inline-block overflow-hidden pb-[0.06em] align-top">
                <span data-word className="inline-block">
                  {word}
                </span>
              </span>
              {i === 1 && <br className={behind ? "" : "md:hidden"} />}
              {i < words.length - 1 && " "}
            </Fragment>
          ))}
        </h1>

        {/* 아랫줄: 제품 보기 */}
        <div className="relative z-10 mt-5 flex flex-wrap items-end justify-between gap-6 md:mt-6">
          {behind && (
            <div data-fade className="text-[15px] leading-[1.6] md:text-[17px]">
              <p className="font-medium text-charcoal">{hero.lead}</p>
              <p className="text-ash">{hero.sub}</p>
            </div>
          )}
          <Link data-fade href={hero.cta.href} className="btn btn-primary btn-en md:ml-auto">
            {hero.cta.label.toUpperCase()}
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 12h15M14 7l5 5-5 5" />
            </svg>
          </Link>
        </div>
      </div>

      {/* 로딩 화면 — 서버 렌더링 시 덮여 있다가 공개된다 */}
      <div data-loader className="absolute inset-0 z-30 grid place-items-center bg-paper" style={{ clipPath: "inset(0% 0% 0% 0%)" }}>
        <div className="grid justify-items-center gap-6">
          <Logo placement="loader" />
          <span className="relative block h-px w-40 overflow-hidden bg-stone">
            <span data-loader-bar className="absolute inset-0 origin-left bg-charcoal" style={{ transform: "scaleX(0)" }} />
          </span>
        </div>
      </div>
    </section>
  );
}
