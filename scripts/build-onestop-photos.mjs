/**
 * PROCESS "PACKAGING TURN-KEY" 사진 웹 사본 — 자료/02_후가공/작업사진/{glass,delivery,coating,tube,printing,etching,labeling,dropper,pump,spray}-NN.(jpg|png)
 *   → public/assets/process/onestop/<이름>.webp (원본 수정 없음)
 *
 *   node scripts/build-onestop-photos.mjs
 */
import sharp from "sharp";
import { mkdir, readdir } from "node:fs/promises";

const SRC = "자료/02_후가공/작업사진";
const OUT = "public/assets/process/onestop";
await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter((f) => /^(glass|delivery|coating|tube|printing|etching|labeling|dropper|pump|spray)-\d{2}\.(jpe?g|png)$/i.test(f)).sort();
for (const f of files) {
  const name = f.replace(/\.(jpe?g|png)$/i, "");
  const meta = await sharp(`${SRC}/${f}`).rotate().metadata();
  await sharp(`${SRC}/${f}`).rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toFile(`${OUT}/${name}.webp`);
  console.log(`${f} ${meta.width}×${meta.height} → ${OUT}/${name}.webp`);
}
