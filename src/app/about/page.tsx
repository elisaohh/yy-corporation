import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { StageNotice } from "@/components/layout/StageNotice";
import { Pending } from "@/components/ui/Pending";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <PageIntro title="About" intro={<>짧은 한글 소개 <Pending /></>} />
      <StageNotice
        stage="ABOUT 단계"
        sections={["브랜드 슬로건", "회사 소개", "핵심 가치", "전문 역량 — SOURCING / FINISHING / MATCHING / DELIVERY", "회사 정보"]}
      />
    </>
  );
}
