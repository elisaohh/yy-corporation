import type { Metadata } from "next";
import { AboutParts } from "@/components/about/AboutParts";
import { ContactCta } from "@/components/home/ContactCta";
import { PageIntro } from "@/components/layout/PageIntro";
import { aboutIntro } from "@/data/about";

export const metadata: Metadata = { title: "About" };

/**
 * ABOUT (2026-10-15) — 미스트 제목 영역 → Story · Vision · Business 세 파트 → CTA. 회사 정보는 푸터.
 * 본문은 B안(챕터 전환) 확정.
 */
export default function AboutPage() {

  return (
    <>
      <PageIntro
        title={aboutIntro.title}
        backdrop="a"
        intro={
          <>
            <span className="block text-[clamp(20px,1.8vw,26px)] leading-[1.4] font-semibold tracking-[-0.02em] text-charcoal">{aboutIntro.slogan}</span>
            <span className="mt-3 block">{aboutIntro.lead}</span>
          </>
        }
      />
      <AboutParts />
      <ContactCta />
    </>
  );
}
