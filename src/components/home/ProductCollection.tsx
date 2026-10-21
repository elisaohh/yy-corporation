import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import { EditButton, EditToolbar } from "@/components/edit/EditContext";
import { homeProducts } from "@/data/products";

/**
 * ④ PRODUCT 컬렉션 — 공정 모션 끝의 "실제 제품으로 확장"을 이어받아 등록된 제품 전체를 보여 준다.
 * 카드는 PRODUCT 페이지와 같은 컴포넌트(상세 · 문의 연결 그대로).
 */
export function ProductCollection() {
  return (
    <section data-header-theme="light" aria-labelledby="collection-title" className="bg-paper pb-28 pt-16 md:pb-40 md:pt-24">
      <div className="container-yy">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 id="collection-title" className="font-en text-[clamp(40px,5.4vw,80px)] leading-none font-extrabold tracking-[-0.04em] uppercase">
              Product
            </h2>
            <p className="mt-4 max-w-[520px] text-[15px] leading-relaxed text-ash">
  하나의 용기에서 시작되는 다양한 가능성.
  <br />
  브랜드의 개성을 담아낸 제품들을 만나보세요.
</p>
          </div>
          <Link href="/products" className="link-en">
            VIEW ALL PRODUCTS →
          </Link>
        </div>

        <EditToolbar className="mt-8">
          <EditButton request={{ type: "order" }}>홈 제품 고르기 · 순서</EditButton>
          <EditButton request={{ type: "product", code: null }}>+ 제품 추가</EditButton>
        </EditToolbar>

        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-16 md:grid-cols-3 md:gap-x-6 lg:grid-cols-5">
          {homeProducts.map((product, index) => (
            <Reveal as="li" key={product.id} delay={70 * index}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
