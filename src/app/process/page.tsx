import type { Metadata } from "next";
import { ContactCta } from "@/components/home/ContactCta";
import { PageIntro } from "@/components/layout/PageIntro";
import { ProcessFlow } from "@/components/process/ProcessFlow";
import { OneStopSystem } from "@/components/process/OneStopSystem";
import { processIntro } from "@/data/process";

/**
 * 머리 영역 배경 — 유리 성형기 영상(자료/09_PROCESS/process-intro.mp4).
 * 8초 이후 장면만 반복하고, 빛나는 유리병 줄 쪽으로 1.25배 확대(원본 1920×1080 → 화질 유지 범위).
 * 영상이 준비될 때까지는 차콜 바탕, 모션 줄이기에서는 8초 장면에서 멈춤.
 */
const INTRO_VIDEO = { src: "/assets/process/process-intro.mp4", start: 8, zoom: 1.25, focus: "50% 68%" };

export const metadata: Metadata = { title: "Process" };

export default function ProcessPage() {
  return (
    <>
      <PageIntro title={processIntro.title} intro={processIntro.lead} backdrop="d" motionVideo={INTRO_VIDEO} />
      <ProcessFlow />
      <OneStopSystem />
      <ContactCta />
    </>
  );
}
