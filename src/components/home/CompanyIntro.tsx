"use client";

import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { expertise } from "@/data/about";
import { companyIntro } from "@/data/home";

gsap.registerPlugin(ScrollTrigger);

/**
 * ② 회사 소개 + 전문 역량 (2026-10-15: 이전 ABOUT의 SOURCING → DELIVERY 디자인을 HOME으로)
 * 데스크톱: 한 화면에 고정한 채 스크롤하면 단계가 넘어간다 —
 *   왼쪽 큰 단어 목록에서 현재 항목만 진해지고 커지며, 오른쪽은 큰 번호 · 태그 · 설명이 교차하고
 *   위치가 단계마다 위아래로 엇갈려 구성이 달라진다. 단계마다 부드럽게 멈춘다(스냅). 사진 없음(2026-10-15 요청).
 * 모바일 · 모션 줄이기: 고정 없이 항목을 차례로 보여 준다.
 */
export function CompanyIntro() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const count = expertise.length;

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const end = () => `+=${window.innerHeight * (count - 0.4)}`;
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: { snapTo: 1 / (count - 1), duration: { min: 0.3, max: 0.7 }, delay: 0.08, ease: "power2.inOut" },
        onUpdate: (self) => setActive(Math.min(count - 1, Math.round(self.progress * (count - 1)))),
      });
      gsap.fromTo(
        section.querySelector("[data-bar]"),
        { scaleY: 0.25 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: section, start: "top top", end, scrub: true } },
      );
    });
    return () => mm.revert();
  }, [count]);

  return (
    // 고정(pin) 시 GSAP이 section을 감싸므로 React가 지우는 최상위 노드는 바깥 div
    <div>
      <section ref={ref} data-header-theme="light" aria-labelledby="company-intro-title" className="relative overflow-hidden bg-mist">
        {/* ── 데스크톱: 한 화면 고정 ── */}
        <div className="container-yy hidden h-[100svh] min-h-[640px] grid-cols-12 gap-8 pb-12 pt-[calc(var(--header-h)+40px)] lg:grid">
          <div className="col-span-6 flex flex-col">
            <h2 id="company-intro-title" className="text-[clamp(28px,2.8vw,44px)] leading-[1.25] font-bold tracking-[-0.035em]">
              {companyIntro.title}
            </h2>
            <p className="mt-4 max-w-[40ch] text-[16px] leading-[1.75] text-ash">{companyIntro.body}</p>
            <Link href="/about" className="link-en mt-2 self-start">
              ABOUT →
            </Link>

            <div className="relative mt-auto flex gap-6">
              {/* 진행 막대 */}
              <span aria-hidden="true" className="relative block w-px bg-charcoal/15">
                <span data-bar className="absolute inset-0 origin-top bg-point-4008" style={{ transform: "scaleY(0.25)" }} />
              </span>
              <ol className="grid gap-1">
                {expertise.map((item, i) => (
                  <li key={item.key} aria-current={active === i ? "step" : undefined} className="flex items-baseline gap-4">
                    <span className={`font-en text-[12px] tabular-nums transition-colors duration-500 ${active === i ? "text-charcoal" : "text-charcoal/30"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="origin-left font-en leading-[1.02] font-extrabold tracking-[-0.045em] uppercase transition-[color,transform] duration-700 ease-[var(--ease-yy-out)]"
                      style={{
                        fontSize: "clamp(40px, 5vw, 84px)",
                        color: active === i ? "var(--color-charcoal)" : "color-mix(in srgb, var(--color-charcoal) 16%, var(--color-mist))",
                        transform: active === i ? "scale(1)" : "scale(0.86)",
                      }}
                    >
                      {item.key}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="relative col-span-5 col-start-8 flex flex-col">
            {/* 단계 내용 — 큰 번호 + 서비스 태그 + 한 줄 + 설명이 교차하며, 단계마다 위아래 위치가 엇갈려 구도가 바뀐다 */}
            <div
              className="relative my-auto h-[min(56svh,460px)] transition-transform duration-[900ms] ease-[var(--ease-yy-out)]"
              style={{ transform: `translateY(${active % 2 ? "8svh" : "-4svh"})` }}
            >
              {expertise.map((item, i) => (
                <div
                  key={item.key}
                  aria-hidden={active !== i}
                  className="absolute inset-0 flex flex-col justify-end transition-[opacity,transform] duration-700 ease-[var(--ease-yy-out)]"
                  style={{ opacity: active === i ? 1 : 0, transform: active === i ? "translateY(0)" : i < active ? "translateY(-24px)" : "translateY(24px)" }}
                >
                  <p className="font-en text-[clamp(120px,14vw,220px)] leading-[0.8] font-extralight tabular-nums tracking-[-0.06em] text-charcoal/12">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-8 flex items-center gap-3 font-en text-[12px] font-semibold tracking-[0.18em] text-charcoal uppercase">
                    <span className="size-1.5 rounded-full bg-point-4008" aria-hidden="true" />
                    {item.service}
                  </p>
                  <p className="mt-4 text-[clamp(22px,2vw,30px)] font-bold tracking-[-0.03em]">{item.line}</p>
                  <p className="mt-3 max-w-[42ch] text-[16px] leading-[1.8] text-ash">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 모바일 · 태블릿: 차례로 ── */}
        <div className="container-yy py-24 lg:hidden">
          <h2 className="text-[clamp(28px,6vw,40px)] leading-[1.25] font-bold tracking-[-0.035em]">{companyIntro.title}</h2>
          <p className="mt-4 text-[16px] leading-[1.75] text-ash">{companyIntro.body}</p>
          <ol className="mt-12 grid gap-12">
            {expertise.map((item, i) => (
              <li key={item.key} className="border-t border-charcoal/15 pt-6">
                <p className="flex items-baseline gap-3">
                  <span className="font-en text-[12px] tabular-nums text-ash">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-en text-[clamp(34px,9vw,52px)] leading-none font-extrabold tracking-[-0.045em] uppercase">{item.key}</span>
                </p>
                <p className="mt-3 text-[17px] font-semibold">{item.line}</p>
                <p className="mt-1 text-[15px] leading-[1.75] text-ash">{item.body}</p>
              </li>
            ))}
          </ol>
          <Link href="/about" className="link-en mt-10">
            ABOUT →
          </Link>
        </div>
      </section>
    </div>
  );
}
