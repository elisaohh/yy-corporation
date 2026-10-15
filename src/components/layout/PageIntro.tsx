import type { ReactNode } from "react";

/**
 * 머리 영역 배경(2026-10-15 PROCESS · PRODUCT는 d안 확정 — 배경 이미지는 각 page.tsx의 INTRO_IMAGE)
 *   none: 흰 바탕(기존) · a: 미스트 단색 · b: 차콜 단색 · c: 패턴(옅은 격자 + 사선) · d: 움직이는 이미지
 */
export type IntroBackdrop = "none" | "a" | "b" | "c" | "d";

interface PageIntroProps {
  /** 큰 영문 페이지 타이틀 */
  title: string;
  /** 짧은 한글 소개 — 확정 전에는 Pending 표시를 넘긴다 */
  intro: ReactNode;
  backdrop?: IntroBackdrop;
  /** d안에서 천천히 움직이는 배경 이미지 */
  motionImage?: string;
  /** d안 톤 — dark: 사진 위 어두운 막(현장 사진) / light: 미스트 위 multiply(흰 배경 제품 이미지) */
  motionTone?: "dark" | "light";
  /** d안(light)에서 이미지 대신 오른쪽에 둘 그래픽(예: 반투명 단색 로고) */
  graphic?: ReactNode;
  /** 바로 아래가 여백 없는 목록일 때 머리 영역 아래 간격 */
  gapAfter?: boolean;
}

/** 서브페이지 공통 머리 영역: 큰 영문 타이틀 + 짧은 한글 소개 (기획서 2.0 부록 E·F) */
export function PageIntro({ title, intro, backdrop = "none", motionImage, motionTone = "dark", graphic, gapAfter = false }: PageIntroProps) {
  const lightMotion = backdrop === "d" && motionTone === "light";
  const dark = backdrop === "b" || (backdrop === "d" && !lightMotion);
  const filled = backdrop !== "none";

  return (
    <section
      data-header-theme={dark ? "dark" : "light"}
      data-surface={dark ? "dark" : undefined}
      className={`relative overflow-hidden ${filled ? "md:flex md:h-[440px] md:flex-col md:justify-center" : ""} ${backdrop === "a" || backdrop === "c" || lightMotion ? "bg-mist" : ""} ${backdrop === "b" ? "bg-intro text-on-dark" : ""} ${backdrop === "d" && !lightMotion ? "bg-intro text-on-dark" : ""} ${gapAfter ? "mb-10 md:mb-14" : ""}`}
    >
      {backdrop === "c" && (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent 0 22px, color-mix(in srgb, var(--color-stone) 70%, transparent) 22px 23px), radial-gradient(circle at 85% 30%, color-mix(in srgb, var(--color-point-1225) 22%, transparent), transparent 45%)",
          }}
        />
      )}
      {lightMotion && graphic && (
        <div aria-hidden="true" className="page-intro-float pointer-events-none absolute right-[var(--gutter)] top-1/2 hidden w-[min(34vw,460px)] -translate-y-1/2 md:block">
          {graphic}
        </div>
      )}
      {lightMotion && !graphic && motionImage && (
        <div aria-hidden="true" className="absolute inset-y-0 right-0 w-[min(70%,900px)] mix-blend-multiply">
          {/* eslint-disable-next-line @next/next/no-img-element -- 배경 이미지 */}
          <img src={motionImage} alt="" className="page-intro-float absolute inset-y-[8%] right-0 h-[84%] w-full object-contain object-right opacity-60" />
        </div>
      )}
      {backdrop === "d" && !lightMotion && motionImage && (
        <div aria-hidden="true" className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element -- 배경 이미지 */}
          <img src={motionImage} alt="" className="page-intro-pan absolute inset-0 size-full object-cover opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-r from-intro via-intro/70 to-intro/20" />
        </div>
      )}

      <div className={`container-yy relative ${filled ? "w-full pb-16 pt-[calc(var(--header-h)+64px)] md:pb-0 md:pt-[var(--header-h)]" : "pb-16 pt-[calc(var(--header-h)+72px)] md:pb-24 md:pt-[calc(var(--header-h)+120px)]"}`}>
        <h1 className="font-en text-[clamp(36px,4.6vw,64px)] leading-[1.05] font-light tracking-[0.06em] uppercase">{title}</h1>
        <div className={`mt-6 max-w-[48ch] text-[clamp(16px,1.3vw,18px)] leading-[1.75] ${dark ? "text-on-dark-sub" : "text-ash"}`}>{intro}</div>
      </div>
    </section>
  );
}
