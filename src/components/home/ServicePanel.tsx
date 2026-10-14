import { AssetImage, isPlaceholderAsset } from "@/components/media/AssetImage";
import { Pending } from "@/components/ui/Pending";
import type { Service } from "@/data/home";
import { exampleNotice } from "@/data/process";

/** FIND / DRESS / MATCH / DELIVER 이미지 패널 — 이미지 여러 장을 나란히, 흰 바탕은 multiply로 카드색에 섞는다 */
export function ServicePanel({ service, className = "" }: { service: Service; className?: string }) {
  const placeholder = service.images.some((id) => isPlaceholderAsset(id));
  return (
    <div className={`relative overflow-hidden bg-card ${className}`}>
      <div className="absolute inset-0 flex items-end justify-center gap-[2%] px-[6%] pb-[6%] pt-[10%]">
        {service.images.map((id) => (
          <AssetImage key={id} id={id} className="h-full min-w-0 flex-1 object-contain object-bottom mix-blend-multiply" />
        ))}
      </div>
      {placeholder && (
        <span className="absolute left-4 top-4">
          <Pending kind="temporary" label="임시 이미지" />
        </span>
      )}
      {service.generatedExample && (
        <p className="absolute bottom-3 right-4 text-right text-[11px] leading-snug text-ash">{exampleNotice}</p>
      )}
    </div>
  );
}
