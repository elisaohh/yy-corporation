"use client";

import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { AssetImage } from "@/components/media/AssetImage";
import { processScene } from "@/data/home";
import { exampleNotice, finishingProcesses } from "@/data/process";

gsap.registerPlugin(ScrollTrigger);

/**
 * ③ 공정 모션 — 짧은 고정 구간 하나 (2026-10-14 HOME 개편안).
 * 하나의 유리병이 가상의 "공정 게이트"를 통과한다: 빛줄기가 병을 가로질러 지나가면 그 뒤로 새 표면이 드러나고(마스킹),
 * 유리 위로 하이라이트가 흐른다. 코팅 → 인쇄 → 부식 → 라벨을 한 번의 연속 모션으로 보여 준 뒤
 * 스포이드 · 캡이 맞물리고, 완성된 병이 실제 제품들 사이로 확장된다.
 *
 * - 각 공정은 독립된 긴 화면이 아니라 스크롤 약 0.4화면씩.
 * - 후가공 이미지는 생성 예시 — 안내 문구를 표시한다.
 * - 스포이드 없는 병 이미지를 받기 전까지 체결은 "옆에서 다가와 캡 자리에 맞물림"으로 표현한다.
 */
export function ProcessMotion() {
  const sectionRef = useRef<HTMLElement>(null);
  const steps = finishingProcesses;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduce: "(prefers-reduced-motion: reduce)",
        desktop: "(min-width: 1024px)",
      },
      (context) => {
        const q = gsap.utils.selector(section);
        const wrap = q("[data-stage-wrap]")[0];
        const stage = q("[data-stage]")[0];
        const layers = q("[data-layer]");
        const gate = q("[data-gate]")[0];
        const gateTag = q("[data-gate-tag]");
        const dropper = q("[data-dropper]")[0];
        const pulse = q("[data-pulse]")[0];
        const items = q("[data-step]");
        const bar = q("[data-bar]")[0];
        const panel = q("[data-panel]")[0];
        const expand = q("[data-expand]");

        if (context.conditions?.reduce) {
          // 모션 줄이기: 마지막 표면(라벨)과 목록만 정지 상태로
          gsap.set(layers, { clipPath: "inset(0% 0% 0% 0%)" });
          gsap.set([gate, dropper, pulse, ...expand], { autoAlpha: 0 });
          return;
        }

        const desktop = Boolean(context.conditions?.desktop);
        gsap.set(layers, { clipPath: "inset(0% 82% 0% 0%)" });
        gsap.set(gate, { left: "18%", autoAlpha: 0 });
        gsap.set(gateTag, { autoAlpha: 0 });
        gsap.set(dropper, { xPercent: 70, yPercent: -4, autoAlpha: 0 });
        gsap.set(pulse, { scale: 0.4, autoAlpha: 0 });
        gsap.set(items, { color: "var(--color-ash)" });
        gsap.set(bar, { scaleY: 0, transformOrigin: "top center" });
        gsap.set(expand, { autoAlpha: 0, y: 40 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${window.innerHeight * (desktop ? 2.2 : 1.7)}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        if (process.env.NODE_ENV === "development") (window as unknown as Record<string, unknown>).__yyProcess = tl;

        // 병 등장
        tl.from(stage, { y: 50, autoAlpha: 0, duration: 0.5, ease: "power2.out" }, 0).from(panel, { y: 30, autoAlpha: 0, duration: 0.5 }, 0.1);

        // 공정 게이트 4회 통과
        const SWEEP = 0.75;
        layers.forEach((layer, i) => {
          const at = 0.7 + i * 0.85;
          tl.set(gate, { left: "18%" }, at)
            .to(gate, { autoAlpha: 1, duration: 0.08 }, at)
            .to(gateTag[i], { autoAlpha: 1, duration: 0.1 }, at)
            .to(gate, { left: "82%", duration: SWEEP, ease: "power1.inOut" }, at)
            .to(layer, { clipPath: "inset(0% 18% 0% 0%)", duration: SWEEP, ease: "power1.inOut" }, at)
            .set(layer, { clipPath: "inset(0% 0% 0% 0%)" }, at + SWEEP)
            .to(gate, { autoAlpha: 0, duration: 0.08 }, at + SWEEP - 0.04)
            .to(gateTag[i], { autoAlpha: 0, duration: 0.08 }, at + SWEEP - 0.04)
            .to(items[i], { color: "var(--color-charcoal)", duration: 0.1 }, at)
            .to(bar, { scaleY: (i + 1) / (steps.length + 1), duration: SWEEP }, at);
          if (i > 0) tl.to(items[i - 1], { color: "var(--color-ash)", duration: 0.1 }, at);
          // 이전 표면은 새 표면이 다 덮은 뒤 숨김(겹침 방지)
          if (i > 0) tl.set(layers[i - 1], { autoAlpha: 0 }, at + SWEEP);
        });

        // 부자재 체결 — 스포이드가 옆에서 다가와 캡 자리에 맞물림
        const match = 0.7 + steps.length * 0.85 + 0.1;
        tl.to(items[steps.length - 1], { color: "var(--color-ash)", duration: 0.1 }, match)
          .to(items[steps.length], { color: "var(--color-charcoal)", duration: 0.1 }, match)
          .to(bar, { scaleY: 1, duration: 0.6 }, match)
          .to(dropper, { autoAlpha: 1, xPercent: 34, duration: 0.35, ease: "power2.out" }, match)
          .to(dropper, { xPercent: 0, yPercent: 0, duration: 0.35, ease: "power3.inOut" }, match + 0.4)
          .to(pulse, { autoAlpha: 1, scale: 1, duration: 0.12 }, match + 0.72)
          .to(pulse, { autoAlpha: 0, scale: 1.6, duration: 0.25 }, match + 0.84)
          .to(dropper, { autoAlpha: 0, duration: 0.2 }, match + 0.8);

        // 완성된 병 → 실제 제품들로 확장
        const grow = match + 1.15;
        tl.to(panel, { autoAlpha: 0, y: -20, duration: 0.35 }, grow)
          .to(
            wrap,
            {
              x: () => {
                const r = wrap.getBoundingClientRect();
                return window.innerWidth / 2 - (r.left + r.width / 2 - (gsap.getProperty(wrap, "x") as number));
              },
              scale: desktop ? 0.7 : 0.62,
              duration: 0.7,
              ease: "power2.inOut",
            },
            grow,
          )
          .to(expand, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "power2.out" }, grow + 0.3)
          .to({}, { duration: 0.35 });
      },
      section,
    );

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} data-header-theme="light" aria-labelledby="process-motion-title" className="relative h-[100svh] min-h-[600px] overflow-hidden bg-paper">
      <div className="container-yy grid h-full grid-rows-[minmax(0,1fr)_auto] items-center gap-6 pb-8 pt-[calc(var(--header-h)+16px)] lg:grid-cols-12 lg:grid-rows-1 lg:gap-8 lg:pb-0">
        {/* 병 무대 */}
        <div data-stage-wrap className="relative flex h-full min-h-0 items-center justify-center lg:col-span-6">
          <div data-stage className="relative aspect-[9/16] h-[min(100%,72svh,760px)] max-w-full">
            {/* 실제 제품 확장 — 기준병 양옆 */}
            {processScene.expandTo.map((id, i) => (
              <div
                key={id}
                data-expand
                aria-hidden="true"
                className="absolute inset-x-0 bottom-[8%] flex h-[56%] items-end justify-center"
                style={{ transform: `translateX(${[-205, -105, 105, 205][i]}%)`, opacity: 0 }}
              >
                <AssetImage id={id} decorative className="h-full w-full object-contain object-bottom mix-blend-multiply" />
              </div>
            ))}

            <AssetImage id={processScene.base} priority className="absolute inset-0 size-full object-contain" />
            {processScene.layers.map((id) => (
              <AssetImage key={id} id={id} data-layer="" decorative className="absolute inset-0 size-full object-contain" />
            ))}

            {/* 체결되는 스포이드 — 기준병 캡과 같은 캔버스 좌표 */}
            <AssetImage id={processScene.dropper} data-dropper="" decorative className="absolute inset-0 size-full object-contain mix-blend-multiply" style={{ opacity: 0 }} />
            <span
              data-pulse
              aria-hidden="true"
              className="absolute left-1/2 top-[17%] size-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,200,68,0.55),rgba(255,200,68,0)_65%)]"
              style={{ opacity: 0 }}
            />

            {/* 공정 게이트: 가는 선 + 유리 위를 흐르는 하이라이트 + 공정 이름표 */}
            <div data-gate aria-hidden="true" className="pointer-events-none absolute inset-y-[3%] w-0" style={{ left: "18%", opacity: 0 }}>
              <span className="absolute inset-y-0 left-0 w-px bg-charcoal/60" />
              <span className="absolute inset-y-0 -left-[60px] w-[60px] bg-gradient-to-r from-transparent via-white/0 to-white/90 mix-blend-screen" />
              <span className="absolute inset-y-0 -left-[3px] w-[6px] bg-point-1225/50 blur-[3px]" />
              {steps.map((step) => (
                <span
                  key={step.key}
                  data-gate-tag
                  className="absolute -top-1 left-2 whitespace-nowrap bg-point-1225 px-2 py-1 font-en text-[10px] font-semibold tracking-[0.14em] text-charcoal"
                  style={{ opacity: 0 }}
                >
                  {step.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 공정 목록 */}
        <div data-panel className="relative lg:col-span-5 lg:col-start-8">
          <h2 id="process-motion-title" className="font-en text-[clamp(13px,1vw,14px)] font-medium tracking-[0.14em] text-ash uppercase">
            Finishing
          </h2>
          <div className="relative mt-5 pl-5 lg:mt-8">
            <span className="absolute inset-y-0 left-0 w-px bg-stone" aria-hidden="true" />
            <span data-bar className="absolute inset-y-0 left-0 w-[2px] bg-point-4008" aria-hidden="true" />
            <ol className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-5 lg:grid-cols-1 lg:gap-y-5">
              {steps.map((step) => (
                <li key={step.key} data-step className="text-ash">
                  <p className="font-en text-[clamp(18px,2.2vw,30px)] leading-none font-extrabold tracking-[-0.025em]">{step.name}</p>
                  <p className="mt-1.5 hidden text-[14px] lg:block">{step.line}</p>
                </li>
              ))}
              <li data-step className="text-ash">
                <p className="font-en text-[clamp(18px,2.2vw,30px)] leading-none font-extrabold tracking-[-0.025em]">MATCH</p>
                <p className="mt-1.5 hidden text-[14px] lg:block">스포이드 · 캡 체결</p>
              </li>
            </ol>
          </div>
          <p className="mt-6 max-w-[36ch] text-[12px] leading-snug text-ash lg:mt-10">{exampleNotice}</p>
          <Link href="/process" className="link-en mt-2 hidden lg:inline-flex">
            PROCESS →
          </Link>
        </div>
      </div>
    </section>
  );
}
