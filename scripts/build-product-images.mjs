/**
 * 제품 사진 웹용 사본 만들기
 *   원본:  자료/03_제품/제품사진/<코드>_<번호>.png   (수정하지 않음)
 *   사본:  public/assets/products/<코드>/<코드>_<번호>.webp      — 표시용 (원본 크기 유지, 확대하지 않음)
 *          public/assets/products/<코드>/<코드>_<번호>-thumb.webp — 썸네일 160px
 *
 * 실행: node scripts/build-product-images.mjs
 * 원본을 고해상도로 교체한 뒤 다시 실행하면 사본이 갱신된다(최대 1600px).
 */
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("자료/03_제품/제품사진");
const OUT = path.resolve("public/assets/products");
const MAX = 1600;
const THUMB = 160;

const files = (await readdir(SRC)).filter((name) => /\.(png|jpe?g)$/i.test(name)).sort();
const report = [];

for (const name of files) {
  const match = name.match(/^(.+)_(\d{2})\.(png|jpe?g)$/i);
  if (!match) {
    report.push(`건너뜀(이름 규칙 불일치): ${name}`);
    continue;
  }
  const [, code, no] = match;
  const dir = path.join(OUT, code);
  await mkdir(dir, { recursive: true });

  const input = path.join(SRC, name);
  const meta = await sharp(input).metadata();

  const display = await sharp(input)
    .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 100, effort: 5 })
    .toFile(path.join(dir, `${code}_${no}.webp`));

  await sharp(input)
    .resize({ width: THUMB, height: THUMB, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85, alphaQuality: 100 })
    .toFile(path.join(dir, `${code}_${no}-thumb.webp`));

  report.push(
    `${name}  ${meta.width}×${meta.height}${meta.hasAlpha ? " (투명 배경)" : " (흰 배경)"}  →  ${display.width}×${display.height} webp ${(display.size / 1024).toFixed(0)}KB`,
  );
}

console.log(report.join("\n"));
