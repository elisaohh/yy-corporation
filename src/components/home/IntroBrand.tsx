"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { HEADER_THEME_EVENT } from "@/components/layout/headerEvents";
import { AssetImage } from "@/components/media/AssetImage";
import { intro } from "@/data/home";

/**
 * ① 브랜드 인트로 — 자동 재생 약 5.1초 (2026-10-14 HOME 개편안).
 *   I-1 어두운 유리 접사 → I-2 키컬러(1225C) 면이 아래에서 위로 쓸고 지나감 → I-3 흰 여백
 *   → I-4 FIND · DRESS · MATCH · DELIVER 굵은 단어 리듬 → I-5 가운데 세로 틈이 열리며
 *   → I-6 제품 비주얼 + 대형 단어 GLASS (이 장면이 첫 화면으로 유지된다)
 *
 * - 스크롤을 막지 않는다. 재생 중 스크롤 · 터치 · 키 입력이 있으면 즉시 마지막 장면으로 건너뛴다.
 * - 같은 세션에서 다시 오면 마지막 장면부터, 모션 줄이기 설정이면 마지막 장면만 보여 준다.
 * - I-1은 공장 사진 공개 권한 확인 전까지 유리 접사(기준병 사진 반전)로 대체한다.
 */

const SEEN_KEY = "yy-intro-seen";

