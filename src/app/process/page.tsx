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
// 영상은 원본의 8초 이후 · 화면에 보이던 부분(1.25배 확대 구간)만 잘라 H.264로 줄인 것(7MB → 3.4MB)
const INTRO_VIDEO = { src: "/assets/process/process-intro.mp4", focus: "50% 68%" };

export const metadata: Metadata = { title: "공정 · 후가공", description: "와이와이코퍼레이션의 진행 과정 — 프리몰드 소싱, 부식 · 코팅 · 인쇄 · 라벨 후가공, 부자재 매칭, 발주 · 입출고 · 납품." };

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
