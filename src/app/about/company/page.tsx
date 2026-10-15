import type { Metadata } from "next";
import { AboutSections } from "@/components/about/AboutSections";
import { ContactCta } from "@/components/home/ContactCta";
import { PageIntro } from "@/components/layout/PageIntro";
import { aboutIntro } from "@/data/about";

export const metadata: Metadata = { title: "Company" };

/**
 * ABOUT › COMPANY (/about/company, 2026-10-16 /about에서 이동) — 미스트 제목 영역 → Story · Vision · Business 세 파트 → CTA. 회사 정보는 푸터.
 * 본문은 2026-10-15 전면 리디자인(AboutSections), 제목 영역은 공용 PageIntro 유지.
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
