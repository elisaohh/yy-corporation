/**
 * 올린 사진을 브라우저에서 가볍게 — 긴 변 최대 1600px, webp(투명 배경 유지).
 * 브라우저가 webp를 만들지 못하면 원본 그대로 쓴다.
 */
const MAX = 1600;

export async function toWebp(file: File): Promise<{ blob: Blob; ext: string; width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.9));
  if (blob && blob.type === "image/webp") return { blob, ext: "webp", width, height };
  const ext = (file.name.split(".").pop() || "png").toLowerCase();
  return { blob: file, ext, width, height };
}
