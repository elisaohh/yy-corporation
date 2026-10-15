import type { Metadata } from "next";
import { Suspense } from "react";
import { InquiryForm } from "@/components/contact/InquiryForm";
import { PageIntro } from "@/components/layout/PageIntro";
import { Pending } from "@/components/ui/Pending";
import { company, companyStatus } from "@/data/company";
import { contactCopy } from "@/data/content";

export const metadata: Metadata = { title: "Contact" };

/** 네이버 지도 — 확정된 회사 주소로 검색 결과를 연다(지도 퍼가기 · API 키 없이 연결만) */
const naverMapUrl = (address: string) => `https://map.naver.com/p/search/${encodeURIComponent(address)}`;

/**
 * CONTACT — 큰 영문 타이틀 + 짧은 한글 소개 → PC: 왼쪽 오시는 길 · 회사 정보 / 오른쪽 문의 폼. 모바일: 폼 먼저 (기획서 2.0 부록 G).
 * 지도는 네이버 지도로 연결한다(2026-10-15 사용자 요청). 문의 폼은 시연용(실제 전송 없음).
 */
export default function ContactPage() {
  // 값이 없는 항목(팩스 · 상담 시간)은 표시하지 않는다
  const info = [
    { label: "회사명", value: company.legalName },
    { label: "주소", value: company.address },
    { label: "대표전화", value: company.phone },
    { label: "팩스", value: company.fax },
    { label: "이메일", value: company.email },
    { label: "상담 시간", value: company.hours },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value));

  return (
    <>
      <PageIntro
        title="Contact"
        intro={
          <>
            {contactCopy.intro.text}
            {contactCopy.intro.status !== "final" && <Pending kind="draft" className="ml-2" />}
          </>
        }
      />

      <section data-header-theme="light" aria-label="문의하기" className="container-yy pb-32">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
          {/* 문의 폼 — 모바일에서 먼저 */}
          <div className="lg:order-2 lg:col-span-6 lg:col-start-7">
            <Suspense fallback={<div className="min-h-[640px]" aria-busy="true" />}>
              <InquiryForm />
            </Suspense>
          </div>

          {/* 오시는 길 · 회사 정보 */}
          <aside aria-label="오시는 길과 회사 정보" className="lg:order-1 lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+32px)]">
              {company.address && (
                <a
                  href={naverMapUrl(company.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-[4/3] overflow-hidden bg-mist outline-offset-4"
                >
                  {/* 지도 느낌의 옅은 격자 + 위치 표시 (실제 지도는 네이버 지도에서) */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 opacity-70"
                    style={{
                      backgroundImage:
                        "linear-gradient(var(--color-stone) 1px, transparent 1px), linear-gradient(90deg, var(--color-stone) 1px, transparent 1px)",
                      backgroundSize: "36px 36px",
                    }}
                  />
                  <span aria-hidden="true" className="absolute left-1/2 top-[44%] grid -translate-x-1/2 -translate-y-1/2 place-items-center">
                    <span className="absolute size-16 animate-ping rounded-full bg-point-1225/40" />
                    <svg viewBox="0 0 24 24" className="relative size-10 text-charcoal drop-shadow" fill="currentColor">
                      <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
                    </svg>
                  </span>
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-paper via-paper/90 to-transparent p-5 pt-14">
                    <span>
                      <span className="label-en block text-ash">Location</span>
                      <span className="mt-2 block text-[15px] leading-snug">{company.address}</span>
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-charcoal px-4 py-2.5 text-[13px] font-medium text-paper transition-colors group-hover:bg-point-1225 group-hover:text-charcoal">
                      네이버 지도
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M7 17 17 7M9 7h8v8" />
                      </svg>
                    </span>
                  </span>
                  <span className="sr-only">(새 창에서 네이버 지도 열기)</span>
                </a>
              )}
              <dl className="mt-8 grid gap-0">
                {info.map((row) => (
                  <div key={row.label} className="grid grid-cols-[88px_minmax(0,1fr)] items-baseline gap-4 border-b border-stone py-3 text-[14px]">
                    <dt className="text-ash">{row.label}</dt>
                    <dd className="min-w-0">{row.value}</dd>
                  </div>
                ))}
              </dl>
              {companyStatus !== "confirmed" && (
                <p className="mt-4">
                  <Pending label="기존 사이트 기준 · 최신 확인 필요" />
                </p>
              )}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
