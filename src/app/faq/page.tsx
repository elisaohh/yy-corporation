import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/faq/FaqList";
import { PageIntro } from "@/components/layout/PageIntro";
import { company } from "@/data/company";
import { faqContact, faqGroups, faqIntro } from "@/data/faq";

export const metadata: Metadata = {
  title: "자주 묻는 질문",
  description: "와이와이코퍼레이션 FAQ — 턴키 진행 범위, 견적 · 샘플, 납기, 진행 과정(CT · PPS), 인증 · 성적서, 불량 · 클레임 처리.",
};

/** 메일 앱을 열어 회사 메일로 — 제목 · 본문 틀을 미리 채운다 */
const mailHref = (email: string) =>
  `mailto:${email}?subject=${encodeURIComponent(faqContact.mailSubject)}&body=${encodeURIComponent(faqContact.mailBody)}`;

/**
 * FAQ — PROCESS와 CONTACT 사이. 문구는 회사 제공 FAQ.html 그대로(data/faq.ts).
 * 머리 영역(다른 페이지와 같은 PageIntro) → 주제 버튼 + 질문 목록 → 연회색 문의 영역(메일 · 문의 양식).
 */
export default function FaqPage() {
  const email = company.email ?? "sales@yycorp.co.kr";
  return (
    <>
      <PageIntro title={faqIntro.title} backdrop="a" gapAfter boldTitle intro={faqIntro.lead} />
      <FaqList groups={faqGroups} />

      {/* 찾는 답이 없을 때 — 메일로 바로 문의 · 문의 양식 */}
      <section data-header-theme="light" aria-labelledby="faq-contact-title" className="bg-mist">
        <div className="container-yy flex flex-col gap-10 py-20 md:flex-row md:items-end md:justify-between md:py-28">
          <div>
            <h2 id="faq-contact-title" className="text-[clamp(24px,2.4vw,34px)] leading-[1.3] font-bold tracking-[-0.03em]">
              {faqContact.title}
            </h2>
            <p className="mt-4 max-w-[36ch] text-[clamp(15px,1.2vw,17px)] leading-[1.75] text-ash">{faqContact.body}</p>
            <p className="mt-6 font-en text-[15px] tracking-[0.02em]">
              <a href={`mailto:${email}`} className="underline-offset-4 hover:underline">
                {email}
              </a>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={mailHref(email)} className="btn btn-primary">
              메일로 문의하기
            </a>
            <Link href="/contact" className="btn">
              문의 양식으로 보내기
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
