import type { Metadata } from "next";
import { Suspense } from "react";
import { InquiryForm } from "@/components/contact/InquiryForm";
import { Pending } from "@/components/ui/Pending";
import { company } from "@/data/company";
import { contactCopy } from "@/data/content";

export const metadata: Metadata = { title: "Contact" };

/**
 * CONTACT — PC: 왼쪽 지도 · 회사 정보 / 오른쪽 문의 폼. 모바일: 폼 먼저, 지도 아래 (기획서 2.0 부록 G).
 * 지도는 검증된 주소와 연동 수단이 생기기 전까지 자리표시자로 둔다(가짜 위치 금지).
 */
export default function ContactPage() {
  const info: { label: string; value: string | null }[] = [
    { label: "회사명", value: company.legalName },
    { label: "주소", value: company.address },
    { label: "대표전화", value: company.phone },
    { label: "팩스", value: company.fax },
    { label: "이메일", value: company.email },
    { label: "상담 시간", value: company.hours },
  ];

  return (
    <section data-header-theme="light" className="container-yy pb-32 pt-[calc(var(--header-h)+56px)] md:pt-[calc(var(--header-h)+96px)]">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
        {/* 문의 폼 — 모바일에서 먼저 */}
        <div className="lg:order-2 lg:col-span-6 lg:col-start-7">
          <h1 className="font-en text-[clamp(32px,4vw,56px)] leading-[1.02] font-semibold tracking-[-0.04em] uppercase">
            {contactCopy.title.text}
          </h1>
          {contactCopy.title.status !== "final" && (
            <p className="mt-3">
              <Pending kind="draft" />
            </p>
          )}
          <p className="mt-6 max-w-[40ch] text-[clamp(16px,1.3vw,18px)] leading-[1.75] text-ash">
            {contactCopy.intro.text ?? (
              <>
                짧은 한글 소개 <Pending />
              </>
            )}
          </p>
          <div className="mt-12">
            <Suspense fallback={<div className="min-h-[640px]" aria-busy="true" />}>
              <InquiryForm />
            </Suspense>
          </div>
        </div>

        {/* 지도 · 회사 정보 */}
        <aside aria-label="오시는 길과 회사 정보" className="lg:order-1 lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+32px)]">
            <div className="grid aspect-[4/3] place-items-center border border-dashed border-stone bg-card px-6 text-center lg:aspect-[4/5]">
              <div className="grid justify-items-center gap-3">
                <p className="label-en text-ash">Map</p>
                <p className="text-[15px]">지도 준비 중</p>
                <p className="max-w-[28ch] text-[13px] text-ash">검증된 회사 주소와 지도 연동 방법이 정해지면 실제 위치를 표시합니다.</p>
                <Pending label="주소 확인 필요" />
              </div>
            </div>
            <dl className="mt-8 grid gap-0">
              {info.map((row) => (
                <div key={row.label} className="grid grid-cols-[88px_minmax(0,1fr)] items-baseline gap-4 border-b border-stone py-3 text-[14px]">
                  <dt className="text-ash">{row.label}</dt>
                  <dd className="min-w-0">{row.value ?? <Pending />}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </div>
    </section>
  );
}
