import type { Metadata } from "next";
import { Suspense } from "react";
import { PageIntro } from "@/components/layout/PageIntro";
import { ProductCatalog } from "@/components/product/ProductCatalog";
import { Pending } from "@/components/ui/Pending";

/** 머리 영역(D안) 배경 이미지 — 교체할 때 이 경로만 바꾼다 */
const INTRO_IMAGE = "/assets/hero/hero-base.webp";

export const metadata: Metadata = { title: "Product" };



export default function ProductsPage() {
  return (
    <>
      <PageIntro
        title="Product"
        backdrop="d"
        gapAfter
        motionImage={INTRO_IMAGE}
        motionTone="light"
        intro={
          <>
            짧은 한글 소개 <Pending />
          </>
        }
      />
      <Suspense fallback={<div className="container-yy min-h-[60svh]" aria-busy="true" />}>
        <ProductCatalog />
      </Suspense>
    </>
  );
}
