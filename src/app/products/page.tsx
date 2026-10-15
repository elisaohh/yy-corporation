import type { Metadata } from "next";
import { Suspense } from "react";
import { PageIntro, type IntroBackdrop } from "@/components/layout/PageIntro";
import { ProductCatalog } from "@/components/product/ProductCatalog";
import { Pending } from "@/components/ui/Pending";

export const metadata: Metadata = { title: "Product" };

/** 머리 영역 배경 시안 비교용 — ?bg=a|b|c|d (결정 후 삭제) */
function pickBackdrop(v: string | string[] | undefined): IntroBackdrop {
  const s = Array.isArray(v) ? v[0] : v;
  return s === "a" || s === "b" || s === "c" || s === "d" ? s : "none";
}


export default async function ProductsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const backdrop = pickBackdrop((await searchParams).bg);
  return (
    <>
      <PageIntro
        title="Product"
        backdrop={backdrop}
        motionImage="/assets/hero/hero-base.webp"
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
