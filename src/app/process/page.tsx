import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { StageNotice } from "@/components/layout/StageNotice";
import { Pending } from "@/components/ui/Pending";

export const metadata: Metadata = { title: "Process" };

export default function ProcessPage() {
  return (
    <>
      <PageIntro title="Process" intro={<>짧은 한글 소개 <Pending /></>} />
      <StageNotice
        stage="PROCESS 단계"
        sections={[
          "공정 탭 5개 — 명칭·설명 확인 필요",
          "왼쪽 3D 병 / 오른쪽 공정 사진 · 설명",
          "큰 메인 이미지 + 가로 썸네일",
        ]}
      />
    </>
  );
}
