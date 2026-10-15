import type { Metadata } from "next";
import { AboutParts, type AboutVariant } from "@/components/about/AboutParts";
import { ContactCta } from "@/components/home/ContactCta";
import { PageIntro } from "@/components/layout/PageIntro";
import { aboutIntro } from "@/data/about";

export const metadata: Metadata = { title: "About" };

/**
 * ABOUT (2026-10-15) — 차콜 제목 영역 → Story · Vision · Business 세 파트 → CTA. 회사 정보는 푸터.
 * 본문 시안 3종 비교 중: /about?v=a(에디토리얼 2단) | b(챕터 전환) | c(고정 목차). 결정 후 나머지 삭제.
 */
export default async function AboutPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = (await searchParams).v;
  const v = Array.isArray(raw) ? raw[0] : raw;
  const variant: AboutVariant = v === "b" || v === "c" ? v : "a";

  return (
    <>
      <PageIntro
        title={aboutIntro.title}
        backdrop="b"
        intro={
          <>
            <span className="block text-[clamp(20px,1.8vw,26px)] leading-[1.4] font-semibold tracking-[-0.02em] text-on-dark">{aboutIntro.slogan}</span>
            <span className="mt-3 block">{aboutIntro.lead}</span>
          </>
        }
      />
      <AboutParts key={variant} variant={variant} />
      <ContactCta />
    </>
  );
}
