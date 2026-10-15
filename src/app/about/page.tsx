import type { Metadata } from "next";
import { ExpertiseList } from "@/components/about/ExpertiseList";
import { VisionStatement } from "@/components/about/VisionStatement";
import { Logo } from "@/components/brand/Logo";
import { ContactCta } from "@/components/home/ContactCta";
import { PageIntro } from "@/components/layout/PageIntro";
import { Reveal } from "@/components/motion/Reveal";
import { Pending } from "@/components/ui/Pending";
import { aboutIntro, aboutMedia, story, values } from "@/data/about";
import { company } from "@/data/company";

export const metadata: Metadata = { title: "About" };

/**
 * ABOUT (2026-10-15 개편) — 다른 페이지처럼 큰 타이틀로 시작, data/about.ts의 회사 작성 문구를 모두 싣는다.
 * 흐름: 머리 영역(현장 사진 · 슬로건) → 이야기(미스트 + 떠 있는 병) → 비전(어두운 사진 배경)
 *      → 핵심 가치(흐르는 단어 띠 + 4칸) → 전문 역량(리스트 + 바뀌는 사진) → 회사 정보(로고 그래픽) → CTA
 * 사진 경로는 data/about.ts의 aboutMedia에서 바꾼다.
 */
export default function AboutPage() {
  const info: { label: string; value: string | null }[] = [
    { label: "회사명", value: company.legalName },
    { label: "대표", value: company.representative },
    { label: "사업자등록번호", value: company.businessNumber },
    { label: "주소", value: company.address },
    { label: "전화", value: company.phone },
    { label: "이메일", value: company.email },
  ];
  const band = [...values, ...values];

  return (
    <>
      <PageIntro
        title={aboutIntro.title}
        backdrop="d"
        motionImage={aboutMedia.intro}
        intro={
          <>
            <span className="block text-[clamp(20px,1.8vw,26px)] leading-[1.4] font-semibold tracking-[-0.02em] text-on-dark">{aboutIntro.slogan}</span>
            <span className="mt-3 block">{aboutIntro.lead}</span>
          </>
        }
      />

      {/* ② 이야기 — 미스트 + 오른쪽에 떠 있는 병(히어로 사진), 문장 순차 등장 */}
      <section data-header-theme="light" aria-labelledby="story-title" className="relative overflow-hidden bg-mist py-28 md:py-40">
        <div aria-hidden="true" className="pointer-events-none absolute -right-[8%] top-1/2 hidden w-[min(52vw,760px)] -translate-y-1/2 mix-blend-multiply lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element -- 히어로 사진(병 · 물방울) */}
          <img src={aboutMedia.story} alt="" loading="lazy" className="page-intro-float w-full opacity-90" />
        </div>
        <div className="container-yy relative">
          <p className="label-en text-ash">{story.label}</p>
          <Reveal>
            <h2 id="story-title" className="mt-8 max-w-[16ch] text-[clamp(28px,3.4vw,50px)] leading-[1.3] font-bold tracking-[-0.035em]">
              {story.title}
            </h2>
          </Reveal>
          <div className="mt-12 grid max-w-[44ch] gap-6 md:mt-16">
            {story.sentences.map((sentence, i) => (
              <Reveal as="p" key={i} delay={i * 90} className="text-[clamp(16px,1.3vw,19px)] leading-[1.85] text-charcoal/85">
                {sentence}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <VisionStatement />

      {/* ④ 핵심 가치 — 흐르는 단어 띠 + 큰 숫자 4칸 */}
      <section data-header-theme="light" aria-labelledby="values-title" className="overflow-hidden bg-paper py-28 md:py-40">
        <div aria-hidden="true" className="mb-16 overflow-hidden border-y border-stone py-5 md:mb-24">
          <div className="marquee flex w-max gap-12 whitespace-nowrap font-en text-[clamp(40px,6vw,96px)] leading-none font-extrabold tracking-[-0.04em] uppercase">
            {band.map((v, i) => (
              <span key={`${v.key}-${i}`} className={i % 2 ? "text-[color-mix(in_srgb,var(--color-ash)_35%,var(--color-paper))]" : "text-charcoal"}>
                {v.key}
                <span className="ml-12 text-point-4008">·</span>
              </span>
            ))}
          </div>
        </div>
        <div className="container-yy">
          <h2 id="values-title" className="label-en text-ash">
            Core Values
          </h2>
          <ol className="mt-12 grid gap-x-8 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
            {values.map((value, i) => (
              <Reveal as="li" key={value.key} delay={i * 90} className="group border-t-2 border-charcoal py-8 transition-colors duration-500 hover:border-point-4008">
                <p className="font-en text-[clamp(56px,6vw,96px)] leading-none font-extralight tabular-nums tracking-[-0.04em] transition-colors duration-500 group-hover:text-point-4008">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-8 font-en text-[clamp(20px,1.7vw,24px)] font-bold tracking-[-0.02em] uppercase">{value.key}</p>
                <p className="mt-2 text-[16px] text-ash">{value.line}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ⑤ 전문 역량 */}
      <section data-header-theme="light" aria-labelledby="expertise-title" className="bg-paper pb-28 md:pb-40">
        <div className="container-yy">
          <h2 id="expertise-title" className="label-en mb-12 text-ash md:mb-16">
            Expertise
          </h2>
          <ExpertiseList />
        </div>
      </section>

      {/* ⑥ 회사 정보 — 미스트 + 반투명 로고 그래픽 */}
      <section data-header-theme="light" aria-labelledby="company-title" className="relative overflow-hidden bg-mist py-28 md:py-36">
        <div aria-hidden="true" className="pointer-events-none absolute -left-[3%] bottom-[-4%] w-[min(44vw,620px)] opacity-[0.07]">
          <Logo variant="horizontalCorporation" tone="monoCharcoal" decorative className="h-auto w-full" />
        </div>
        <div className="container-yy relative grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <h2 id="company-title" className="label-en text-ash">
              Company
            </h2>
            <p className="mt-6 text-[clamp(24px,2.4vw,34px)] leading-[1.3] font-bold tracking-[-0.03em]">{aboutIntro.slogan}</p>
          </div>
          <dl className="lg:col-span-7 lg:col-start-6">
            {info.map((row) => (
              <div key={row.label} className="grid grid-cols-[120px_minmax(0,1fr)] gap-4 border-t border-charcoal/15 py-5 text-[15px] md:grid-cols-[180px_minmax(0,1fr)] md:text-[16px]">
                <dt className="text-ash">{row.label}</dt>
                <dd>
                  {!row.value ? (
                    <Pending />
                  ) : row.label === "이메일" ? (
                    <a href={`mailto:${row.value}`} className="underline-offset-4 hover:underline">
                      {row.value}
                    </a>
                  ) : row.label === "전화" ? (
                    <a href={`tel:${row.value.replace(/-/g, "")}`} className="underline-offset-4 hover:underline">
                      {row.value}
                    </a>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
