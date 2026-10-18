/**
 * STORY(뉴스레터) 이미지 웹 사본 — 자료/10_STORY/<글>-NN.(jpg|png) → public/assets/story/<글>-NN.webp
 * 원본보다 크게 늘리지 않는다. 실행: node scripts/build-story-images.mjs
 */
import sharp from "sharp";
import { mkdir, readdir } from "node:fs/promises";

const SRC = "자료/10_STORY";
const OUT = "public/assets/story";
await mkdir(OUT, { recursive: true });
for (const f of (await readdir(SRC)).filter((n) => /\.(jpe?g|png)$/i.test(n)).sort()) {
  const name = f.replace(/\.(jpe?g|png)$/i, "");
  const meta = await sharp(`${SRC}/${f}`).metadata();
  await sharp(`${SRC}/${f}`).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 86 }).toFile(`${OUT}/${name}.webp`);
  console.log(`${f} ${meta.width}×${meta.height} → ${OUT}/${name}.webp`);
}
