import type { Metadata } from "next";
import { AboutIntro } from "@/components/about/AboutIntro";
import { ExpertiseList } from "@/components/about/ExpertiseList";
import { VisionStatement } from "@/components/about/VisionStatement";
import { ContactCta } from "@/components/home/ContactCta";
import { Reveal } from "@/components/motion/Reveal";
import { Pending } from "@/components/ui/Pending";
import { story, values } from "@/data/about";
import { company } from "@/data/company";

export const metadata: Metadata = { title: "About" };

/**
 * ABOUT — 로고 · 타이포그래피 · 여백 중심, 제품 · 공정 사진 없음(기획서 4.2, 부록 E).
 * 흐름: 인트로(로고 + 슬로건) → 이야기 → 비전 → 핵심 가치 → 전문 역량 → 회사 정보 → CTA
 * 문구는 모두 data/about.ts(회사 작성 자료)에서 가져온다.
 */
export default function AboutPage() {
  const info: { label: string; value: string | null }[] = [
    { label: "회사명", value: company.legalName },
    { label: "대표", value: company.representative },
    { label: "사업자등록번호", value: company.businessNumber },
    { label: "주소", value: company.address },
    { label: "전화", value: company.phone },
    { label: "이메일", value: company.email },
  ];

  return (
    <>
      <AboutIntro />

      {/* ② 이야기 — 문장 단위 순차 등장 */}
      <section data-header-theme="light" aria-labelledby="story-title" className="bg-paper py-28 md:py-40">
        <div className="container-yy grid gap-10 lg:grid-cols-12 lg:gap-8">
          <p className="label-en text-ash lg:col-span-3 lg:pt-3">{story.label}</p>
          <div className="lg:col-span-8 lg:col-start-5">
            <Reveal>
              <h2 id="story-title" className="max-w-[18ch] text-[clamp(28px,3.4vw,50px)] leading-[1.3] font-bold tracking-[-0.035em]">
                {story.title}
              </h2>
            </Reveal>
            <div className="mt-12 grid max-w-[44ch] gap-6 md:mt-16">
              {story.sentences.map((sentence, i) => (
                <Reveal as="p" key={i} delay={i * 90} className="text-[clamp(16px,1.3vw,19px)] leading-[1.85] text-charcoal/85">
                  {sentence}
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <VisionStatement />

      {/* ④ 핵심 가치 — 큰 숫자 + 영문 키워드 + 한글 설명 */}
      <section data-header-theme="light" aria-labelledby="values-title" className="bg-paper py-28 md:py-40">
        <div className="container-yy">
          <h2 id="values-title" className="label-en text-ash">
            Core Values
          </h2>
          <ol className="mt-12 grid gap-x-8 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
            {values.map((value, i) => (
              <Reveal as="li" key={value.key} delay={i * 90} className="border-t border-charcoal py-8">
                <p className="font-en text-[clamp(56px,6vw,96px)] leading-none font-extralight tabular-nums tracking-[-0.04em]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-8 font-en text-[clamp(20px,1.7vw,24px)] font-bold tracking-[-0.02em] uppercase">{value.key}</p>
                <p className="mt-2 text-[16px] text-ash">{value.line}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ⑤ 전문 역량 */}
      <section data-header-theme="light" aria-labelledby="expertise-title" className="bg-paper pb-28 md:pb-40">
        <div className="container-yy">
          <h2 id="expertise-title" className="label-en mb-12 text-ash md:mb-16">
            Expertise
          </h2>
          <ExpertiseList />
        </div>
      </section>

      {/* ⑥ 회사 정보 */}
      <section data-header-theme="light" aria-labelledby="company-title" className="bg-paper pb-28 md:pb-40">
        <div className="container-yy grid gap-10 lg:grid-cols-12 lg:gap-8">
          <h2 id="company-title" className="label-en text-ash lg:col-span-3 lg:pt-6">
            Company
          </h2>
          <dl className="lg:col-span-8 lg:col-start-5">
            {info.map((row) => (
              <div key={row.label} className="grid grid-cols-[120px_minmax(0,1fr)] gap-4 border-t border-stone py-5 text-[15px] md:grid-cols-[180px_minmax(0,1fr)] md:text-[16px]">
                <dt className="text-ash">{row.label}</dt>
                <dd>
                  {!row.value ? (
                    <Pending />
                  ) : row.label === "이메일" ? (
                    <a href={`mailto:${row.value}`} className="underline-offset-4 hover:underline">
                      {row.value}
                    </a>
                  ) : row.label === "전화" ? (
                    <a href={`tel:${row.value.replace(/-/g, "")}`} className="underline-offset-4 hover:underline">
                      {row.value}
                    </a>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
