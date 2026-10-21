import type { MediaAsset } from "./assets";
import data from "../../content/products.json";

/**
 * 제품 사진 등록부 — content/products.json의 사진 경로를 자산 ID로 그대로 쓴다.
 * 사진 파일은 public/assets/products/ (관리 화면에서 올리면 여기에 저장된다).
 */
export const productImageAssets: Record<string, MediaAsset> = Object.fromEntries(
  data.items.flatMap((item) =>
    (item.images ?? []).filter(Boolean).map((src, i) => {
      const asset: MediaAsset = {
        kind: "image",
        src,
        alt: `${item.code} 제품 사진 ${i + 1}`,
        width: 600,
        height: 600,
        status: "final",
      };
      return [src, asset] as const;
    }),
  ),
);
