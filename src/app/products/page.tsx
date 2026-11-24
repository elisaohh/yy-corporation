import type { Metadata } from "next";
import { Suspense } from "react";
import { PageIntro } from "@/components/layout/PageIntro";
import { EditButton, EditToolbar } from "@/components/edit/EditContext";
import { ProductCatalog } from "@/components/product/ProductCatalog";

/** 머리 영역 배경 이미지 — 교체할 때 이 경로만 바꾼다 */
const INTRO_IMAGE = "/assets/hero/hero-base.webp";

export const metadata: Metadata = { title: "제품", description: "와이와이코퍼레이션 화장품 용기 제품 — 유리 병, 단지(크림 용기), 드로퍼, 캡, 부자재." };

/** PRODUCT 소개 — 첫 문장은 엑셀 MAIN 시트 '대표 제품 소개'(유리용기) 문구 */
const productIntro = "다양한 용량과 디자인의 프리미엄 화장품 유리용기를 제공합니다. 제품을 선택하면 규격을 확인하고 바로 문의할 수 있습니다.";

/** 카탈로그 PDF — 새 호를 낼 때 public/downloads/에 파일을 넣고 이 경로 · 용량만 바꾼다 */
const CATALOG = { href: "/downloads/YY_Glass_Catalog_2026_Vol01.pdf", size: "23MB" };


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
            <p>{productIntro}</p>
            <a href={CATALOG.href} download className="btn mt-8 text-charcoal">
              카탈로그 다운로드
              <span className="font-en text-[12px] tracking-[0.06em] text-ash">PDF · {CATALOG.size}</span>
            </a>
          </>
        }
      />
      <EditToolbar className="container-yy -mt-4 mb-8 md:-mt-6">
        <EditButton request={{ type: "product", code: null }}>+ 제품 추가</EditButton>
        <EditButton request={{ type: "order" }}>순서 · 홈 노출</EditButton>
      </EditToolbar>
      <Suspense fallback={<div className="container-yy min-h-[60svh]" aria-busy="true" />}>
        <ProductCatalog />
      </Suspense>
    </>
  );
}
