import { Pending } from "@/components/ui/Pending";
import type { Product } from "@/data/products";

/**
 * 규격 표 — 제품 코드 · 용량 · 사이즈 · 재질 · MOQ (기획서 2.0 §4.3).
 * 병목 규격은 값이 있을 때만 표시한다. 값이 없으면 "—"로 두고 임의 값을 넣지 않는다.
 */
export function ProductSpecs({ product }: { product: Product }) {
  const rows: { label: string; value: string | null | undefined }[] = [
    { label: "제품 코드", value: product.code },
    { label: "용량", value: product.capacity },
    { label: "사이즈", value: product.dimensions },
    { label: "재질", value: product.material },
    { label: "MOQ", value: product.moq },
  ];
  if (product.neck) rows.push({ label: "병목 규격", value: product.neck });

  const hasMissing = rows.some((row) => !row.value);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 border-b border-charcoal pb-3">
        <h2 className="label-en">Specification</h2>
        {hasMissing && <Pending label="규격 확인 필요" />}
      </div>
      <dl>
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[96px_minmax(0,1fr)] items-baseline gap-4 border-b border-stone py-3.5 text-[15px]">
            <dt className="text-ash">{row.label}</dt>
            <dd className="font-en tabular-nums">{row.value ?? "—"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
