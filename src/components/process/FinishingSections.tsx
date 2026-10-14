"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Pending } from "@/components/ui/Pending";
import { exampleNotice, finishingProcesses } from "@/data/process";

gsap.registerPlugin(ScrollTrigger);

/**
 * PROCESS ② 후가공 — 상단 고정 탭 + 공정별 블록(부록 F).
 * 스크롤하면 현재 공정 탭이 활성화되고, 탭을 누르면 해당 공정으로 이동한다.
 * 이미지는 같은 기준 유리병에 효과를 적용한 생성 예시 — 안내 문구를 함께 둔다.
 */
export function FinishingSections() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const blocks = Array.from(root.querySelectorAll<HTMLElement>("[data-process]"));
    const triggers = blocks.map((el, i) =>
      ScrollTrigger.create({ trigger: el, start: "top 50%", end: "bottom 50%", onToggle: (self) => self.isActive && setActive(i) }),
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);

  const jump = (key: string) => {
    const el = document.getElementById(`process-${key}`);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <div ref={ref}>
      {/* 고정 탭 */}
      <nav aria-label="후가공 공정" className="sticky top-[var(--header-offset)] z-20 transition-[top] duration-300 ease-[var(--ease-yy-out)] border-y border-stone bg-paper/90 backdrop-blur-md">
        <ul className="container-yy flex gap-6 overflow-x-auto md:gap-10 [scrollbar-width:none]">
          {finishingProcesses.map((p, i) => (
            <li key={p.key} className="shrink-0">
              <button
                type="button"
                onClick={() => jump(p.key)}
                aria-current={active === i ? "true" : undefined}
                className={`relative flex h-12 items-center font-en text-[12px] font-semibold tracking-[0.14em] transition-colors duration-300 md:h-14 md:text-[13px] ${
                  active === i ? "text-charcoal" : "text-ash hover:text-charcoal"
                }`}
              >
                {p.name}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 h-[2px] origin-left bg-point-4008 transition-transform duration-500 ease-[var(--ease-yy-out)] ${
                    active === i ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {finishingProcesses.map((p, i) => (
        <section
          key={p.key}
          id={`process-${p.key}`}
          data-process
          data-header-theme="light"
          aria-labelledby={`process-${p.key}-title`}
          className="scroll-mt-[calc(var(--header-h)+56px)] border-b border-stone bg-paper"
        >
          <div className="container-yy grid gap-10 py-16 md:grid-cols-12 md:items-center md:gap-8 md:py-24">
            <div className="md:col-span-6 lg:col-span-5">
              <div className="relative mx-auto aspect-[9/16] max-h-[min(64svh,620px)] bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element -- 생성 예시 이미지 원본 비율 */}
                <img src={p.exampleImage} alt={`${p.nameKo} 후가공 생성 예시 — 기준 유리병`} loading="lazy" className="size-full object-contain mix-blend-multiply" />
              </div>
            </div>

            <div className="md:col-span-6 lg:col-span-6 lg:col-start-7">
              <Reveal>
                <p className="font-en text-[12px] tabular-nums text-ash">{String(i + 1).padStart(2, "0")} / {String(finishingProcesses.length).padStart(2, "0")}</p>
                <h2 id={`process-${p.key}-title`} className="mt-4 font-en text-[clamp(40px,5.6vw,88px)] leading-[0.9] font-extrabold tracking-[-0.045em]">
                  {p.name}
                </h2>
                <p className="mt-4 text-[clamp(18px,1.5vw,21px)] font-semibold tracking-[-0.02em]">
                  {p.nameKo} <span className="font-normal text-ash">— {p.line}</span>
                </p>
                {p.summary.text ? (
                  <p className="mt-5 max-w-[42ch] text-[16px] leading-[1.8] text-ash">{p.summary.text}</p>
                ) : (
                  <p className="mt-5 text-[14px] text-ash">
                    공정 설명 <Pending />
                  </p>
                )}
              </Reveal>

              <Reveal delay={120}>
                <ol className="mt-10 border-t border-stone">
                  {p.steps.map((step, s) => (
                    <li key={step.en} className="grid grid-cols-[28px_minmax(0,1fr)] items-baseline gap-3 border-b border-stone py-3 md:grid-cols-[32px_minmax(0,1fr)_minmax(0,1fr)]">
                      <span className="font-en text-[11px] tabular-nums text-ash">{String(s + 1).padStart(2, "0")}</span>
                      <span className="text-[15px]">{step.ko}</span>
                      <span className="col-start-2 font-en text-[12px] text-ash md:col-start-auto">{step.en}</span>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      <p className="container-yy py-6 text-[12px] text-ash">{exampleNotice}</p>
    </div>
  );
}
