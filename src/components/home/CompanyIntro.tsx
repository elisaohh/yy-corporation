import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { companyIntro, services } from "@/data/home";

/**
 * ② 짧은 회사 소개 (2026-10-15 디자인 시스템) — 제목축(1단)에 한 문장, 본문축(7단)에 소개 + FIND · DRESS · MATCH · DELIVER.
 * 카드 · 큰 단어 · 줄마다 등장 효과 없이, 블록 전체가 한 번만 옅게 나타난다.
 */
export function CompanyIntro() {
  return (
    <section data-header-theme="light" aria-labelledby="company-intro-title" className="sec-m bg-paper">
      <Reveal className="container-yy grid gap-12 md:grid-cols-12 md:gap-8">
        <h2 id="company-intro-title" className="t-h2 md:col-span-5">
          {companyIntro.title}
        </h2>

        <div className="md:col-span-6 md:col-start-7">
          <p className="t-body-l max-w-[40ch] text-charcoal/80">{companyIntro.body}</p>

          <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-stone pt-10 md:mt-20">
            {services.map((s) => (
              <div key={s.key}>
                <dt className="t-meta text-ash">{s.name}</dt>
                <dd className="mt-3">
                  <span className="t-h3 block">{s.line}</span>
                  <span className="t-body mt-1 block text-ash">{s.scope}</span>
                </dd>
              </div>
            ))}
          </dl>

          <Link href="/about" className="link-line mt-12">
            회사 소개
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
