import type { Metadata } from "next";
import { Business } from "@/components/about/Business";
import { VisionStatement } from "@/components/about/VisionStatement";
import { ContactCta } from "@/components/home/ContactCta";
import { PageIntro } from "@/components/layout/PageIntro";
import { Reveal } from "@/components/motion/Reveal";
import { Logo } from "@/components/brand/Logo";
import { aboutIntro, story } from "@/data/about";

export const metadata: Metadata = { title: "About" };

/**
 * ABOUT (2026-10-15 재디자인) — 섹션마다 "왼쪽 라벨(노란 점) / 오른쪽 내용" 같은 뼈대로 통일.
 * 큰 타이틀(미스트 + 오른쪽 아래로 크게 걸친 반투명 단색 로고) → OUR STORY → OUR VISION(영상, 한 화면)
 *      → OUR BUSINESS(단어가 진해지는 제목 + 사업 영역 01–04) → CTA. 회사 정보는 푸터.
 * 문구는 data/about.ts에서 가져온다.
 */
export default function AboutPage() {
  return (
    <>
      <PageIntro
        title={aboutIntro.title}
        backdrop="d"
        motionTone="light"
        graphic={<Logo variant="verticalCorporation" tone="monoCharcoal" decorative className="h-auto w-full opacity-[0.1]" />}
        intro={
          <>
            <span className="block text-[clamp(20px,1.8vw,26px)] leading-[1.4] font-semibold tracking-[-0.02em] text-charcoal">{aboutIntro.slogan}</span>
            <span className="mt-3 block">{aboutIntro.lead}</span>
          </>
        }
      />

      {/* ② 이야기 — 왼쪽 라벨 / 오른쪽 큰 제목, 첫 문장은 크게 · 나머지 두 문장은 두 단으로 */}
      <section data-header-theme="light" aria-labelledby="story-title" className="bg-paper py-24 md:py-36">
        <div className="container-yy grid gap-8 lg:grid-cols-12 lg:gap-8">
          <p className="label-en flex items-center gap-3 self-start text-ash lg:col-span-3 lg:pt-4">
            <span className="size-1.5 rounded-full bg-point-4008" aria-hidden="true" />
            {story.label}
          </p>
          <div className="lg:col-span-9">
            <Reveal>
              <h2 id="story-title" className="max-w-[20ch] text-[clamp(32px,4.4vw,68px)] leading-[1.22] font-bold tracking-[-0.04em]">
                {story.title}
              </h2>
            </Reveal>
            <Reveal delay={120} className="mt-12 border-t border-stone pt-10 md:mt-16 md:pt-12">
              <p className="max-w-[40ch] text-[clamp(18px,1.6vw,22px)] leading-[1.7] font-medium tracking-[-0.02em] text-charcoal">{story.sentences[0]}</p>
            </Reveal>
            <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-10">
              {story.sentences.slice(1).map((sentence, i) => (
                <Reveal as="p" key={i} delay={200 + i * 100} className="text-[16px] leading-[1.85] text-ash">
                  {sentence}
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <VisionStatement />

      <Business />

      <ContactCta />
    </>
  );
}
