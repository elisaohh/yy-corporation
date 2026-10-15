/**
 * ABOUT 이미지 웹 사본 — 자료/08_ABOUT/ → public/assets/about/*.webp
 *   01a · 01b: Pexels 무료 라이선스 사진(-pexels-ID)
 *   02–05: 사용자가 제공한 생성 이미지(-generated)
 * 모두 실제 YY 제품 · 시설 사진이 아니다(분위기 연출용). 원본은 수정하지 않는다.
 *
 *   node scripts/build-about-images.mjs
 */
import sharp from "sharp";
import { mkdir, readdir } from "node:fs/promises";

const SRC = "자료/08_ABOUT";
const OUT = "public/assets/about";
await mkdir(OUT, { recursive: true });

for (const f of (await readdir(SRC)).filter((n) => /\.(jpe?g|webp|png)$/i.test(n))) {
  const name = f.replace(/-(pexels-\d+|generated)\.(jpe?g|webp|png)$/i, "");
  const out = `${OUT}/${name}.webp`;
  const info = await sharp(`${SRC}/${f}`).rotate().resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toFile(out);
  console.log(`${f} → ${out} ${info.width}×${info.height} ${Math.round(info.size / 1024)}KB`);
}
