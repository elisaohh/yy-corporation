import type { Metadata } from "next";
import { AboutSections } from "@/components/about/AboutSections";
import { ContactCta } from "@/components/home/ContactCta";
import { PageIntro } from "@/components/layout/PageIntro";
import { aboutIntro } from "@/data/about";

export const metadata: Metadata = { title: "Company" };

/**
 * ABOUT › COMPANY (/about/company) — 미스트 제목 영역 → Story · Vision · Business 세 파트 → CTA. 회사 정보는 푸터.
 * 본문은 AboutSections, 제목 영역은 공용 PageIntro.
 */
export default function AboutCompanyPage() {
  return (
    <>
      <PageIntro
        title="Company"
        backdrop="a"
        intro={
          <>
            <span className="block text-[clamp(20px,1.8vw,26px)] leading-[1.4] font-semibold tracking-[-0.02em] text-charcoal">{aboutIntro.slogan}</span>
            <span className="mt-3 block">{aboutIntro.lead}</span>
          </>
        }
      />
      <AboutSections />
      <ContactCta />
    </>
  );
}
