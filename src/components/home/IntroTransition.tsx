"use client";

import { useEffect, useRef, useState } from "react";
import { HEADER_THEME_EVENT } from "@/components/layout/headerEvents";
import { Pending } from "@/components/ui/Pending";

/**
 * ② 차콜 → 화이트 전환 — ⚠ 임시 구현.
 *
 * 최종 방식은 "카메라가 유리병에 다가가며 유리의 부드러운 반사광으로 화이트에 닿는" 연출이다(기획서 부록 B1).
 * 지금은 그 자리를 잡아 두기 위해, 스크롤 진행도에 따라 중앙의 빛이 퍼지며 바탕이 밝아지는
 * 단순한 형태로만 만들었다. 이 방식을 최종으로 확정하지 않는다. 모션 단계에서 이 컴포넌트를 교체한다.
 */
export function IntroTransition() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      const p = range > 0 ? Math.min(1, Math.max(0, -rect.top / range)) : 1;
      setProgress(p);
      // 헤더 글자색: 절반을 넘으면 밝은 구역으로 판단. 바뀌는 순간 헤더에 바로 알린다.
      const theme = p > 0.5 ? "light" : "dark";
      if (el.dataset.headerTheme !== theme) {
        el.dataset.headerTheme = theme;
        window.dispatchEvent(new Event(HEADER_THEME_EVENT));
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // 부드러운 가속: 처음엔 천천히, 중간 이후 밝아짐
  const eased = progress * progress * (3 - 2 * progress);
  const bloomScale = 0.25 + eased * 2.6;
  const bloomOpacity = Math.min(1, progress * 1.8);

  return (
    <section
      ref={sectionRef}
      data-header-theme="dark"
      data-no-top
      aria-hidden="true"
      className="relative h-[170svh]"
    >
      <div
        className="sticky top-0 h-[100svh] overflow-hidden"
        style={{ background: `color-mix(in oklab, var(--color-paper) ${Math.round(eased * 100)}%, var(--color-intro))` }}
      >
        <div
          className="absolute left-1/2 top-1/2 size-[120vmax] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.55)_22%,rgba(255,255,255,0)_55%)]"
          style={{
            transform: `translate(-50%, -50%) scale(${bloomScale})`,
            opacity: bloomOpacity,
          }}
        />
        <p
          className={`absolute bottom-8 left-[var(--gutter)] flex items-center gap-2 text-[13px] transition-colors duration-300 md:bottom-10 ${
            progress > 0.5 ? "text-ash" : "text-on-dark-sub"
          }`}
        >
          <Pending kind="temporary" label="임시 전환" />
          최종은 유리 반사광 연출
        </p>
      </div>
    </section>
  );
}
