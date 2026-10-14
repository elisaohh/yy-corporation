/**
 * HOME 인트로 장면 이미지 만들기
 *   원본(수정하지 않음)
 *     자료/01_기준유리병/사진/YS-SRRR20-01_01 고해상도.png           → 기준병(투명 유리)
 *     자료/02_후가공/후가공사진/코팅·인쇄·부식·라벨 비교 쇼케이스.png → 후가공 예시 4종(생성 이미지)
 *   사본
 *     public/assets/hero/bottle-clear.webp
 *     public/assets/hero/finish-coating.webp · finish-printing.webp · finish-etching.webp · finish-label.webp
 *
 * 모든 장면 이미지는 같은 캔버스(900×1600, 흰 바탕)에 같은 높이 · 같은 바닥선으로 맞춘다.
 * 화면에서는 multiply 합성으로 흰 바탕을 지우므로 투명 처리는 하지 않는다.
 * 실행: node scripts/build-hero-images.mjs
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUT = path.resolve("public/assets/hero");
const CANVAS = { width: 900, height: 1600 };
const BOTTLE_H = 1460; // 병(스포이드 포함) 높이
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

const reference = path.resolve("자료/01_기준유리병/사진/YS-SRRR20-01_01 고해상도.png");
const showcase = path.resolve("자료/02_후가공/후가공사진/코팅·인쇄·부식·라벨 비교 쇼케이스.png");

/** 비교 이미지에서 병만 있는 영역(글자 제외) — 1254×1254 기준, 4열 */
const COLS = ["coating", "printing", "etching", "label"];
const SHOWCASE_BAND = { top: 236, height: 776 }; // 위 제목 · 아래 영문 설명 제외

/** 기준병을 맞춘 뒤의 폭 — 후가공 예시는 몸통 폭을 여기에 맞춰 장면 전환 시 흔들림을 줄인다 */
let referenceWidth = 0;

async function normalize(input, name) {
  // 흰 여백 자르기 → 기준병은 높이 기준, 후가공 예시는 기준병 폭 기준 → 같은 캔버스에 바닥 정렬
  const trimmed = await sharp(input).flatten({ background: WHITE }).trim({ background: "#ffffff", threshold: 18 }).toBuffer({ resolveWithObject: true });
  const size = referenceWidth ? { width: referenceWidth } : { height: BOTTLE_H, width: CANVAS.width - 60, fit: "inside" };
  const resized = await sharp(trimmed.data).resize(size).toBuffer({ resolveWithObject: true });
  if (!referenceWidth) referenceWidth = resized.info.width;
  const left = Math.round((CANVAS.width - resized.info.width) / 2);
  const top = CANVAS.height - resized.info.height - 40;
  const file = path.join(OUT, `${name}.webp`);
  await sharp({ create: { ...CANVAS, channels: 3, background: WHITE } })
    .composite([{ input: resized.data, left, top }])
    .webp({ quality: 90 })
    .toFile(file);
  console.log(`${name}: trimmed ${trimmed.info.width}×${trimmed.info.height} → ${resized.info.width}×${resized.info.height} at (${left},${top})`);
}

await mkdir(OUT, { recursive: true });
await normalize(await sharp(reference).toBuffer(), "bottle-clear");

const meta = await sharp(showcase).metadata();
const colW = Math.floor(meta.width / COLS.length);
for (const [i, name] of COLS.entries()) {
  const column = await sharp(showcase)
    .extract({ left: i * colW, top: SHOWCASE_BAND.top, width: colW, height: SHOWCASE_BAND.height })
    .toBuffer();
  await normalize(column, `finish-${name}`);
}
