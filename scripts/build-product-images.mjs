/**
 * 제품 사진 웹용 사본 만들기
 *   원본:  자료/03_제품/제품사진/<코드>_<번호>.png   (수정하지 않음)
 *   사본:  public/assets/products/<코드>_<번호>.webp — 표시용 (원본 크기 유지, 확대하지 않음, 최대 1600px)
 *
 * 실행: node scripts/build-product-images.mjs
 * 관리 화면(/admin)에서 사진을 바로 올려도 된다. 이 스크립트는 여러 장을 한꺼번에 가볍게(webp) 바꿀 때 쓴다.
 * 만든 사진은 관리 화면의 제품 "사진" 칸에서 골라 넣는다.
 */
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("자료/03_제품/제품사진");
const OUT = path.resolve("public/assets/products");
const MAX = 1600;

const files = (await readdir(SRC)).filter((name) => /\.(png|jpe?g)$/i.test(name)).sort();
const report = [];

for (const name of files) {
  const match = name.match(/^(.+)_(\d{2})\.(png|jpe?g)$/i);
  if (!match) {
    report.push(`건너뜀(이름 규칙 불일치): ${name}`);
    continue;
  }
  const [, code, no] = match;
  await mkdir(OUT, { recursive: true });

  const input = path.join(SRC, name);
  const meta = await sharp(input).metadata();

  const display = await sharp(input)
    .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 100, effort: 5 })
    .toFile(path.join(OUT, `${code}_${no}.webp`));


  report.push(
    `${name}  ${meta.width}×${meta.height}${meta.hasAlpha ? " (투명 배경)" : " (흰 배경)"}  →  ${display.width}×${display.height} webp ${(display.size / 1024).toFixed(0)}KB`,
  );
}

console.log(report.join("\n"));
