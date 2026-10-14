import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import { Pending } from "@/components/ui/Pending";
import { featuredProductIds } from "@/data/home";
import { getProductById, type Product } from "@/data/products";

/**
 * ⑤ 대표 제품 쇼케이스 — 2–3개를 크게, 비대칭 배치 (부록 B4).
 * 카드는 PRODUCT 목록과 같은 컴포넌트를 쓴다. 지금은 기능 검증용 임시 제품을 가리킨다.
 */
export function Showcase() {
  const featured = featuredProductIds.map(getProductById).filter((p): p is Product => Boolean(p)).slice(0, 3);
  if (featured.length === 0) return null;
  const [main, ...rest] = featured;

  return (
    <section data-header-theme="light" aria-labelledby="showcase-title" className="bg-paper pb-32 md:pb-48">
      <div className="container-yy">
        <div className="flex flex-wrap items-end justify-between gap-6 border-t border-stone pt-10 md:pt-14">
          <div>
            <h2 id="showcase-title" className="font-en text-[clamp(26px,3vw,40px)] leading-[1.15] font-light tracking-[0.08em] uppercase">
              Product
            </h2>
            <p className="mt-3 text-[15px] text-ash">
              대표 제품 소개 문구 <Pending />
            </p>
          </div>
          <Link href="/products" className="link-en">
            VIEW ALL PRODUCTS →
          </Link>
        </div>

        <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-12 md:gap-8">
          <Reveal className="md:col-span-7">
            <ProductCard product={main} />
          </Reveal>
          <div className="grid gap-12 pl-[18%] md:col-span-4 md:col-start-9 md:gap-24 md:pl-0">
            {rest.map((product, index) => (
              <Reveal key={product.id} delay={140 * (index + 1)} className={index === 1 ? "ml-auto w-[78%]" : ""}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
