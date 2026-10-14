/**
 * 현장(작업) 사진 웹 사본 — 자료/02_후가공/작업사진/*.jpg → public/assets/site/
 * 2026-10-15 사용자 결정: 공정별 매칭 없이 "관리 현장" 사진으로 사용. 원본은 수정하지 않는다.
 * 순서는 ORDER(성형 → 병 → 부자재 → 검사 · 포장 → 출고) — 바꾸려면 여기만 고친다.
 *
 *   node scripts/build-site-photos.mjs
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const SRC = "자료/02_후가공/작업사진";
const OUT = "public/assets/site";
const ORDER = [11, 2, 9, 12, 3, 13, 7, 6, 5, 15, 14, 4, 8, 10, 1];

await mkdir(OUT, { recursive: true });
const photos = [];
for (const [i, n] of ORDER.entries()) {
  const file = `${SRC}/1 (${n}).jpg`;
  const name = `site-${String(i + 1).padStart(2, "0")}`;
  const img = sharp(file).rotate();
  const meta = await img.metadata();
  await img.clone().webp({ quality: 80 }).toFile(`${OUT}/${name}.webp`);
  await sharp(file).rotate().resize(240, 180, { fit: "cover" }).webp({ quality: 70 }).toFile(`${OUT}/${name}-thumb.webp`);
  photos.push({ src: `/assets/site/${name}.webp`, thumb: `/assets/site/${name}-thumb.webp`, width: meta.width, height: meta.height, original: `1 (${n}).jpg` });
}
await writeFile("src/data/site-photos.json", JSON.stringify(photos, null, 2) + "\n");
console.log(`${photos.length} photos`);
