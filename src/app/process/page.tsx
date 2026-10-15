import type { Metadata } from "next";
import { ContactCta } from "@/components/home/ContactCta";
import { PageIntro } from "@/components/layout/PageIntro";
import { FinishingSections } from "@/components/process/FinishingSections";
import { ProcessFlow } from "@/components/process/ProcessFlow";
import { OneStopSystem } from "@/components/process/OneStopSystem";
import { processIntro } from "@/data/process";

/** 머리 영역(D안) 배경 이미지 — 교체할 때 이 경로만 바꾼다 */
const INTRO_IMAGE = "/assets/process/onestop/glass-01.webp";

export const metadata: Metadata = { title: "Process" };



export default function ProcessPage() {
  return (
    <>
      <PageIntro title={processIntro.title} intro={processIntro.lead} backdrop="d" motionImage={INTRO_IMAGE} />
      <ProcessFlow />
      <OneStopSystem />
      <FinishingSections />
      <ContactCta />
    </>
  );
}
