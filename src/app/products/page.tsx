import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { StageNotice } from "@/components/layout/StageNotice";
import { Pending } from "@/components/ui/Pending";

export const metadata: Metadata = { title: "Product" };

export default function ProductsPage() {
  return (
    <>
      <PageIntro title="Product" intro={<>짧은 한글 소개 <Pending /></>} />
      <StageNotice
        stage="PRODUCT 단계"
        sections={[
          "카테고리 탭 — ALL / GLASS BOTTLE / DROPPER / CAP / ACCESSORIES",
          "제품 카드 그리드 (3열 / 2열 / 1–2열)",
          "LOAD MORE · 빈 카테고리 안내",
          "상세 페이지 — 캐러셀 · 썸네일 · 규격 · 문의하기",
        ]}
      />
    </>
  );
}
