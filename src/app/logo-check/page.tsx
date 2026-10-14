import type { Metadata } from "next";
import { Logo } from "@/components/brand/Logo";
import { brandColorsFromLogo, logoPlacement, logoTones, logos, type LogoTone, type LogoVariant } from "@/data/brand";
import { mainNav } from "@/data/navigation";

export const metadata: Metadata = { title: "Logo check" };

/**
 * 로고 검토용 내부 페이지 — 메뉴에 노출하지 않으며 배포 전에 삭제한다.
 * 1) 공식 키컬러와 차콜 단색 파생 시안을 실제 헤더 크기로 비교
 * 2) 공식 SVG 6종을 흰색·차콜 바탕에서 비교
 * 3) 현재 위치별 배정
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

function ToneBadge({ tone }: { tone: LogoTone }) {
  const draft = logoTones[tone].status !== "final";
  return (
    <span
      className={`inline-flex w-fit items-center border px-1.5 py-[3px] text-[11px] leading-none font-medium ${
        draft ? "border-point-1225 bg-point-1225 text-charcoal" : "border-charcoal bg-charcoal text-paper"
      }`}
    >
      {logoTones[tone].label}
    </span>
  );
}

/** 실제 헤더와 같은 높이·여백·반투명 바탕으로 만든 비교용 헤더 */
function MockHeader({ tone, size }: { tone: LogoTone; size: "desktop" | "mobile" }) {
  const desktop = size === "desktop";
  return (
    <div className="relative overflow-hidden border border-stone">
      {/* 헤더 아래로 비치는 본문 느낌 */}
      <div aria-hidden="true" className="absolute inset-0 bg-[repeating-linear-gradient(90deg,#f4f3f1_0_24px,#ffffff_24px_48px)]" />
      <div
        className={`relative flex items-center justify-between border-b border-stone/70 bg-paper/80 text-charcoal backdrop-blur-md ${
          desktop ? "h-[68px] px-10" : "h-14 px-6"
        }`}
      >
        <Logo
          placement={desktop ? "headerDesktop" : "headerMobile"}
          tone={tone}
          className={desktop ? "h-[30px] w-auto" : "h-[26px] w-auto"}
        />
        {desktop ? (
          <ul className="flex items-center gap-8">
            {mainNav.map((item, index) => (
              <li
                key={item.href}
                className={`label-en relative pt-2.5 before:absolute before:left-1/2 before:top-0 before:size-1 before:-translate-x-1/2 before:rounded-full before:bg-current ${
                  index === 0 ? "before:opacity-100" : "before:opacity-0"
                }`}
              >
                {item.label}
              </li>
            ))}
          </ul>
        ) : (
          <span aria-hidden="true" className="relative block h-[9px] w-6">
            <span className="absolute inset-x-0 top-0 h-[1.5px] bg-current" />
            <span className="absolute inset-x-0 bottom-0 h-[1.5px] bg-current" />
          </span>
        )}
      </div>
      <div className="relative h-10" />
    </div>
  );
}

export default function LogoCheckPage() {
  return (
    <div className="pt-[calc(var(--header-h)+48px)]">
      <section data-header-theme="light" className="container-yy pb-10">
        <h1 className="font-en text-[clamp(28px,3vw,40px)] font-light tracking-[0.06em] uppercase">Logo check</h1>
        <p className="mt-3 max-w-[60ch] text-ash">
          내부 검토용 페이지입니다. 로고 자리에는 공식 키컬러만 씁니다. 흰색·차콜 단색은 원본 사본에서 색상 값 두 개만 바꾼 파생본이며, 디자인 단계에서 반투명 그래픽 요소로만 활용합니다.
        </p>
        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-[13px]">
          <div className="flex items-center gap-2">
            <span className="size-4 border border-stone" style={{ background: brandColorsFromLogo.symbol }} />
            <dt className="text-ash">심볼</dt>
            <dd className="font-en tabular-nums">{brandColorsFromLogo.symbol}</dd>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-4 border border-stone" style={{ background: brandColorsFromLogo.wordmark }} />
            <dt className="text-ash">워드마크</dt>
            <dd className="font-en tabular-nums">{brandColorsFromLogo.wordmark}</dd>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-4 bg-charcoal" />
            <dt className="text-ash">단색 시안</dt>
            <dd className="font-en tabular-nums">#2B2B2A</dd>
          </div>
        </dl>
      </section>

      {/* 1. 헤더 크기 비교 */}
      <section data-header-theme="light" className="container-yy pb-16">
        <h2 className="font-en text-[20px] font-light tracking-[0.08em] uppercase">Header size</h2>
        <p className="mt-2 text-[14px] text-ash">실제 헤더와 같은 높이 · 반투명 흰 바탕 · 로고 높이(PC 30px, 모바일 26px)</p>

        <div className="mt-8 grid gap-4">
          <ToneBadge tone="official" />
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_375px]">
            <div>
              <p className="mb-2 font-en text-[11px] tracking-[0.12em] text-ash uppercase">PC · 68px</p>
              <MockHeader tone="official" size="desktop" />
            </div>
            <div>
              <p className="mb-2 font-en text-[11px] tracking-[0.12em] text-ash uppercase">Mobile · 56px</p>
              <MockHeader tone="official" size="mobile" />
            </div>
          </div>
        </div>
      </section>

      {/* 1-2. 단색 반투명 그래픽 활용 예시 */}
      <section data-header-theme="light" className="container-yy pb-16">
        <h2 className="font-en text-[20px] font-light tracking-[0.08em] uppercase">Graphic use</h2>
        <p className="mt-2 text-[14px] text-ash">로고 자리가 아닌 배경 그래픽 예시 — 실제 사용 위치와 불투명도는 디자인 단계에서 결정</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="relative grid min-h-64 place-items-center overflow-hidden bg-mist">
            <Logo variant="verticalCorp" tone="monoCharcoal" decorative className="h-48 w-auto opacity-[0.06]" />
            <span className="absolute left-5 top-5"><ToneBadge tone="monoCharcoal" /></span>
            <span className="absolute bottom-5 left-5 text-[13px] text-ash">밝은 섹션 · 차콜 6%</span>
          </div>
          <div data-header-theme="dark" className="relative grid min-h-64 place-items-center overflow-hidden bg-intro">
            <Logo variant="verticalCorp" tone="monoWhite" decorative className="h-48 w-auto opacity-[0.08]" />
            <span className="absolute left-5 top-5"><ToneBadge tone="monoWhite" /></span>
            <span className="absolute bottom-5 left-5 text-[13px] text-on-dark-sub">차콜 섹션 · 흰색 8%</span>
          </div>
        </div>
      </section>

      {/* 2. 공식 6종 */}
      {(["paper", "intro"] as const).map((surface) => (
        <section
          key={surface}
          data-header-theme={surface === "intro" ? "dark" : "light"}
          className={surface === "intro" ? "bg-intro text-on-dark" : "border-t border-stone bg-paper"}
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

      {/* 3. 위치별 배정 */}
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
