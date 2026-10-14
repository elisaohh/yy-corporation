import type { ReactNode } from "react";

interface PageIntroProps {
  /** 큰 영문 페이지 타이틀 */
  title: string;
  /** 짧은 한글 소개 — 확정 전에는 Pending 표시를 넘긴다 */
  intro: ReactNode;
}

/** 서브페이지 공통 머리 영역: 큰 영문 타이틀 + 짧은 한글 소개 (기획서 2.0 부록 E·F) */
export function PageIntro({ title, intro }: PageIntroProps) {
  return (
    <section data-header-theme="light" className="container-yy pb-16 pt-[calc(var(--header-h)+72px)] md:pb-24 md:pt-[calc(var(--header-h)+120px)]">
      <h1 className="font-en text-[clamp(36px,4.6vw,64px)] leading-[1.05] font-light tracking-[0.06em] uppercase">{title}</h1>
      <div className="mt-6 max-w-[40ch] text-[clamp(16px,1.3vw,18px)] leading-[1.75] text-ash">{intro}</div>
    </section>
  );
}
