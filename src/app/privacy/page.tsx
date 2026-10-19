import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { privacyPolicy } from "@/data/privacy";

export const metadata: Metadata = { title: "개인정보 처리방침" };

/** 개인정보 처리방침 — 글은 data/privacy.ts. 푸터 · 문의 폼 동의란에서 연결 */
export default function PrivacyPage() {
  const { title, intro, effectiveDate, articles } = privacyPolicy;
  return (
    <LegalDocument
      eyebrow="Privacy Policy"
      title={title}
      intro={intro}
      articles={articles}
      closing={<p className="font-semibold">시행일: {effectiveDate}</p>}
      related={{ href: "/terms", label: "이용약관" }}
    />
  );
}
