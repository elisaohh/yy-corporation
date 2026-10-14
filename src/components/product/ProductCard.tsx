import Link from "next/link";
import { AssetImage } from "@/components/media/AssetImage";
import { Pending } from "@/components/ui/Pending";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  /** 상세에서 돌아올 카테고리 탭 (ALL이면 생략) */
  fromCategory?: string;
  /** LOAD MORE 후 첫 새 카드로 포커스를 옮길 때 사용 */
  linkRef?: (el: HTMLAnchorElement | null) => void;
}

/**
 * 제품 카드 — Card(#F5F5F3) 바탕, 테두리·그림자 없음, 이미지 4:5 contain.
 * 호버 시 두 번째 사진으로 크로스페이드 + 미세 확대 (기획서 2.0 부록 D).
 */
export function ProductCard({ product, fromCategory, linkRef }: ProductCardProps) {
  const [primary, secondary] = product.images;
  const href = `/products/${product.slug}${fromCategory ? `?from=${fromCategory}` : ""}`;

  return (
    <Link ref={linkRef} href={href} className="group block outline-offset-4">
      <div className="relative aspect-[4/5] overflow-hidden bg-card">
        {primary && (
          <AssetImage
            id={primary}
            decorative
            className={`absolute inset-0 size-full object-contain transition-[opacity,transform] duration-500 ease-[var(--ease-yy-out)] group-hover:scale-[1.02] ${
              secondary ? "group-hover:opacity-0" : ""
            }`}
          />
        )}
        {secondary && (
          <AssetImage
            id={secondary}
            decorative
            className="absolute inset-0 size-full scale-[1.02] object-contain opacity-0 transition-[opacity,transform] duration-500 ease-[var(--ease-yy-out)] group-hover:scale-100 group-hover:opacity-100"
          />
        )}
        {product.isPlaceholder && (
          <span className="absolute left-3 top-3">
            <Pending kind="temporary" label="기능 검증용" />
          </span>
        )}
      </div>
      <div className="mt-4 grid gap-1">
        <h3 className="text-[15px] leading-snug font-medium tracking-[-0.01em]">{product.name}</h3>
        <p className="font-en text-[13px] tabular-nums text-ash">
          <span className="sr-only">제품 코드 </span>
          {product.code ?? "—"}
          <span aria-hidden="true"> · </span>
          <span className="sr-only">, 용량 </span>
          {product.capacity ?? "—"}
        </p>
      </div>
    </Link>
  );
}
