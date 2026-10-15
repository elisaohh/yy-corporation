"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { Reveal } from "@/components/motion/Reveal";

gsap.registerPlugin(ScrollTrigger);

/**
 * ONE-STOP SYSTEM — 왼쪽 글 · 오른쪽 사진 구성(이전 배치) + 항목마다 다른 겹침 배치.
 * 사진은 원본 비율 그대로(자르지 않음) 두 장을 겹쳐 놓고, 스크롤할 때 앞 사진이 조금 더 빨리 움직여 깊이감을 준다.
 * 사진: 자료/02_후가공/작업사진/{glass,surface,delivery}-NN → scripts/build-onestop-photos.mjs
 * 현장 사진은 각 공정의 실제 증빙 사진으로 단정하지 않는다.
 */
type Placed = {
  src: string;
  /** 원본 가로 · 세로 (비율 유지용) */
  w: number;
  h: number;
  /** 배치 — 사진 영역 폭 대비 % (top도 폭 기준) */
  left: number;
  top: number;
  width: number;
  /** 스크롤 시 이동량(px, 음수 = 위로 더 빨리) */
  shift: number;
};

const BASE = "/assets/process/onestop";
const sections: { title: string; en: string; description: string; height: number; photos: Placed[] }[] = [
  {
    title: "유리 성형",
    en: "GLASS FORMING",
    description: "협력 제조사의 자동화 성형 라인에서 균일한 품질의 유리 용기를 생산합니다.",
    // 왼쪽 위 큰 사진 + 오른쪽 아래로 겹치는 작은 사진
    height: 62,
    photos: [
      { src: `${BASE}/glass-01.webp`, w: 960, h: 720, left: 0, top: 0, width: 70, shift: 0 },
      { src: `${BASE}/glass-02.webp`, w: 960, h: 720, left: 52, top: 23, width: 48, shift: -24 },
    ],
  },
  {
    title: "후가공",
    en: "SURFACE FINISHING",
    description: "코팅·인쇄·부식·라벨 등 다양한 후가공을 통해 브랜드에 맞는 색상과 표면 질감을 구현합니다.",
    // 가로 사진 위에 세로 사진이 오른쪽에서 걸쳐 올라옴
    height: 62,
    photos: [
      { src: `${BASE}/surface-01.webp`, w: 960, h: 720, left: 0, top: 9, width: 68, shift: 0 },
      { src: `${BASE}/surface-02.webp`, w: 721, h: 961, left: 64, top: 0, width: 36, shift: -24 },
    ],
  },
  {
    title: "입고 및 납품",
    en: "DELIVERY",
    description: "생산 일정과 품질을 확인하고, 입고부터 최종 납품까지 체계적으로 관리합니다.",
    // 오른쪽 큰 사진 + 왼쪽 아래에서 겹치는 사진
    height: 62,
    photos: [
      { src: `${BASE}/delivery-01.webp`, w: 960, h: 720, left: 26, top: 0, width: 74, shift: 0 },
      { src: `${BASE}/delivery-02.webp`, w: 960, h: 720, left: 0, top: 22, width: 46, shift: -24 },
    ],
  },
];

export function OneStopSystem() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("[data-shift]", section).forEach((el) => {
        const shift = Number(el.dataset.shift);
        if (!shift) return;
        gsap.fromTo(
          el,
          { y: -shift / 2 },
          { y: shift / 2, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: 0.6 } },
        );
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} data-header-theme="light" aria-labelledby="one-stop-title" className="bg-paper py-24 md:py-36">
      <div className="container-yy">
        <div className="mb-14 md:mb-20">
          <p className="label-en text-ash">PRODUCTION NETWORK</p>
          <h2 id="one-stop-title" className="mt-4 font-en text-[clamp(38px,5vw,68px)] font-extrabold leading-[1] tracking-[-0.045em] text-charcoal">ONE-STOP SYSTEM</h2>
          <p className="mt-5 max-w-[50ch] text-[15px] leading-[1.8] text-ash">용기 생산부터 후가공, 입고와 납품까지 연결되는 생산 네트워크를 소개합니다.</p>
        </div>

        <div className="border-t border-stone">
          {sections.map((item, i) => (
            <article key={item.en} className="grid gap-10 border-b border-stone py-12 md:grid-cols-12 md:gap-10 md:py-20">
              <Reveal className="md:col-span-4 md:pt-3">
                <p className="font-en text-[12px] tracking-[0.12em] text-ash">
                  {String(i + 1).padStart(2, "0")} / 03 — {item.en}
                </p>
                <h3 className="mt-5 text-[clamp(28px,3vw,44px)] font-bold tracking-[-0.035em] text-charcoal">{item.title}</h3>
                <p className="mt-4 max-w-[35ch] text-[16px] leading-[1.8] text-ash">{item.description}</p>
              </Reveal>

              {/* 겹침 배치 — 위치 · 크기는 사진 영역 폭 대비 % */}
              <Reveal delay={120} className="md:col-span-8">
                {/* 높이는 자기 폭 기준(aspect-ratio). 노트북처럼 낮은 화면에서도 한 화면에 들어오도록 폭을 화면 높이로도 제한 */}
                <div className="relative ml-auto w-full md:w-[min(72%,calc((100svh-280px)*1.6))]" style={{ aspectRatio: `100 / ${item.height}` }}>
                  {item.photos.map((p, k) => (
                    <div
                      key={p.src}
                      data-shift={p.shift}
                      className={`absolute overflow-hidden bg-card ${k > 0 ? "z-10 shadow-[0_24px_60px_-28px_rgba(43,43,42,0.45)] ring-[6px] ring-paper md:ring-8" : ""}`}
                      style={{ left: `${p.left}%`, top: `${(p.top / item.height) * 100}%`, width: `${p.width}%`, aspectRatio: `${p.w} / ${p.h}` }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- 현장 사진 웹 사본 */}
                      <img src={p.src} alt="" width={p.w} height={p.h} loading="lazy" className="size-full object-cover" />
                    </div>
                  ))}
                </div>
              </Reveal>
            </article>
          ))}
        </div>

        <p className="mt-8 text-[12px] leading-[1.7] text-ash">현장 사진은 생산 및 관리 환경을 보여주는 참고 자료이며, 각 항목의 실제 작업 장면을 의미하지 않습니다.</p>
      </div>
    </section>
  );
}
