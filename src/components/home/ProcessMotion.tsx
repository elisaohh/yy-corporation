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
 * 공정 스크롤 모션: 코팅 → 인쇄 → 부식 → 라벨 → MATCH.
 * 완료 후 제품 이미지 확장 없이 다음 PRODUCT 섹션으로 이어진다.
 */

/** 유리 피펫 불투명도 — 낮을수록 유리처럼 비친다(2026-10-15 요청) */

const PIPETTE_OPACITY = 0.28;



/** 라벨 구간(캔버스 높이 %)에서 피펫을 가리는 마스크 */

const PIPETTE_MASK = `linear-gradient(to bottom, #000 0%, #000 ${processScene.labelBand.top}%, transparent ${processScene.labelBand.top}%, transparent ${processScene.labelBand.bottom}%, #000 ${processScene.labelBand.bottom}%)`;

export function ProcessMotion() {

  const sectionRef = useRef<HTMLElement>(null);
  /** 공정 이름을 누르면 해당 단계로 이동할 때 쓰는 타임라인 */
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  /** 모바일(1024px 미만): 스크롤 고정 대신 공정 이름을 누르면 그 장면으로 재생(2026-10-19) */
  const tapMode = useRef(false);

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


        const stage = q("[data-stage]")[0];

        const layers = q("[data-layer]");

        const gate = q("[data-gate]")[0];

        const gateTag = q("[data-gate-tag]");

        const glow = q("[data-gate-glow]")[0];

        const core = q("[data-gate-core]")[0];

        const drop = q("[data-drop]");

        const pulse = q("[data-pulse]")[0];

        const items = q("[data-step]");

        const bar = q("[data-bar]")[0];

        const panel = q("[data-panel]")[0];



        if (context.conditions?.reduce) {

          // 모션 줄이기: 라벨 표면 + 체결된 스포이드, 목록만 정지 상태로

          gsap.set(layers, { clipPath: "inset(0% 0% 0% 0%)" });

          gsap.set([gate, pulse], { autoAlpha: 0 });

          gsap.set(drop, { autoAlpha: 1, yPercent: 0 });

          return;

        }

        const desktop = Boolean(context.conditions?.desktop);

        gsap.set(layers, { clipPath: "inset(0% 100% 0% 0%)" });

        gsap.set(gate, { left: "0%", autoAlpha: 0 });

        gsap.set(gateTag, { autoAlpha: 0 });

        gsap.set(glow, { opacity: 0, scaleX: 0.75, transformOrigin: "right center" });

        gsap.set(core, { opacity: 0 });

        gsap.set(drop, { yPercent: -42, autoAlpha: 0 });

        gsap.set(pulse, { scale: 0.5, autoAlpha: 0 });

        gsap.set(items, { color: "var(--color-ash)" });

        gsap.set(bar, { scaleY: 0, transformOrigin: "top center" });


        // 스크롤 위치와 타임라인을 양방향으로 연결한다.

        // 휠/터치 입력을 가로채지 않으므로 역스크롤도 자연스럽게 복원된다.

        // 모바일: 고정 · 스크롤 연결 없이 멈춘 타임라인 — 공정 이름을 누르면 그 장면까지 재생(goTo)
        tapMode.current = !desktop;
        const tl = gsap.timeline({

          defaults: { ease: "none" },
          paused: !desktop,

          scrollTrigger: !desktop ? undefined : {

            trigger: section,

            start: "top top",

            end: () => `+=${window.innerHeight * (desktop ? 4.4 : 3.6)}`,

            pin: true,

            scrub: 0.8,
            // 공정 하나가 끝난 자리마다 부드럽게 멈춘다 — 어중간한 중간 장면에서 멈추지 않게
            snap: { snapTo: "labelsDirectional", duration: { min: 0.35, max: 0.9 }, delay: 0.12, ease: "power2.inOut" },

            anticipatePin: 1,

            invalidateOnRefresh: true,

          },

        });

        if (process.env.NODE_ENV === "development")

          (window as unknown as Record<string, unknown>).__yyProcess = tl;
        tlRef.current = tl;
        tl.addLabel("start", 0);



        // 병 등장

        // 병 · 목록은 섹션이 화면에 들어오는 동안(고정 전) 미리 나타난다 — 고정 직전 빈 화면이 생기지 않게
        gsap.from([stage, panel], {
          y: 50,
          autoAlpha: 0,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 85%", end: "top 25%", scrub: 0.6 },
        });
        tl.to({}, { duration: 0.6 }, 0); // 고정 시작 후 잠깐 머문 뒤 첫 공정

        // 공정 게이트 4회 통과 — 공정마다 짧은 머무름을 두어 표면 변화를 읽을 수 있게

        const SWEEP = 1.5;

        const STEP = 1.9;

        layers.forEach((layer, i) => {

          const at = 1.1 + i * STEP;

          tl.set(gate, { left: "0%" }, at - 0.2)

            .to(gate, { autoAlpha: 1, duration: 0.45, ease: "sine.out" }, at - 0.2)

            .to(glow, { opacity: 0.78, scaleX: 1, duration: 0.65, ease: "sine.out" }, at - 0.15)

            .to(core, { opacity: 0.35, duration: 0.5, ease: "sine.out" }, at - 0.15)

            .to(gateTag[i], { autoAlpha: 1, duration: 0.2 }, at - 0.15)

            .to(gate, { left: "100%", duration: SWEEP, ease: "none" }, at)

            .to(layer, { clipPath: "inset(0% 0% 0% 0%)", duration: SWEEP, ease: "none" }, at)

            .to(glow, { opacity: 0, scaleX: 1.15, duration: 0.55, ease: "sine.in" }, at + SWEEP - 0.5)

            .to(core, { opacity: 0, duration: 0.45, ease: "sine.in" }, at + SWEEP - 0.4)

            .to([gate, gateTag[i]], { autoAlpha: 0, duration: 0.4, ease: "sine.in" }, at + SWEEP - 0.25)

            .to(items[i], { color: "var(--color-charcoal)", duration: 0.35 }, at)

            .to(bar, { scaleY: (i + 1) / (steps.length + 1), duration: SWEEP, ease: "none" }, at);

          if (i > 0) tl.to(items[i - 1], { color: "var(--color-ash)", duration: 0.35 }, at);

          if (i > 0) tl.set(layers[i - 1], { autoAlpha: 0 }, at + SWEEP); // 이전 표면은 새 표면이 다 덮은 뒤 숨김
          tl.addLabel(`step${i}`, at + SWEEP + 0.15);

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

        // MATCH 완료 후 잠깐 완성된 병을 보여주고 다음 PRODUCT로 연결.
        // 마지막 화면을 별도로 오래 붙잡지 않고, 스크롤을 되돌리면 역재생된다.
        tl.addLabel(`step${steps.length}`, match + 1.95);
        if (desktop) {
          const finish = match + 2.1;
          tl.to(panel, { autoAlpha: 0, y: -12, duration: 0.55, ease: "sine.inOut" }, finish)
            .to(stage, { autoAlpha: 0, y: -22, duration: 0.7, ease: "sine.inOut" }, finish + 0.1)
            .addLabel("end");
        } else {
          // 모바일: 화면에 들어오면 첫 공정(COATING)까지 한 번 재생 — 이후는 누를 때마다
          ScrollTrigger.create({ trigger: stage, start: "top 65%", once: true, onEnter: () => tl.tweenTo("step0", { duration: 1.6, ease: "power2.inOut" }) });
        }


      },

      section,

    );

    return () => {
      tlRef.current = null;
      mm.revert();
    };
  }, []);

  /** 공정 이름 클릭 → 데스크톱: 그 공정이 끝난 장면으로 스크롤 / 모바일: 그 장면까지 재생(앞 · 뒤 모두) */
  const goTo = (i: number) => {
    const tl = tlRef.current;
    if (!tl) return;
    if (tapMode.current) {
      tl.tweenTo(`step${i}`, { duration: 1.4, ease: "power2.inOut" });
      return;
    }
    const st = tl.scrollTrigger;
    if (st) window.scrollTo({ top: st.labelToScroll(`step${i}`), behavior: "smooth" });
  };

  return (

    <section ref={sectionRef} data-header-theme="light" aria-labelledby="process-motion-title" className="relative h-[100svh] min-h-[600px] overflow-hidden bg-paper">

      <div className="container-yy grid h-full grid-rows-[minmax(0,1fr)_auto] items-center gap-6 pb-8 pt-[calc(var(--header-h)+16px)] lg:grid-cols-12 lg:grid-rows-1 lg:gap-8 lg:pb-0">

        {/* 병 무대 */}

        <div data-stage-wrap className="relative flex h-full min-h-0 items-center justify-center lg:col-span-6">

          <div data-stage className="relative aspect-[9/16] h-[min(100%,72svh,760px)] max-w-full">

            <AssetImage id={processScene.base} priority className="absolute inset-0 size-full object-contain" />

            {processScene.layers.map((id) => (

              <AssetImage key={id} id={id} data-layer="" decorative className="absolute inset-0 size-full object-contain" />

            ))}

            {/* 체결되는 스포이드 — 같은 캔버스 좌표. 피펫은 라벨 구간에서 가려진다(마스크는 움직이지 않는 바깥 상자에) */}

            <div

              aria-hidden="true"

              className="absolute inset-0"

              style={{ maskImage: PIPETTE_MASK, WebkitMaskImage: PIPETTE_MASK, opacity: PIPETTE_OPACITY }}

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

            <div data-gate aria-hidden="true" className="pointer-events-none absolute inset-y-[3%] w-0" style={{ left: "0%", opacity: 0 }}>

              {/* 밝은 배경에서도 과하지 않은 얇은 기준선 */}

              <span data-gate-core className="absolute inset-y-0 left-0 w-px bg-charcoal/40" style={{ opacity: 0 }} />

              {/* 선 뒤쪽으로 넓고 부드럽게 퍼지는 유리 반사광 */}

              <span

                data-gate-glow

                className="absolute inset-y-0 -left-[90px] w-[105px] pointer-events-none"

                style={{

                  opacity: 0,

                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 12%, rgba(255,255,255,0.40) 53%, rgba(255,255,255,0.76) 82%, rgba(255,255,255,0.16) 100%)",

                  filter: "blur(13px)",

                  mixBlendMode: "screen",

                }}

              />

              {/* 빛의 가장자리: 색 선 대신 아주 옅은 따뜻한 반사 */}

              <span

                className="absolute inset-y-[6%] -left-[10px] w-[20px] pointer-events-none"

                style={{

                  background: "radial-gradient(ellipse at center, rgba(255,226,166,0.22), transparent 72%)",

                  filter: "blur(8px)",

                }}

              />

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

              {steps.map((step, i) => (
                <li key={step.key} data-step className="text-ash">
                  <button type="button" onClick={() => goTo(i)} className="text-left transition-opacity hover:opacity-70">
                    <span className="block font-en text-[clamp(18px,2.2vw,30px)] leading-none font-extrabold tracking-[-0.025em]">{step.name}</span>
                    <span className="mt-1.5 hidden text-[14px] lg:block">{step.line}</span>
                  </button>
                </li>
              ))}

              <li data-step className="text-ash">
                <button type="button" onClick={() => goTo(steps.length)} className="text-left transition-opacity hover:opacity-70">
                  <span className="block font-en text-[clamp(18px,2.2vw,30px)] leading-none font-extrabold tracking-[-0.025em]">MATCH</span>
                  <span className="mt-1.5 hidden text-[14px] lg:block">스포이드 · 캡 체결</span>
                </button>
              </li>

            </ol>

          </div>

          <p className="mt-4 text-[13px] text-charcoal/70 lg:hidden">공정 이름을 누르면 표면이 바뀌어요.</p>
          <p className="mt-6 max-w-[36ch] text-[12px] leading-snug text-ash lg:mt-10">{exampleNotice}</p>

          <Link href="/process" className="link-en mt-2 hidden lg:inline-flex">

            PROCESS →

          </Link>

        </div>

      </div>

    </section>

  );

}
