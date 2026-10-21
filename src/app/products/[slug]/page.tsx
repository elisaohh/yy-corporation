import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BackToProducts, BackToProductsFallback } from "@/components/product/BackToProducts";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductSpecs } from "@/components/product/ProductSpecs";
import { Pending } from "@/components/ui/Pending";
import { productCategories } from "@/data/categories";
import { EditButton, EditToolbar } from "@/components/edit/EditContext";
import { getProduct, products } from "@/data/products";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return { title: product ? product.name : "Product" };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = productCategories.find((item) => item.slug === product.category);

  return (
    <section data-header-theme="light" className="container-yy pb-32 pt-[calc(var(--header-h)+24px)] md:pt-[calc(var(--header-h)+40px)]">
      <Suspense fallback={<BackToProductsFallback />}>
        <BackToProducts />
      </Suspense>

      <div className="mt-6 grid gap-10 md:mt-8 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6 lg:col-start-1">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        <div className="lg:sticky lg:top-[calc(var(--header-h)+32px)] lg:col-span-5 lg:col-start-8 lg:self-start">
          {category && (
            <p className="label-en text-ash">
              {category.label}
              <span className="sr-only"> · {category.labelKo}</span>
            </p>
          )}
          <h1 className="mt-4 text-[clamp(24px,2.4vw,32px)] leading-[1.3] font-medium tracking-[-0.02em]">{product.name}</h1>
          <EditToolbar className="mt-4">
            <EditButton request={{ type: "product", code: product.code }}>이 제품 수정</EditButton>
          </EditToolbar>
          {product.isPlaceholder && (
            <p className="mt-3">
              <Pending kind="temporary" label="기능 검증용 임시 제품 — 실제 제품 정보 아님" />
            </p>
          )}
          {product.description && <p className="mt-6 text-[16px] leading-[1.75] text-ash">{product.description}</p>}

          <div className="mt-10">
            <ProductSpecs product={product} />
          </div>

          <Link href={`/contact?product=${product.id}`} className="btn btn-primary mt-10 w-full">
            문의하기
          </Link>
          <p className="mt-3 text-[13px] text-ash">문의 폼에 이 제품의 코드가 자동으로 입력됩니다.</p>
        </div>
      </div>
    </section>
  );
}
