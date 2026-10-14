"use client";

import { Handshake, FlaskConical, Paintbrush, ClipboardCheck, BadgeCheck, CalendarCheck, Factory, SearchCheck, Truck } from "lucide-react";

const steps = [
  { title: "고객사 미팅", detail: "", Icon: Handshake },
  { title: "용기 선택", detail: "용량 · 사용성 체크", Icon: FlaskConical },
  { title: "후가공 샘플 진행", detail: "", Icon: Paintbrush },
  { title: "CT 테스트", detail: "", Icon: ClipboardCheck },
  { title: "작업 견본", detail: "", Icon: BadgeCheck },
  { title: "일정 체크", detail: "", Icon: CalendarCheck },
  { title: "양산 및 감리", detail: "", Icon: Factory },
  { title: "표준 견본", detail: "품질 확인", Icon: SearchCheck },
  { title: "입고 및 납품", detail: "", Icon: Truck },
];

// 모든 좌표는 동일한 1000×480 SVG 좌표계에서 계산합니다.
// 점선·동그라미가 가로로 늘어나지 않도록 preserveAspectRatio="xMidYMid meet" 사용.
const topXs = [100, 320, 540, 760];
const bottomXs = [760, 540, 320, 100];
const nodes = [
  ...topXs.map((x, i) => ({ x, y: 182, ...steps[i] })),
  { x: 950, y: 265, ...steps[4] },
  ...bottomXs.map((x, i) => ({ x, y: 348, ...steps[i + 5] })),
];

export function ProcessFlow() {
  return (
    <section data-header-theme="light" aria-labelledby="process-flow-title" className="bg-paper py-24 md:py-32">
      <div className="container-yy">
        <div className="mb-12 flex flex-col gap-5 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-en text-[12px] tracking-[0.18em] text-ash">HOW WE WORK</p>
            <h2 id="process-flow-title" className="mt-4 font-en text-[clamp(40px,5.5vw,76px)] font-extrabold leading-none tracking-[-0.05em] text-charcoal">From Idea to Delivery.</h2>
          </div>
          <p className="max-w-[35ch] text-[15px] leading-[1.8] text-ash">상담부터 용기 선택, 샘플과 품질 확인, 납품까지의 진행 흐름을 소개합니다.</p>
        </div>
        {/* 모바일: 간결한 순서형. 데스크톱과 동일한 9단계 */}
        <ol className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:hidden">
          {steps.map(({ title, detail, Icon }, i) => (
            <li key={title} className="border-t border-stone pt-5">
              <div className="flex items-start justify-between"><Icon className="size-9 text-charcoal" strokeWidth={1.5} aria-hidden="true" /><span className="font-en text-[11px] text-ash">{String(i + 1).padStart(2, "0")}</span></div>
              <p className="mt-5 text-[14px] font-semibold text-charcoal">{title}</p>
              {detail && <p className="mt-1 text-[12px] text-ash">{detail}</p>}
            </li>
          ))}
        </ol>
        <div className="hidden lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element -- 비율 고정 인포그래픽 */}
          <img src="/assets/process/process-flow.png" alt="고객사 미팅 → 용기 선택 → 후가공 샘플 진행 → CT 테스트 → 작업 견본 → 일정 체크 → 양산 및 감리 → 표준 견본 → 입고 및 납품" className="block h-auto w-full" />
        </div>
      </div>
    </section>
  );
}
