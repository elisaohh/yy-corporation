"use client";

import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { AssetImage } from "@/components/media/AssetImage";
import { processScene } from "@/data/home";
import { finishingProcesses } from "@/data/process";
import { isStill } from "@/lib/still";

gsap.registerPlugin(ScrollTrigger);

/**
 * 공정 스크롤 모션 v2: 부식 → 코팅(3가지) → 인쇄 → 라벨 → MATCH.
 * 장면마다 투명 병 + 그 공정 하나만 보여 준다(앞 공정을 덧입히지 않음).
 * - 각 공정의 첫 장면은 빛 막대가 훑으며 바뀐다.
 * - 코팅: 세 병이 원형 회전판처럼 앞뒤를 바꾸며 차례로 앞에 서고, 병 아래에 코팅 이름(GRADIENT 그라데이션 …)이 바뀐다.
 * - MATCH: 라벨 병 옆으로 인쇄 병이 나와 나란히 서고, 인쇄 병엔 스포이드 · 라벨 병엔 펌프가 동시에 끼워진 뒤 펌프에 덮개가 덮인다.
 * 이전 버전(코팅 → 인쇄 → 부식 → 라벨, 덧입히기)은 git 태그 process-motion-v1.
 */

/** 유리 너머로 비치는 피펫 · 빨대 불투명도 */
/** 피펫 · 빨대: 병 위로 내려오는 동안만 보이고, 병 어깨(캔버스 526/1600행) 아래로 들어간 부분은 가린다 */
const PIPETTE_OPACITY = 0.75;
const TUBE_OPACITY = 0.5;
const INSIDE_MASK = "linear-gradient(to bottom, #000 0%, #000 32.6%, transparent 32.6%)";

/** 회전판: 뒤 병의 좌우 거리(무대 폭 %) · 크기 · 높이 */
const ORBIT = { x: 40, backScale: 0.64, backY: -5 };
/** 부자재: 병 두 개의 좌우 거리(무대 폭 %) · 크기 */
const DUO = { x: 30, scale: 0.84 };

const steps = processScene.steps.map((s) => {
  const info = finishingProcesses.find((p) => p.key === s.key);
  return { key: s.key, name: info?.name ?? s.key.toUpperCase(), line: info?.line ?? "", layers: s.layers };
});
/** 장면 사진 전체(공정 순서대로) — 뒤 장면일수록 위에 놓인다 */
const allLayers = steps.flatMap((s, i) => s.layers.map((id, v) => ({ id, step: i, variant: v })));
const layerIndex = (step: number, variant: number) => allLayers.findIndex((l) => l.step === step && l.variant === variant);
/** 회전판으로 보여 줄 공정(코팅) */
const ORBIT_STEP = steps.findIndex((s) => s.layers.length > 1);
const MATCH = steps.length; // 목록에서 MATCH의 순서

