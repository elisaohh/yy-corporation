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
 * - 각 공정은 독립된 긴 화면이 아니라 스크롤 약 0.45화면씩, 공정 사이 짧은 머무름.
 * - 후가공 이미지는 생성 예시 — 안내 문구를 표시한다.
 * - 체결: 스포이드 · 캡이 병 위에서 수직으로 내려와 목에 결합(살짝 눌렸다 자리 잡음).
 */
/** 확장 시 실제 제품 위치(무대 폭 대비 %) */
const EXPAND_X = [-205, -105, 105, 205];

/** 라벨 구간(캔버스 높이 %)에서 피펫을 가리는 마스크 */
const PIPETTE_MASK = `linear-gradient(to bottom, #000 0%, #000 ${processScene.labelBand.top}%, transparent ${processScene.labelBand.top}%, transparent ${processScene.labelBand.bottom}%, #000 ${processScene.labelBand.bottom}%)`;

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
        const drop = q("[data-drop]");
        const pulse = q("[data-pulse]")[0];
        const items = q("[data-step]");
        const bar = q("[data-bar]")[0];
        const panel = q("[data-panel]")[0];
        const expand = q("[data-expand]");

        expand.forEach((el, i) => gsap.set(el, { xPercent: EXPAND_X[i] ?? 0 }));

        if (context.conditions?.reduce) {
          // 모션 줄이기: 라벨 표면 + 체결된 스포이드, 목록만 정지 상태로
          gsap.set(layers, { clipPath: "inset(0% 0% 0% 0%)" });
          gsap.set([gate, pulse, ...expand], { autoAlpha: 0 });
          gsap.set(drop, { autoAlpha: 1, yPercent: 0 });
          return;
        }

        const desktop = Boolean(context.conditions?.desktop);
        gsap.set(layers, { clipPath: "inset(0% 82% 0% 0%)" });
        gsap.set(gate, { left: "18%", autoAlpha: 0 });
        gsap.set(gateTag, { autoAlpha: 0 });
        gsap.set(drop, { yPercent: -42, autoAlpha: 0 });
        gsap.set(pulse, { scale: 0.5, autoAlpha: 0 });
        gsap.set(items, { color: "var(--color-ash)" });
        gsap.set(bar, { scaleY: 0, transformOrigin: "top center" });
        gsap.set(expand, { autoAlpha: 0, y: 50 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${window.innerHeight * (desktop ? 3.4 : 2.6)}`,
            pin: true,
            scrub: 1.4, // 스크롤보다 약간 늦게 따라와 움직임이 부드럽다
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        if (process.env.NODE_ENV === "development") (window as unknown as Record<string, unknown>).__yyProcess = tl;

        // 병 등장
        tl.from(stage, { y: 70, autoAlpha: 0, duration: 0.8, ease: "power3.out" }, 0).from(panel, { y: 30, autoAlpha: 0, duration: 0.8, ease: "power2.out" }, 0.15);

        // 공정 게이트 4회 통과 — 공정마다 짧은 머무름을 두어 표면 변화를 읽을 수 있게
        const SWEEP = 1.15;
        const STEP = 1.5;
        layers.forEach((layer, i) => {
          const at = 1.1 + i * STEP;
          tl.set(gate, { left: "18%" }, at - 0.2)
            .to(gate, { autoAlpha: 1, duration: 0.2, ease: "power1.out" }, at - 0.2)
            .to(gateTag[i], { autoAlpha: 1, duration: 0.2 }, at - 0.15)
            .to(gate, { left: "82%", duration: SWEEP, ease: "sine.inOut" }, at)
            .to(layer, { clipPath: "inset(0% 18% 0% 0%)", duration: SWEEP, ease: "sine.inOut" }, at)
            .set(layer, { clipPath: "inset(0% 0% 0% 0%)" }, at + SWEEP)
            .to([gate, gateTag[i]], { autoAlpha: 0, duration: 0.2, ease: "power1.in" }, at + SWEEP - 0.1)
            .to(items[i], { color: "var(--color-charcoal)", duration: 0.35 }, at)
            .to(bar, { scaleY: (i + 1) / (steps.length + 1), duration: SWEEP, ease: "sine.inOut" }, at);
          if (i > 0) tl.to(items[i - 1], { color: "var(--color-ash)", duration: 0.35 }, at);
          if (i > 0) tl.set(layers[i - 1], { autoAlpha: 0 }, at + SWEEP); // 이전 표면은 새 표면이 다 덮은 뒤 숨김
        });

        // 부자재 체결 — 스포이드 · 캡이 병 위에서 수직으로 내려와 목에 결합
        const match = 1.1 + steps.length * STEP;
        tl.to(items[steps.length - 1], { color: "var(--color-ash)", duration: 0.35 }, match)
          .to(items[steps.length], { color: "var(--color-charcoal)", duration: 0.35 }, match)
          .to(bar, { scaleY: 1, duration: 1.2, ease: "sine.inOut" }, match)
          .to(drop, { autoAlpha: 1, duration: 0.35, ease: "power1.out" }, match)
          .to(drop, { yPercent: 0.9, duration: 1.3, ease: "power2.inOut" }, match + 0.15)
          .to(drop, { yPercent: 0, duration: 0.35, ease: "power2.out" }, match + 1.45)
          .to(pulse, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power1.out" }, match + 1.35)
          .to(pulse, { autoAlpha: 0, scale: 1.7, duration: 0.5, ease: "power1.in" }, match + 1.55);

        // 완성된 병 → 실제 제품들로 확장
        const grow = match + 2.2;
        tl.to(panel, { autoAlpha: 0, y: -20, duration: 0.5 }, grow)
          .to(
            wrap,
            {
              x: () => {
                const r = wrap.getBoundingClientRect();
                return window.innerWidth / 2 - (r.left + r.width / 2 - (gsap.getProperty(wrap, "x") as number));
              },
              scale: desktop ? 0.7 : 0.62,
              duration: 1.1,
              ease: "power2.inOut",
            },
            grow,
          )
          .to(expand, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "power2.out" }, grow + 0.45)
          .to({}, { duration: 0.6 });
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
            {processScene.expandTo.map((id) => (
              <div
                key={id}
                data-expand
                aria-hidden="true"
                className="absolute inset-x-0 bottom-[8%] flex h-[66%] items-end justify-center"
                style={{ opacity: 0 }}
              >
                <AssetImage id={id} decorative className="h-full w-full object-contain object-bottom mix-blend-multiply" />
              </div>
            ))}

            <AssetImage id={processScene.base} priority className="absolute inset-0 size-full object-contain" />
            {processScene.layers.map((id) => (
              <AssetImage key={id} id={id} data-layer="" decorative className="absolute inset-0 size-full object-contain" />
            ))}

            {/* 체결되는 스포이드 — 같은 캔버스 좌표. 피펫은 라벨 구간에서 가려진다(마스크는 움직이지 않는 바깥 상자에) */}
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ maskImage: PIPETTE_MASK, WebkitMaskImage: PIPETTE_MASK }}
            >
              <AssetImage id={processScene.dropperPipette} data-drop="" decorative className="absolute inset-0 size-full object-contain" style={{ opacity: 0 }} />
            </div>
            <AssetImage id={processScene.dropperCap} data-drop="" decorative className="absolute inset-0 size-full object-contain" style={{ opacity: 0 }} />
            <span
              data-pulse
              aria-hidden="true"
              className="absolute left-1/2 top-[34%] size-[44%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,200,68,0.55),rgba(255,200,68,0)_65%)]"
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
