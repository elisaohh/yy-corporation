import type { Metadata } from "next";
import { Suspense } from "react";
import { PageIntro } from "@/components/layout/PageIntro";
import { ProductCatalog } from "@/components/product/ProductCatalog";
import { Pending } from "@/components/ui/Pending";

export const metadata: Metadata = { title: "Product" };

export default function ProductsPage() {
  return (
    <>
      <PageIntro
        title="Product"
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
