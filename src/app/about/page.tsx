import type { Metadata } from "next";
import { AboutSections } from "@/components/about/AboutSections";
import { ContactCta } from "@/components/home/ContactCta";

export const metadata: Metadata = { title: "About" };

/**
 * ABOUT (2026-10-15 전면 리디자인) — 00 Intro → 01 Story → 02 Vision → 03 Business → 04 CTA(공용 ContactCta).
 * 회사 정보는 푸터. 문구 · 이미지는 data/about.ts.
 */
export default function AboutPage() {
  return (
    <>
      <AboutSections />
      <ContactCta />
    </>
  );
}
