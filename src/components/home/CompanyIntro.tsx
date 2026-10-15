import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { companyIntro, services } from "@/data/home";

/**
 * ② 짧은 회사 소개 — 화면 1개, 고정 없음 (2026-10-14 HOME 개편안).
 * FIND · DRESS · MATCH · DELIVER를 이 섹션에 통합했다(기존 가로 스크롤 삭제).
 * 기획서 1.2 "HOME에 회사 소개 넣지 않음"에서 사용자 결정으로 변경 — ABOUT과 겹치지 않게 짧게 둔다.
 */
export function CompanyIntro() {
  return (
    <section data-header-theme="light" aria-labelledby="company-intro-title" className="bg-paper py-28 md:py-40">
      <div className="container-yy grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Reveal>
            <h2 id="company-intro-title" className="text-[clamp(30px,3.6vw,52px)] leading-[1.25] font-bold tracking-[-0.035em]">
              {companyIntro.title}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-8 max-w-[34ch] text-[clamp(16px,1.3vw,18px)] leading-[1.75] text-ash">{companyIntro.body}</p>
            <Link href="/about/company" className="link-en mt-8">
              ABOUT →
            </Link>
          </Reveal>
        </div>

        <ol className="lg:col-span-6 lg:col-start-7">
          {services.map((service, index) => (
            <Reveal as="li" key={service.key} delay={80 * index}>
              <div className="grid grid-cols-[minmax(0,1fr)] gap-2 border-t border-stone py-6 md:grid-cols-[180px_minmax(0,1fr)] md:items-baseline md:gap-8 md:py-7">
                <p className="flex items-baseline gap-4">
                  <span className="font-en text-[12px] tabular-nums text-ash">{String(index + 1).padStart(2, "0")}</span>
                  <span className="font-en text-[clamp(26px,2.4vw,34px)] leading-none font-extrabold tracking-[-0.03em]">{service.name}</span>
                </p>
                <p className="text-[17px] leading-[1.5]">
                  {service.line}
                  <span className="mt-1 block text-[14px] text-ash">{service.scope}</span>
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
