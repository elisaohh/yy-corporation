import type { Metadata } from "next";
import { ContactCta } from "@/components/home/ContactCta";
import { PageIntro } from "@/components/layout/PageIntro";
import { Reveal } from "@/components/motion/Reveal";
import { FinishingSections } from "@/components/process/FinishingSections";
import { SiteGallery } from "@/components/process/SiteGallery";
import { Pending } from "@/components/ui/Pending";
import { onSite, processIntro } from "@/data/process";

export const metadata: Metadata = { title: "Process" };

/**
 * PROCESS — 큰 영문 타이틀 + 짧은 한글 소개 → 후가공 4공정(고정 탭) → 현장 사진 → CTA (부록 F).
 * 추가 공정(핫스탬핑 등)은 제공 여부 확정 전이라 싣지 않는다.
 */
export default function ProcessPage() {
  return (
    <>
      <PageIntro title={processIntro.title} intro={processIntro.lead} />

      <FinishingSections />

      <section data-header-theme="light" aria-labelledby="onsite-title" className="bg-paper py-24 md:py-36">
        <div className="container-yy">
          <div className="grid gap-6 md:grid-cols-12 md:items-end md:gap-8">
            <Reveal className="md:col-span-7">
              <p className="label-en text-ash">{onSite.label}</p>
              <h2 id="onsite-title" className="mt-6 text-[clamp(28px,3.4vw,48px)] leading-[1.25] font-bold tracking-[-0.035em]">
                {onSite.title.text}
              </h2>
              {onSite.title.status === "draft" && <Pending kind="draft" className="mt-3" />}
            </Reveal>
            <Reveal delay={120} className="md:col-span-4 md:col-start-9">
              <p className="text-[16px] leading-[1.8] text-ash">{onSite.body}</p>
            </Reveal>
          </div>
          <div className="mt-12 md:mt-16">
            <SiteGallery />
          </div>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
