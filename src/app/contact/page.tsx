import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { StageNotice } from "@/components/layout/StageNotice";
import { Pending } from "@/components/ui/Pending";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageIntro title="Contact" intro={<>짧은 한글 소개 <Pending /></>} />
      <StageNotice
        stage="CONTACT 단계"
        sections={[
          "왼쪽 지도 · 회사 정보 / 오른쪽 문의 폼 (모바일은 폼 먼저)",
          "필수: 회사명 · 담당자명 · 이메일 · 연락처 · 문의 내용 · 개인정보 동의",
          "선택: 관심 제품 · 예상 발주 수량",
          "실제 전송 없는 데모 상태 안내",
        ]}
      />
    </>
  );
}
