import type { Metadata } from "next";
import { Capabilities } from "@/components/about/Capabilities";
import { VisionStatement } from "@/components/about/VisionStatement";
import { ContactCta } from "@/components/home/ContactCta";
import { PageIntro } from "@/components/layout/PageIntro";
import { Reveal } from "@/components/motion/Reveal";
import { Logo } from "@/components/brand/Logo";
import { aboutIntro, story } from "@/data/about";

export const metadata: Metadata = { title: "About" };

/**
 * ABOUT (2026-10-15) — 큰 타이틀(미스트 + 반투명 단색 로고) → 이야기 → 비전(01 · 02, 영상 배경)
 *      → 03 DECORATION · 04 GLOBAL SOURCING → CTA. 회사 정보는 푸터.
 * 문구는 data/about.ts에서 가져온다.
 */
export default function AboutPage() {
  return (
    <>
      <PageIntro
        title={aboutIntro.title}
        backdrop="d"
        motionTone="light"
        graphic={<Logo variant="verticalCorporation" tone="monoCharcoal" decorative className="h-auto w-full opacity-[0.14]" />}
        intro={
          <>
            <span className="block text-[clamp(20px,1.8vw,26px)] leading-[1.4] font-semibold tracking-[-0.02em] text-charcoal">{aboutIntro.slogan}</span>
            <span className="mt-3 block">{aboutIntro.lead}</span>
          </>
        }
      />

      {/* ② 이야기 — 흰 바탕, 문장 순차 등장 */}
      <section data-header-theme="light" aria-labelledby="story-title" className="relative overflow-hidden bg-paper py-28 md:py-40">
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

      <Capabilities />

      <ContactCta />
    </>
  );
}
