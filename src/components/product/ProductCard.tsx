import Link from "next/link";
import { EditButton } from "@/components/edit/EditContext";
import { AssetImage } from "@/components/media/AssetImage";
import { Pending } from "@/components/ui/Pending";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  /** 상세에서 돌아올 카테고리 탭 (ALL이면 생략) */
  fromCategory?: string;
  /** 상세에서 돌아올 용량 필터 */
  fromMl?: string;
  /** LOAD MORE 후 첫 새 카드로 포커스를 옮길 때 사용 */
  linkRef?: (el: HTMLAnchorElement | null) => void;
}

/**
 * 제품 카드 — Card(#F5F5F3) 바탕, 테두리·그림자 없음, 이미지 정사각형 contain(여백 포함).
 * 호버 시 두 번째 사진으로 크로스페이드 + 미세 확대 (기획서 2.0 부록 D).
 * 흰 배경 제품 사진은 multiply 혼합으로 카드 바탕에 자연스럽게 섞는다(원본 파일은 그대로).
 */
export function ProductCard({ product, fromCategory, fromMl, linkRef }: ProductCardProps) {
  const [primary, secondary] = product.images;
  const from = new URLSearchParams();
  if (fromCategory) from.set("from", fromCategory);
  if (fromMl) from.set("ml", fromMl);
  const href = `/products/${product.slug}${from.size ? `?${from}` : ""}`;

  return (
    <div className="relative">
      <Link ref={linkRef} href={href} className="group block outline-offset-4">
        <div className="relative aspect-square overflow-hidden bg-card">
          {primary && (
            <AssetImage
              id={primary}
              decorative
              className={`absolute inset-[8%] size-[84%] object-contain mix-blend-multiply transition-[opacity,transform] duration-500 ease-[var(--ease-yy-out)] group-hover:scale-[1.02] ${
                secondary ? "group-hover:opacity-0" : ""
              }`}
            />
          )}
          {secondary && (
            <AssetImage
              id={secondary}
              decorative
              className="absolute inset-[8%] size-[84%] scale-[1.02] object-contain mix-blend-multiply opacity-0 transition-[opacity,transform] duration-500 ease-[var(--ease-yy-out)] group-hover:scale-100 group-hover:opacity-100"
            />
          )}
          {product.isPlaceholder && (
            <span className="absolute left-3 top-3">
              <Pending kind="temporary" label="기능 검증용" />
            </span>
          )}
        </div>
        <div className="mt-4 grid gap-1">
          <h3 className="font-en text-[15px] leading-snug font-medium tracking-[-0.01em]">{product.code ?? product.name}</h3>
          <p className="font-en text-[13px] tabular-nums text-ash">
            <span className="sr-only">용량 </span>
            {product.capacity ?? "—"}
          </p>
        </div>
      </Link>
      <EditButton request={{ type: "product", code: product.code }} label={`${product.code} 수정`} className="absolute top-3 right-3 z-10">
        수정
      </EditButton>
    </div>
  );
}
