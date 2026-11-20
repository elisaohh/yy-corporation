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
import { getProduct, products, sameShape } from "@/data/products";

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
  if (!product) return { title: "제품" };
  const kind = productCategories.find((c) => c.slug === product.category)?.labelKo;
  const desc = [product.name, product.capacity, kind].filter(Boolean).join(" · ");
  return { title: product.name, description: `${desc} — 와이와이코퍼레이션 화장품 용기 제품` };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = productCategories.find((item) => item.slug === product.category);
  const sizes = sameShape(product);

  return (
    <section data-header-theme="light" className="container-yy pb-32 pt-[calc(var(--header-h)+24px)] md:pt-[calc(var(--header-h)+40px)]">
      <Suspense fallback={<BackToProductsFallback />}>
        <BackToProducts />
      </Suspense>

      <div className="mt-6 grid gap-10 md:mt-8 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6 lg:col-start-1">
          <ProductGallery images={product.images} productName={product.name} imported={product.imported} />
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

          {/* 같은 모양 · 다른 용량 — 누르면 그 용량 제품으로 */}
          {sizes.length > 0 && (
            <nav aria-label="같은 모양 다른 용량" className="mt-8">
              <p className="label-en text-ash">Capacity</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {sizes.map((item) => {
                  const on = item.slug === product.slug;
                  return (
                    <li key={item.slug}>
                      {on ? (
                        <span aria-current="page" className="inline-flex h-10 min-w-16 items-center justify-center rounded-md border border-charcoal bg-charcoal px-4 font-en text-[14px] font-semibold tabular-nums text-paper">
                          {item.capacity}
                        </span>
                      ) : (
                        <Link
                          href={`/products/${item.slug}`}
                          aria-label={`${item.capacity} — ${item.code}`}
                          className="inline-flex h-10 min-w-16 items-center justify-center rounded-md border border-stone px-4 font-en text-[14px] tabular-nums text-charcoal transition-colors duration-200 hover:border-charcoal"
                        >
                          {item.capacity}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}

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
