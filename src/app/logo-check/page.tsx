import type { Metadata } from "next";
import { Logo } from "@/components/brand/Logo";
import { logoPlacement, logos, type LogoVariant } from "@/data/brand";

export const metadata: Metadata = { title: "Logo check" };

/**
 * 로고 검토용 내부 페이지 — 메뉴에 노출하지 않으며 배포 전에 삭제한다.
 * 공식 SVG 6종을 흰색·차콜 바탕과 실제 사용 크기에서 비교한다.
 */
const variants = Object.keys(logos) as LogoVariant[];

const placementLabels: Record<keyof typeof logoPlacement, string> = {
  headerDesktop: "PC 헤더",
  headerMobile: "모바일 헤더",
  mobileMenu: "모바일 메뉴",
  homeIntro: "HOME 인트로",
  loader: "로더",
  footer: "푸터",
};

export default function LogoCheckPage() {
  return (
    <div className="pt-[calc(var(--header-h)+48px)]">
      <section data-header-theme="light" className="container-yy pb-12">
        <h1 className="font-en text-[clamp(28px,3vw,40px)] font-light tracking-[0.06em] uppercase">Logo check</h1>
        <p className="mt-3 text-ash">공식 SVG 6종 · 원본 색상 그대로 · 흰색과 차콜 바탕 비교 (내부 검토용)</p>
      </section>

      {(["paper", "intro"] as const).map((surface) => (
        <section
          key={surface}
          data-header-theme={surface === "intro" ? "dark" : "light"}
          className={surface === "intro" ? "bg-intro text-on-dark" : "bg-paper"}
        >
          <div className="container-yy grid gap-px py-14 sm:grid-cols-2 lg:grid-cols-3">
            {variants.map((variant) => (
              <figure key={variant} className="flex flex-col items-start gap-6 py-6">
                <Logo variant={variant} className="h-16 w-auto" />
                <Logo variant={variant} className="h-7 w-auto" />
                <figcaption className={`text-[13px] ${surface === "intro" ? "text-on-dark-sub" : "text-ash"}`}>
                  {logos[variant].description} · {logos[variant].original}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}

      <section data-header-theme="light" className="container-yy py-16">
        <h2 className="font-en text-[20px] font-light tracking-[0.08em] uppercase">Placement</h2>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          {(Object.keys(logoPlacement) as (keyof typeof logoPlacement)[]).map((key) => {
            const dark = key === "homeIntro" || key === "loader";
            return (
              <div key={key} className={`flex min-h-40 flex-col justify-between gap-6 p-6 ${dark ? "bg-intro text-on-dark" : "border border-stone"}`}>
                <Logo placement={key} />
                <p className={`text-[13px] ${dark ? "text-on-dark-sub" : "text-ash"}`}>
                  {placementLabels[key]} · {logos[logoPlacement[key].variant].description} · 높이 {logoPlacement[key].height}px
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
