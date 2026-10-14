import type { CSSProperties } from "react";
import { getAsset, type AssetId } from "@/data/assets";

interface AssetImageProps extends Partial<Record<`data-${string}`, string>> {
  id: AssetId;
  className?: string;
  /** 첫 화면 이미지만 true */
  priority?: boolean;
  /** 장식 이미지면 alt를 비운다 */
  decorative?: boolean;
  /** 썸네일 사본을 쓸지 */
  thumb?: boolean;
  style?: CSSProperties;
}

/**
 * 자산 등록부(data/assets.ts)의 ID로 이미지를 그린다.
 * 경로가 아직 없는 자산(src: null)은 같은 비율의 빈 자리만 남긴다.
 * 실제 사진으로 교체해도 컴포넌트는 그대로 둔다.
 */
export function AssetImage({ id, className = "", priority, decorative, thumb, style, ...data }: AssetImageProps) {
  const asset = getAsset(id);

  if (!asset.src) {
    return <div aria-hidden="true" className={`bg-card ${className}`} style={style} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG/사진 모두 원본 그대로 표시
    <img
      src={thumb && asset.thumbSrc ? asset.thumbSrc : asset.src}
      alt={decorative ? "" : asset.alt}
      width={asset.width}
      height={asset.height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      draggable={false}
      className={className}
      style={style}
      {...data}
    />
  );
}

export function isPlaceholderAsset(id: AssetId): boolean {
  return getAsset(id).status === "placeholder";
}