export function ProcessMotion() {
  const sectionRef = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  /** 모바일(1024px 미만): 모션 없이 공정 이름을 누르면 그 장면으로 바뀐다. 코팅을 다시 누르면 회전판이 다음 병으로 */
  const showStep = useRef<((i: number) => void) | null>(null);

  // 깜빡임 방지: 처음엔 숨어 있는 장면 사진들이 나타나는 순간에야 받아지고 그려지면 한 박자 비어 보인다.
  // 섹션이 화면 두 칸 앞까지 오면 모든 사진을 미리 받아 그려 둔다.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const imgs = Array.from(section.querySelectorAll("img"));
    const warm = () => imgs.forEach((img) => {
      img.loading = "eager";
      img.decode?.().catch(() => {});
    });
    if (!("IntersectionObserver" in window)) {
      warm();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          warm();
          io.disconnect();
        }
      },
      { rootMargin: "200% 0px" },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

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
        const base = q("[data-base]")[0];
        const layers = q("[data-layer]");
        const orbit = q("[data-orbit]");
        const orbitWrap = q("[data-orbit-wrap]")[0];
        const duo = q("[data-duo]");
        const dropper = q("[data-dropper]");
        const pump = q("[data-pump]");
        const overcap = q("[data-overcap]")[0];
        const pulses = q("[data-pulse]");
        const gate = q("[data-gate]")[0];
        const gateTag = q("[data-gate-tag]");
        const glow = q("[data-gate-glow]")[0];
        const core = q("[data-gate-core]")[0];
        const items = q("[data-step]");
        const bar = q("[data-bar]")[0];
        const panel = q("[data-panel]")[0];
        const names = q("[data-orbit-name]");
        const duoNames = q("[data-duo-name]");
        const desktop = Boolean(context.conditions?.desktop);
        const reduce = Boolean(context.conditions?.reduce) || isStill();
        const ON = "var(--color-charcoal)";
        const total = steps.length + 1;

        /** 회전판 배치 — angle: 앞에 선 병(0 = 첫 병, 120 = 둘째 …), spread: 0이면 뒤 병이 앞 병 뒤에 숨음 */
        const placeOrbit = (angle: number, spread: number) => {
          orbit.forEach((el, k) => {
            const t = ((k * 120 - angle) * Math.PI) / 180;
            const depth = (Math.cos(t) + 1) / 2; // 1 = 맨 앞, 0 = 맨 뒤
            const scale = 1 - (1 - (ORBIT.backScale + (1 - ORBIT.backScale) * depth)) * spread;
            gsap.set(el, {
              xPercent: Math.sin(t) * ORBIT.x * spread,
              yPercent: ORBIT.backY * (1 - depth) * spread,
              scale,
              zIndex: Math.round(depth * 100),
              opacity: depth > 0.98 ? 1 : spread,
            });
          });
        };
        /** 회전판 상태(트윈용) */
        const orbitState = { angle: 0, spread: 0 };
        const renderOrbit = () => placeOrbit(orbitState.angle, orbitState.spread);

        /** 부자재 병 두 개 배치 — split 0: 가운데 한 병으로 겹침, 1: 좌우로 나뉨 */
        const duoState = { split: 0 };
        const renderDuo = () =>
          duo.forEach((el, k) =>
            gsap.set(el, { xPercent: (k === 0 ? -1 : 1) * DUO.x * duoState.split, scale: 1 - (1 - DUO.scale) * duoState.split }),
          );

        gsap.set(orbitWrap, { autoAlpha: 0 });
        gsap.set(duo, { autoAlpha: 0 });
        gsap.set(pulses, { autoAlpha: 0, scale: 0.5 });

        if (!desktop || reduce) {
          // 모바일 · 모션 줄이기: 스크롤 고정 없이 장면만 바꾼다
          const fade = reduce ? 0.2 : 0.5;
          gsap.set(layers, { clipPath: "inset(0% 0% 0% 0%)", autoAlpha: 0, zIndex: 1 });
          gsap.set([gate, ...gateTag], { autoAlpha: 0 });
          gsap.set([...dropper, ...pump, overcap], { yPercent: 0, autoAlpha: 1 });
          gsap.set(bar, { transformOrigin: "top center" });
          let current = -1;
          let orbitIndex = 0;
          const show = (i: number) => {
            if (i === ORBIT_STEP && current === ORBIT_STEP) orbitIndex = (orbitIndex + 1) % orbit.length;
            const surface = i === MATCH || i === ORBIT_STEP ? -1 : layerIndex(i, 0);
            const d = current < 0 ? 0 : fade;
            layers.forEach((layer, k) => {
              gsap.set(layer, { zIndex: k === surface ? 2 : 1 });
              if (k !== surface) gsap.to(layer, { autoAlpha: 0, duration: d, ease: "sine.out", overwrite: true });
            });
            if (surface >= 0) gsap.to(layers[surface], { autoAlpha: 1, duration: d, ease: "sine.out", overwrite: true });
            // 코팅: 회전판
            gsap.to(orbitWrap, { autoAlpha: i === ORBIT_STEP ? 1 : 0, duration: d, ease: "sine.out", overwrite: true });
            if (i === ORBIT_STEP) {
              gsap.to(orbitState, { angle: orbitIndex * 120, spread: 1, duration: current === ORBIT_STEP ? 1.4 : 0, ease: "power2.inOut", onUpdate: renderOrbit, overwrite: true });
              renderOrbit();
            }
            names.forEach((el, v) => gsap.to(el, { autoAlpha: i === ORBIT_STEP && v === orbitIndex ? 1 : 0, duration: d, overwrite: true }));
            // MATCH: 투명 병 두 개 + 부자재 체결된 모습
            duoState.split = 1;
            renderDuo();
            gsap.to([...duo, ...duoNames], { autoAlpha: i === MATCH ? 1 : 0, duration: d, ease: "sine.out", overwrite: true });
            gsap.to(base, { autoAlpha: i === MATCH || i === ORBIT_STEP ? 0 : 1, duration: d, ease: "sine.out", overwrite: true });
            items.forEach((el, k) => gsap.to(el, { color: k === i ? ON : "var(--color-ash)", duration: d, overwrite: true }));
            gsap.to(bar, { scaleY: (i + 1) / total, duration: d, ease: "sine.out", overwrite: true });
            current = i;
          };
          // 모션 줄이기(데스크톱): 완성된 부자재 장면을 보여 준다
          show(desktop ? MATCH : 0);
          showStep.current = show;
          return () => {
            showStep.current = null;
          };
        }

        gsap.set(layers, { clipPath: "inset(0% 100% 0% 0%)" });
        gsap.set(gate, { left: "0%", autoAlpha: 0 });
        gsap.set(gateTag, { autoAlpha: 0 });
        gsap.set(glow, { opacity: 0, scaleX: 0.75, transformOrigin: "right center" });
        gsap.set(core, { opacity: 0 });
        gsap.set([...dropper, ...pump], { yPercent: -42, autoAlpha: 0 });
        gsap.set(overcap, { yPercent: -30, autoAlpha: 0 });
        gsap.set(items, { color: "var(--color-ash)" });
        gsap.set([...names, ...duoNames], { autoAlpha: 0 });
        gsap.set(bar, { scaleY: 0, transformOrigin: "top center" });
        renderOrbit();
        renderDuo();

        // 스크롤 위치와 타임라인을 양방향으로 연결 — 역스크롤도 자연스럽게 되돌아간다
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${window.innerHeight * 7.6}`,
            pin: true,
            scrub: 0.8,
            // 장면 하나가 끝난 자리마다 부드럽게 멈춘다 — 어중간한 중간 장면에서 멈추지 않게
            snap: { snapTo: "labelsDirectional", duration: { min: 0.35, max: 0.9 }, delay: 0.12, ease: "power2.inOut" },
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        if (process.env.NODE_ENV === "development") (window as unknown as Record<string, unknown>).__yyProcess = tl;
        tlRef.current = tl;
        tl.addLabel("start", 0);

        // 병 · 목록은 섹션이 화면에 들어오는 동안(고정 전) 미리 나타난다
        gsap.from([stage, panel], {
          y: 50,
          autoAlpha: 0,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 85%", end: "top 25%", scrub: 0.6 },
        });
        tl.to({}, { duration: 0.6 }, 0); // 고정 시작 후 잠깐 머문 뒤 첫 공정

        const SWEEP = 1.5;
        const HOLD = 0.4; // 장면이 다 바뀐 뒤 머무는 시간
        const TURN = 2.2; // 회전판이 한 칸 도는 시간 — 천천히
        let at = 1.1;
        let prev = -1; // 지금 보이는 장면 사진
        steps.forEach((step, i) => {
          // ① 첫 장면: 빛 막대가 훑으며 바뀐다
          const first = layerIndex(i, 0);
          tl.set(gate, { left: "0%" }, at - 0.2)
            .to(gate, { autoAlpha: 1, duration: 0.45, ease: "sine.out" }, at - 0.2)
            .to(glow, { opacity: 0.78, scaleX: 1, duration: 0.65, ease: "sine.out" }, at - 0.15)
            .to(core, { opacity: 0.35, duration: 0.5, ease: "sine.out" }, at - 0.15)
            .to(gateTag[i], { autoAlpha: 1, duration: 0.2 }, at - 0.15)
            .to(gate, { left: "100%", duration: SWEEP, ease: "none" }, at)
            .to(layers[first], { clipPath: "inset(0% 0% 0% 0%)", duration: SWEEP, ease: "none" }, at)
            .to(glow, { opacity: 0, scaleX: 1.15, duration: 0.55, ease: "sine.in" }, at + SWEEP - 0.5)
            .to(core, { opacity: 0, duration: 0.45, ease: "sine.in" }, at + SWEEP - 0.4)
            .to([gate, gateTag[i]], { autoAlpha: 0, duration: 0.4, ease: "sine.in" }, at + SWEEP - 0.25)
            .to(items[i], { color: ON, duration: 0.35 }, at)
            .to(bar, { scaleY: (i + 1) / total, duration: SWEEP, ease: "none" }, at);
          if (i > 0) tl.to(items[i - 1], { color: "var(--color-ash)", duration: 0.35 }, at);
          if (prev >= 0) tl.set(layers[prev], { autoAlpha: 0 }, at + SWEEP); // 이전 장면은 새 장면이 다 덮은 뒤 숨김
          prev = first;
          at += SWEEP;
          tl.addLabel(`step${i}`, at + 0.15);
          at += HOLD;

          if (i !== ORBIT_STEP) {
            at += 0.1;
            return;
          }
          // ② 코팅 회전판: 같은 자리의 첫 병으로 바꿔 끼운 뒤, 뒤 병 두 개가 좌우 뒤로 펼쳐진다
          tl.set(orbitWrap, { autoAlpha: 1 }, at)
            .set([layers[first], base], { autoAlpha: 0 }, at + 0.01)
            .to(orbitState, { spread: 1, duration: 1.2, ease: "power2.out", onUpdate: renderOrbit }, at)
            .to(names[0], { autoAlpha: 1, duration: 0.5 }, at + 0.3);
          at += 1.2;
          // 한 칸씩 돌며 다음 병이 앞으로
          for (let v = 1; v < orbit.length; v++) {
            tl.to(orbitState, { angle: v * 120, duration: TURN, ease: "power2.inOut", onUpdate: renderOrbit }, at)
              .to(names[v - 1], { autoAlpha: 0, duration: 0.4 }, at + TURN / 2 - 0.4)
              .to(names[v], { autoAlpha: 1, duration: 0.5 }, at + TURN / 2);
            at += TURN;
            tl.addLabel(`step${i}-${v}`, at + 0.15);
            at += HOLD;
          }
          // 뒤 병이 다시 앞 병 뒤로 모이고, 마지막 병(사진 한 장)으로 바꿔 끼운다 — 다음 공정이 그 위를 훑는다
          const last = layerIndex(i, step.layers.length - 1);
          tl.to(orbitState, { spread: 0, duration: 0.7, ease: "power2.in", onUpdate: renderOrbit }, at).to(names[orbit.length - 1], { autoAlpha: 0, duration: 0.4 }, at);
          at += 0.7;
          tl.set(layers[last], { clipPath: "inset(0% 0% 0% 0%)", autoAlpha: 1 }, at)
            .set(base, { autoAlpha: 1 }, at)
            .set(orbitWrap, { autoAlpha: 0 }, at + 0.01);
          prev = last;
          at += 0.3;
        });

        // ③ MATCH — 라벨 병은 그 자리에 남고, 왼쪽으로 인쇄 병이 나와 두 병이 나란히 → 스포이드(인쇄 병) · 펌프(라벨 병)가 동시에 끼워짐 → 펌프에 덮개
        tl.to(items[MATCH - 1], { color: "var(--color-ash)", duration: 0.35 }, at)
          .to(items[MATCH], { color: ON, duration: 0.35 }, at)
          .to(bar, { scaleY: 1, duration: 1.2, ease: "sine.inOut" }, at)
          // 같은 자리 · 같은 사진(라벨 병)으로 바꿔 끼운다 — 화면은 그대로
          .set(duo[1], { autoAlpha: 1 }, at)
          .set(duo[0], { autoAlpha: 0 }, at)
          .set([layers[prev], base], { autoAlpha: 0 }, at + 0.01)
          .to(duoState, { split: 1, duration: 1.2, ease: "power2.inOut", onUpdate: renderDuo }, at + 0.1)
          .to(duo[0], { autoAlpha: 1, duration: 0.8, ease: "sine.out" }, at + 0.3);
        at += 1.3;
        const parts = [...dropper, ...pump];
        tl.to(parts, { autoAlpha: 1, duration: 0.35, ease: "power1.out" }, at)
          .to(parts, { yPercent: 0.9, duration: 1.3, ease: "power2.inOut" }, at + 0.15)
          .to(parts, { yPercent: 0, duration: 0.35, ease: "power2.out" }, at + 1.45)
          .to(pulses, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "power1.out" }, at + 1.35)
          .to(pulses, { autoAlpha: 0, scale: 1.7, duration: 0.5, ease: "power1.in" }, at + 1.55)
          .to(duoNames, { autoAlpha: 1, duration: 0.5, stagger: 0.1 }, at + 1.45);
        at += 1.9;
        tl.to(overcap, { autoAlpha: 1, duration: 0.3, ease: "power1.out" }, at).to(overcap, { yPercent: 0, duration: 0.9, ease: "power2.out" }, at + 0.1);
        at += 1.1;
        tl.addLabel(`step${MATCH}`, at);

        // 완성된 병을 잠깐 보여 주고 다음 PRODUCT로 연결
        const finish = at + 0.3;
        tl.to(panel, { autoAlpha: 0, y: -12, duration: 0.55, ease: "sine.inOut" }, finish)
          .to(stage, { autoAlpha: 0, y: -22, duration: 0.7, ease: "sine.inOut" }, finish + 0.1)
          .addLabel("end");
      },
      section,
    );
    return () => {
      tlRef.current = null;
      mm.revert();
    };
  }, []);

  /** 공정 이름 클릭 → 데스크톱: 그 공정 첫 장면으로 스크롤 / 모바일: 그 장면으로 바꿈 */
  const goTo = (i: number) => {
    if (showStep.current) {
      showStep.current(i);
      return;
    }
    const st = tlRef.current?.scrollTrigger;
    if (st) window.scrollTo({ top: st.labelToScroll(`step${i}`), behavior: "smooth" });
  };

  const fill = "absolute inset-0 size-full object-contain";
  const stepName = "block font-en text-[clamp(18px,2.2vw,30px)] leading-none font-extrabold tracking-[-0.025em]";

  return (
    <section ref={sectionRef} data-header-theme="light" aria-labelledby="process-motion-title" className="relative h-[100svh] min-h-[600px] overflow-hidden bg-paper">
      <div className="container-yy grid h-full grid-rows-[minmax(0,1fr)_auto] items-center gap-6 pb-8 pt-[calc(var(--header-h)+16px)] lg:grid-cols-12 lg:grid-rows-1 lg:gap-8 lg:pb-0">
        {/* 병 무대 */}
        <div data-stage-wrap className="relative flex h-full min-h-0 items-center justify-center lg:col-span-6">
          <div data-stage className="relative aspect-[9/16] h-[min(100%,72svh,760px)] max-w-full">
            <AssetImage id={processScene.base} data-base="" priority className={fill} />
            {allLayers.map((l) => (
              <AssetImage key={l.id} id={l.id} data-layer="" decorative className={fill} />
            ))}

            {/* 코팅 회전판 — 배경을 오려 낸 병 세 개 */}
            <div data-orbit-wrap aria-hidden="true" className="absolute inset-0 z-[3]" style={{ opacity: 0 }}>
              {processScene.orbit.map((id) => (
                <AssetImage key={id} id={id} data-orbit="" decorative className={fill} />
              ))}
            </div>
            {/* 코팅 이름 — 앞에 선 병 아래 */}
            <p className="pointer-events-none absolute inset-x-0 bottom-[2%] z-[4] h-6 text-center" aria-live="polite">
              {processScene.orbitNames.map((n) => (
                <span key={n.en} data-orbit-name="" className="absolute inset-x-0 top-0 whitespace-nowrap" style={{ opacity: 0 }}>
                  <span className="font-en text-[13px] font-semibold tracking-[0.16em] text-charcoal">{n.en}</span>
                  <span className="ml-2 text-[13px] text-ash">{n.ko}</span>
                </span>
              ))}
            </p>

            {/* 부자재 이름 — 병 두 개 아래(병과 같은 거리만큼 좌우로) */}
            {processScene.duoNames.map((n, k) => (
              <p
                key={n.en}
                data-duo-name=""
                className="pointer-events-none absolute inset-x-0 bottom-[10%] z-[4] whitespace-nowrap text-center"
                style={{ opacity: 0, transform: `translateX(${(k === 0 ? -1 : 1) * DUO.x}%)` }}
              >
                <span className="font-en text-[13px] font-semibold tracking-[0.16em] text-charcoal">{n.en}</span>
                <span className="ml-2 text-[13px] text-ash">{n.ko}</span>
              </p>
            ))}
            {/* 부자재: 투명 병 두 개 — 왼쪽 스포이드 · 오른쪽 펌프 */}
            {(["dropper", "pump"] as const).map((kind, k) => (
              <div key={kind} data-duo="" aria-hidden="true" className="absolute inset-0 z-[3]" style={{ opacity: 0 }}>
                <AssetImage id={processScene.duoBottles[k]} decorative className={fill} />
                <div
                  className="absolute inset-0"
                  style={{ opacity: kind === "dropper" ? PIPETTE_OPACITY : TUBE_OPACITY, maskImage: INSIDE_MASK, WebkitMaskImage: INSIDE_MASK }}
                >
                  {kind === "dropper" ? (
                    <AssetImage id={processScene.dropperPipette} data-dropper="" decorative className={fill} style={{ opacity: 0 }} />
                  ) : (
                    <AssetImage id={processScene.pumpTube} data-pump="" decorative className={fill} style={{ opacity: 0 }} />
                  )}
                </div>
                {kind === "dropper" ? (
                  <AssetImage id={processScene.dropperCap} data-dropper="" decorative className={fill} style={{ opacity: 0 }} />
                ) : (
                  <>
                    <AssetImage id={processScene.pumpHead} data-pump="" decorative className={fill} style={{ opacity: 0 }} />
                    <AssetImage id={processScene.pumpOvercap} data-overcap="" decorative className={fill} style={{ opacity: 0 }} />
                  </>
                )}
                <span
                  data-pulse
                  className="absolute left-1/2 top-[30%] size-[44%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,200,68,0.55),rgba(255,200,68,0)_65%)]"
                  style={{ opacity: 0 }}
                />
              </div>
            ))}

            {/* 공정 게이트: 가는 선 + 유리 위를 흐르는 하이라이트 + 공정 이름표 */}
            <div data-gate aria-hidden="true" className="pointer-events-none absolute inset-y-[3%] z-[4] w-0" style={{ left: "0%", opacity: 0 }}>
              <span data-gate-core className="absolute inset-y-0 left-0 w-px bg-charcoal/40" style={{ opacity: 0 }} />
              <span
                data-gate-glow
                className="pointer-events-none absolute inset-y-0 -left-[90px] w-[105px]"
                style={{
                  opacity: 0,
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 12%, rgba(255,255,255,0.40) 53%, rgba(255,255,255,0.76) 82%, rgba(255,255,255,0.16) 100%)",
                  filter: "blur(13px)",
                  mixBlendMode: "screen",
                }}
              />
              <span
                className="pointer-events-none absolute inset-y-[6%] -left-[10px] w-[20px]"
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
                    <span className={stepName}>{step.name}</span>
                    <span className="mt-1.5 hidden text-[14px] lg:block">{step.line}</span>
                  </button>
                </li>
              ))}
              <li data-step className="text-ash">
                <button type="button" onClick={() => goTo(MATCH)} className="text-left transition-opacity hover:opacity-70">
                  <span className={stepName}>{processScene.match.name}</span>
                  <span className="mt-1.5 hidden text-[14px] lg:block">{processScene.match.line}</span>
                </button>
              </li>
            </ol>
          </div>
          <Link href="/process" className="link-en mt-10 hidden lg:inline-flex">
            PROCESS →
          </Link>
        </div>
      </div>
    </section>
  );
}
