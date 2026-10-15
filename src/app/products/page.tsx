import type { Metadata } from "next";
import { Suspense } from "react";
import { PageIntro } from "@/components/layout/PageIntro";
import { ProductCatalog } from "@/components/product/ProductCatalog";

/** 머리 영역(D안) 배경 이미지 — 교체할 때 이 경로만 바꾼다 */
const INTRO_IMAGE = "/assets/hero/hero-base.webp";

export const metadata: Metadata = { title: "Product" };

/** PRODUCT 소개 — 첫 문장은 엑셀 MAIN 시트 '대표 제품 소개'(유리용기) 문구 */
const productIntro = "다양한 용량과 디자인의 프리미엄 화장품 유리용기를 제공합니다. 제품을 선택하면 규격을 확인하고 바로 문의할 수 있습니다.";



export default function ProductsPage() {
  return (
    <>
      <PageIntro
        title="Product"
        backdrop="d"
        gapAfter
        motionImage={INTRO_IMAGE}
        motionTone="light"
        intro={productIntro}
      />
      <Suspense fallback={<div className="container-yy min-h-[60svh]" aria-busy="true" />}>
        <ProductCatalog />
      </Suspense>
    </>
  );
}
