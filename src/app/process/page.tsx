import type { Metadata } from "next";
import { ContactCta } from "@/components/home/ContactCta";
import { PageIntro, type IntroBackdrop } from "@/components/layout/PageIntro";
import { FinishingSections } from "@/components/process/FinishingSections";
import { ProcessFlow } from "@/components/process/ProcessFlow";
import { OneStopSystem } from "@/components/process/OneStopSystem";
import { processIntro } from "@/data/process";

export const metadata: Metadata = { title: "Process" };

/** 머리 영역 배경 시안 비교용 — ?bg=a|b|c|d (결정 후 삭제) */
function pickBackdrop(v: string | string[] | undefined): IntroBackdrop {
  const s = Array.isArray(v) ? v[0] : v;
  return s === "a" || s === "b" || s === "c" || s === "d" ? s : "none";
}


export default async function ProcessPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const backdrop = pickBackdrop((await searchParams).bg);
  return (
    <>
      <PageIntro title={processIntro.title} intro={processIntro.lead} backdrop={backdrop} motionImage="/assets/process/onestop/glass-01.webp" />
      <ProcessFlow />
      <OneStopSystem />
      <FinishingSections />
      <ContactCta />
    </>
  );
}
