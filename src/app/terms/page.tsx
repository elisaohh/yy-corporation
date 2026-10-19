import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { termsOfUse } from "@/data/terms";

export const metadata: Metadata = { title: "이용약관" };

/** 이용약관 — 글은 data/terms.ts. 푸터에서 연결 */
export default function TermsPage() {
  const { title, articles, addendum } = termsOfUse;
  return (
    <LegalDocument
      eyebrow="Terms of Use"
      title={title}
      articles={articles}
      closing={
        <>
          <p className="font-semibold">부칙</p>
          <p className="mt-2 text-charcoal/80">{addendum}</p>
        </>
      }
      related={{ href: "/privacy", label: "개인정보 처리방침" }}
    />
  );
}