export function IntroBrand() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const q = gsap.utils.selector(section);

    const setTheme = (theme: "dark" | "light") => {
      if (section.dataset.headerTheme === theme) return;
      section.dataset.headerTheme = theme;
      window.dispatchEvent(new Event(HEADER_THEME_EVENT));
    };

    const ctx = gsap.context(() => {
      const dark = q("[data-dark]")[0];
      const macro = q("[data-macro]")[0];
      const key = q("[data-key]")[0];
      const words = q("[data-word]");
      const product = q("[data-product]")[0];
      const hero = q("[data-hero-word]")[0];
      const bottles = q("[data-row] img");
      const cue = q("[data-cue]")[0];

      // 서버 렌더링용 초기 inline transform을 지우고 GSAP 값으로만 위치를 잡는다(이중 이동 방지)
      gsap.set(key, { clearProps: "transform" });
      gsap.set(key, { yPercent: 100 });

      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      if (process.env.NODE_ENV === "development") (window as unknown as Record<string, unknown>).__yyIntro = tl;

      // I-1 어두운 유리 접사 — 천천히 다가옴
      tl.fromTo(macro, { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1.02, duration: 1.6, ease: "power2.out" }, 0);

      // I-2 키컬러 면이 아래에서 덮고 → 위로 빠지며 흰 여백
      tl.fromTo(key, { yPercent: 100 }, { yPercent: 0, duration: 0.38, ease: "power3.inOut" }, 1.55)
        .set(dark, { autoAlpha: 0 }, 1.93)
        .call(() => setTheme("light"), undefined, 1.93)
        .to(key, { yPercent: -100, duration: 0.38, ease: "power3.inOut" }, 2.0);

      // I-3/I-4 흰 여백 → 굵은 단어 리듬
      words.forEach((word, i) => {
        const at = 2.45 + i * 0.3;
        tl.fromTo(word, { autoAlpha: 0, yPercent: 18 }, { autoAlpha: 1, yPercent: 0, duration: 0.18 }, at);
        tl.to(word, { autoAlpha: 0, duration: 0.1, ease: "none" }, at + 0.27);
      });

      // I-5 가운데 세로 틈이 열리며 제품 비주얼
      const open = 2.45 + words.length * 0.3 + 0.02;
      tl.fromTo(
        product,
        { clipPath: "inset(0% 50% 0% 50%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power4.inOut" },
        open,
      );

      // I-6 대형 단어 + 제품이 떠오름
      tl.fromTo(hero, { yPercent: 12, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.9 }, open + 0.35)
        .fromTo(bottles, { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.06 }, open + 0.3)
        .fromTo(cue, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, open + 1.0);

      const finish = () => {
        tl.progress(1);
        setTheme("light");
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {}
        removeSkip();
      };

      const onSkip = (event: Event) => {
        if (event instanceof KeyboardEvent && !["ArrowDown", "PageDown", " ", "End", "Tab", "Enter"].includes(event.key)) return;
        if (tl.progress() < 1) finish();
      };
      const removeSkip = () => {
        window.removeEventListener("wheel", onSkip);
        window.removeEventListener("touchmove", onSkip);
        window.removeEventListener("keydown", onSkip);
        window.removeEventListener("scroll", onSkip);
      };

      let seen = false;
      try {
        seen = sessionStorage.getItem(SEEN_KEY) === "1";
      } catch {}
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (seen || reduce || window.scrollY > 10) {
        finish();
        return;
      }

      window.addEventListener("wheel", onSkip, { passive: true });
      window.addEventListener("touchmove", onSkip, { passive: true });
      window.addEventListener("keydown", onSkip);
      window.addEventListener("scroll", onSkip, { passive: true });
      tl.eventCallback("onComplete", finish);
      tl.play(0);

      return removeSkip;
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-header-theme="dark"
      data-no-top
      aria-label="YY CORPORATION 인트로"
      className="relative h-[100svh] min-h-[560px] overflow-hidden bg-paper text-charcoal"
    >
      <h1 className="sr-only">YY CORPORATION — 화장품 유리 용기 · 후가공 · 부자재 턴키 패키징</h1>

      {/* I-5/I-6 제품 비주얼 + 대형 단어 (가장 아래 층) */}
      <div data-product className="absolute inset-0 bg-paper" style={{ clipPath: "inset(0% 50% 0% 50%)" }}>
        <p
          data-hero-word
          aria-hidden="true"
          className="absolute inset-x-0 top-[44%] -translate-y-1/2 text-center font-en text-[clamp(120px,31vw,520px)] leading-none font-extrabold tracking-[-0.06em] text-charcoal"
          style={{ opacity: 0 }}
        >
          {intro.heroWord}
        </p>
        <div
          data-row
          className="absolute inset-x-0 bottom-[7svh] flex items-end justify-center gap-[0.5vw] px-[var(--gutter)]"
        >
          {intro.productRow.map((id) => (
            <AssetImage
              key={id}
              id={id}
              decorative
              priority
              className="h-[clamp(180px,44svh,520px)] w-auto min-w-0 max-w-[24%] object-contain mix-blend-multiply"
              style={{ opacity: 0 }}
            />
          ))}
        </div>
        <p
          data-cue
          className="absolute bottom-3 left-1/2 -translate-x-1/2 font-en text-[11px] tracking-[0.22em] text-ash"
          style={{ opacity: 0 }}
        >
          SCROLL
        </p>
      </div>

      {/* I-3/I-4 흰 여백 위 굵은 단어 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
        {intro.words.map((word) => (
          <span
            key={word}
            data-word
            className="absolute font-en text-[clamp(64px,15vw,240px)] leading-none font-extrabold tracking-[-0.045em] text-charcoal"
            style={{ opacity: 0, visibility: "hidden" }}
          >
            {word}
          </span>
        ))}
      </div>

      {/* I-1 어두운 유리 접사 */}
      <div data-dark aria-hidden="true" className="absolute inset-0 grid place-items-center bg-black">
        <AssetImage
          id={intro.darkVisual}
          data-macro=""
          priority
          decorative
          className="h-[104%] w-auto max-w-none object-contain"
          style={{ opacity: 0 }}
        />
      </div>

      {/* I-2 키컬러 면 */}
      <div data-key aria-hidden="true" className="absolute inset-0 bg-point-1225" style={{ transform: "translateY(100%)" }} />
    </section>
  );
}
