import type { Metadata } from "next";
import { ExpertiseList } from "@/components/about/ExpertiseList";
import { VisionStatement } from "@/components/about/VisionStatement";
import { ContactCta } from "@/components/home/ContactCta";
import { PageIntro } from "@/components/layout/PageIntro";
import { Reveal } from "@/components/motion/Reveal";
import { aboutIntro, aboutMedia, story, values } from "@/data/about";

export const metadata: Metadata = { title: "About" };

/**
 * ABOUT (2026-10-15 개편) — 다른 페이지처럼 큰 타이틀로 시작, data/about.ts의 회사 작성 문구를 모두 싣는다.
 * 흐름: 머리 영역(미스트 + 떠다니는 병 · 슬로건) → 이야기(미스트 + 제품 사진) → 비전(어두운 사진 배경)
 *      → 핵심 가치(흐르는 단어 띠 + 4칸) → 전문 역량(리스트 + 바뀌는 사진) → CTA (회사 정보는 푸터로 이동)
 * 사진 경로는 data/about.ts의 aboutMedia에서 바꾼다.
 */
export default function AboutPage() {
  const band = [...values, ...values];

  return (
    <>
      <PageIntro
        title={aboutIntro.title}
        backdrop="d"
        motionTone="light"
        motionImage={aboutMedia.intro}
        intro={
          <>
            <span className="block text-[clamp(20px,1.8vw,26px)] leading-[1.4] font-semibold tracking-[-0.02em] text-charcoal">{aboutIntro.slogan}</span>
            <span className="mt-3 block">{aboutIntro.lead}</span>
          </>
        }
      />

      {/* ② 이야기 — 흰 바탕 + 오른쪽에 떠 있는 제품 사진, 문장 순차 등장 */}
      <section data-header-theme="light" aria-labelledby="story-title" className="relative overflow-hidden bg-paper py-28 md:py-40">
        <div aria-hidden="true" className="pointer-events-none absolute -right-[8%] top-1/2 hidden w-[min(52vw,760px)] -translate-y-1/2 mix-blend-multiply lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element -- 제품 사진(색상 · 질감 변형) */}
          <img src={aboutMedia.story} alt="" loading="lazy" className="page-intro-float w-full" />
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


      <ContactCta />
    </>
  );
}
