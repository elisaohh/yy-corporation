"use client";

import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useId, useRef } from "react";
import { Logo } from "@/components/brand/Logo";
import { AssetImage } from "@/components/media/AssetImage";
import { hero } from "@/data/home";

gsap.registerPlugin(ScrollTrigger);

/**
 * ① HOME 히어로 — 2026-10-15 사용자 시안 기준, Bryhel 인트로 참고(로딩 공개 → 콘텐츠 등장).
 * - 로딩: 흰 화면에 로고 + 가는 진행선 → 화면이 위로 걷히며 히어로 공개(약 1.4초, 휠 · 터치 · 키 입력 시 즉시)
 * - 제목 줄이 아래에서 차오르듯 등장, 병 · 물방울이 떠오른 뒤 계속 천천히 떠다닌다.
 * - 데스크톱: 마우스 방향으로 깊이감 있게 살짝 이동, 스크롤하면 병이 서로 다른 속도로 위로 흘러간다.
 * - 모션 줄이기: 로딩 없이 정지 화면.
 */
export function HeroFloat() {
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
        const lines = q("[data-line]");
        const fades = q("[data-fade]");
        const floats = q("[data-float]"); // 떠다니는 안쪽 요소
        const items = q("[data-item]"); // 마우스 · 스크롤 깊이감 바깥 요소

        if (context.conditions?.reduce) {
          gsap.set(loader, { autoAlpha: 0 });
          return;
        }

        // 1) 로딩 → 공개
        gsap.set(lines, { yPercent: 105 });
        gsap.set(fades, { autoAlpha: 0, y: 18 });
        gsap.set(floats, { autoAlpha: 0, y: 60, scale: 0.94 });

        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        if (process.env.NODE_ENV === "development") (window as unknown as Record<string, unknown>).__yyHero = intro;
        intro
          .fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.85, ease: "power2.inOut" })
          .to(loader, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.8, ease: "power4.inOut" }, "+=0.05")
          .set(loader, { autoAlpha: 0 })
          .to(lines, { yPercent: 0, duration: 1.0, stagger: 0.12 }, "-=0.45")
          .to(fades, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, "-=0.7")
          .to(floats, { autoAlpha: 1, y: 0, scale: 1, duration: 1.4, stagger: { each: 0.05, from: "random" }, ease: "power2.out" }, "-=1.2")
          .add(startFloating, "-=0.4");

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

        // 2) 계속 떠다니기 — 요소마다 다른 진폭 · 주기
        function startFloating() {
          floats.forEach((el) => {
            const big = el.dataset.kind === "bottle";
            gsap.to(el, {
              y: gsap.utils.random(big ? -16 : -10, big ? -26 : -18),
              rotation: gsap.utils.random(-2.5, 2.5),
              duration: gsap.utils.random(3.2, 5.2),
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              delay: gsap.utils.random(0, 1.2),
            });
          });
        }

        // 3) 마우스 깊이감 (데스크톱)
        if (context.conditions?.fine) {
          const movers = items.map((el) => ({
            depth: Number(el.dataset.depth ?? 0.5),
            x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" }),
            y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" }),
          }));
          const onMove = (e: PointerEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            movers.forEach((m) => {
              m.x(nx * 36 * m.depth);
              m.y(ny * 28 * m.depth);
            });
          };
          window.addEventListener("pointermove", onMove);
          return () => {
            off();
            window.removeEventListener("pointermove", onMove);
          };
        }

        // 4) 스크롤 시 서로 다른 속도로 위로 (마우스 깊이감과 겹치지 않게 시각 영역 단위로)
        return off;
      },
      section,
    );

    // 스크롤 깊이감: 시각 영역의 각 층을 깊이에 따라 위로
    const scrollCtx = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.utils.toArray<HTMLElement>("[data-layer-depth]").forEach((el) => {
        gsap.to(el, {
          yPercent: -18 * Number(el.dataset.layerDepth ?? 0.5),
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

  return (
    <section
      ref={sectionRef}
      data-header-theme="light"
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-paper"
    >
      <div className="container-yy grid min-h-[100svh] grid-rows-[auto_minmax(0,1fr)] gap-6 pb-20 pt-[calc(var(--header-h)+40px)] lg:grid-cols-12 lg:grid-rows-1 lg:items-center lg:gap-6 lg:pb-16 lg:pt-[var(--header-h)]">
        {/* 문구 */}
        <div className="relative z-10 lg:col-span-6 lg:pl-[4%]">
          <p data-fade className="font-en text-[12px] font-medium tracking-[0.42em] text-charcoal/80 md:text-[13px]">
            {hero.eyebrow}
          </p>
          <h1 id="hero-title" className="mt-6 font-serif text-[clamp(52px,7.4vw,124px)] leading-[0.94] font-normal tracking-[-0.025em] text-charcoal md:mt-10">
            {hero.titleLines.map((line) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <span data-line className="block">
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <div data-fade className="mt-7 text-[clamp(16px,1.35vw,20px)] leading-[1.65] tracking-[-0.01em] text-charcoal/85 md:mt-10">
            {hero.subLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <Link data-fade href={hero.cta.href} className="group mt-9 inline-flex items-center gap-6 md:mt-12">
            <span className="relative grid size-16 place-items-center overflow-hidden rounded-full border border-charcoal transition-colors duration-300 group-hover:bg-charcoal group-hover:text-paper md:size-[72px]">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6 transition-transform duration-300 ease-[var(--ease-yy-out)] group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.3">
                <path d="M3 12h17M14 6l6 6-6 6" />
              </svg>
            </span>
            <span className="text-[17px] font-medium tracking-[-0.01em]">{hero.cta.label}</span>
          </Link>
        </div>

        {/* 떠다니는 병 · 물방울 */}
        <div aria-hidden="true" className="relative h-[clamp(320px,48svh,520px)] lg:col-span-6 lg:h-[min(84svh,780px)]">
          {hero.drops.map((drop, i) => (
            <div
              key={`d${i}`}
              data-item
              data-depth={0.3 + (drop.size / 12) * 0.9}
              className="absolute"
              style={{ left: `${drop.x}%`, top: `${drop.y}%`, width: `${drop.size}%` }}
            >
              <div data-layer-depth={0.2 + drop.size / 14}>
                <div data-float>
                  <div style={{ transform: `rotate(${drop.rotate}deg)` }}>
                    <Droplet ratio={drop.ratio} />
                  </div>
                </div>
              </div>
            </div>
          ))}
          {hero.bottles.map((b) => (
            <div key={b.id} data-item data-depth={b.depth} className="absolute" style={{ left: `${b.left}%`, top: `${b.top}%`, height: `${b.height}%` }}>
              <div data-layer-depth={b.depth} className="h-full">
                <div data-float data-kind="bottle" className="h-full">
                  <AssetImage
                    id={b.id}
                    priority
                    decorative
                    className="h-full w-auto max-w-none mix-blend-multiply"
                    style={{ transform: `rotate(${b.rotate}deg)` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 스크롤 안내 */}
      <div data-fade className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">
        <span className="block h-10 w-px bg-charcoal/40" />
        <span className="font-en text-[10px] tracking-[0.3em] text-ash">SCROLL</span>
      </div>

      {/* 로딩 화면 (Bryhel 참고) — 서버 렌더링 시 덮여 있다가 공개된다 */}
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

/**
 * 맑은 물방울 — 가운데는 비치고(투명), 가장자리로 갈수록 어두운 굴절 테두리,
 * 안쪽 아래에 맺히는 밝은 빛과 그림자 초승달, 위쪽 하이라이트. (장식 그래픽)
 */
function Droplet({ ratio = 1 }: { ratio?: number }) {
  const id = useId().replace(/:/g, "");
  const h = 100 * ratio;
  const ry = h / 2 - 1.5;
  return (
    <svg viewBox={`0 0 100 ${h}`} className="block w-full overflow-visible">
      <defs>
        <radialGradient id={`${id}-body`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="58%" stopColor="#efebe4" stopOpacity="0.12" />
          <stop offset="82%" stopColor="#b9b0a1" stopOpacity="0.38" />
          <stop offset="95%" stopColor="#857b6c" stopOpacity="0.62" />
          <stop offset="100%" stopColor="#6f6658" stopOpacity="0.75" />
        </radialGradient>
        <radialGradient id={`${id}-caustic`} cx="58%" cy="72%" r="40%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
        <clipPath id={`${id}-clip`}>
          <ellipse cx="50" cy={h / 2} rx="48.5" ry={ry} />
        </clipPath>
      </defs>
      {/* 바닥에 드리운 옅은 그림자 */}
      <ellipse cx="55" cy={h / 2 + ry * 0.12} rx="46" ry={ry * 0.92} fill="#5b5346" opacity="0.07" filter={`url(#${id}-soft)`} />
      <ellipse cx="50" cy={h / 2} rx="48.5" ry={ry} fill={`url(#${id}-body)`} />
      <g clipPath={`url(#${id}-clip)`}>
        {/* 안쪽 그림자 초승달(오른쪽 아래) */}
        <ellipse cx="58" cy={h / 2 + ry * 0.18} rx="44" ry={ry * 0.9} fill="none" stroke="#6f6658" strokeOpacity="0.28" strokeWidth="7" filter={`url(#${id}-soft)`} />
        {/* 안쪽 아래 밝게 맺힌 빛 */}
        <ellipse cx="56" cy={h / 2 + ry * 0.36} rx="30" ry={ry * 0.42} fill={`url(#${id}-caustic)`} />
      </g>
      {/* 가는 테두리 */}
      <ellipse cx="50" cy={h / 2} rx="48.5" ry={ry} fill="none" stroke="#7a705f" strokeOpacity="0.45" strokeWidth="0.9" />
      {/* 위쪽 하이라이트 */}
      <ellipse cx="33" cy={h / 2 - ry * 0.5} rx="13" ry={Math.max(3, ry * 0.16)} fill="#ffffff" transform={`rotate(-32 33 ${h / 2 - ry * 0.5})`} />
      <circle cx="22" cy={h / 2 - ry * 0.12} r={Math.max(1.6, ry * 0.05)} fill="#ffffff" />
    </svg>
  );
}
