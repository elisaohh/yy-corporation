/**
 * HOME 인트로 · 공정 모션 장면 이미지 만들기
 *   원본(수정하지 않음) — 자료/01_기준유리병/사진/
 *     YS-SRRR30-01.png                → 기준병(투명 유리, 스포이드 결합)
 *     YS-SRRR30-01 코팅/부식/라벨.png, YYS-SRRR30-01 인쇄.png → 표면 효과(생성 이미지)
 *     드로퍼 피펫.png                  → 스포이드 · 캡 · 피펫 단독
 *   사본 — public/assets/hero/
 *     bottle-clear.webp, finish-coating/printing/etching/label.webp (900×1600, 같은 폭 · 같은 바닥선)
 *     dropper.webp (스포이드 단독, 병과 같은 배율)
 *     macro-glass-dark.webp (인트로 I-1 유리 접사 — 기준병 몸통을 반전, 공장 사진 대체 자료)
 *
 * 화면에서는 multiply 합성으로 흰 바탕을 지우므로 투명 처리는 하지 않는다. 형태는 바꾸지 않는다.
 * 실행: node scripts/build-hero-images.mjs
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("자료/01_기준유리병/사진");
const OUT = path.resolve("public/assets/hero");
const CANVAS = { width: 900, height: 1600 };
const BOTTLE_H = 1460; // 기준병(스포이드 포함) 높이
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

const reference = path.join(SRC, "YS-SRRR30-01.png");
const finishes = {
  coating: "YS-SRRR30-01 코팅.png",
  printing: "YYS-SRRR30-01 인쇄.png",
  etching: "YS-SRRR30-01 부식.png",
  label: "YS-SRRR30-01 라벨.png",
};

/** 흰 여백 자르기 결과 */
async function trimmed(file) {
  return sharp(file).flatten({ background: WHITE }).trim({ background: "#ffffff", threshold: 14 }).toBuffer({ resolveWithObject: true });
}

/** 스포이드 꼭대기 위치 — 모든 장면 이미지를 이 선에 맞춘다(바닥 반사 유무와 상관없이 병이 겹치도록) */
const TOP = 100;

/** 같은 캔버스 · 같은 꼭대기선으로 저장 */
async function place(buffer, name, size) {
  const resized = await sharp(buffer).resize(size).toBuffer({ resolveWithObject: true });
  const left = Math.round((CANVAS.width - resized.info.width) / 2);
  const top = TOP;
  await sharp({ create: { ...CANVAS, channels: 3, background: WHITE } })
    .composite([{ input: resized.data, left, top }])
    .webp({ quality: 90 })
    .toFile(path.join(OUT, `${name}.webp`));
  console.log(`${name}: → ${resized.info.width}×${resized.info.height} at (${left},${top})`);
  return resized.info;
}

await mkdir(OUT, { recursive: true });

// 1) 기준병 — 높이 기준
const ref = await trimmed(reference);
const refPlaced = await place(ref.data, "bottle-clear", { height: BOTTLE_H });
const scale = refPlaced.height / ref.info.height; // 원본 px → 캔버스 px

// 2) 표면 효과 — 기준병과 같은 폭으로 맞춰 장면 전환 시 흔들림을 줄인다
for (const [name, file] of Object.entries(finishes)) {
  const t = await trimmed(path.join(SRC, file));
  await place(t.data, `finish-${name}`, { width: refPlaced.width });
}

// 3) 스포이드 단독 — 캡(칼라) 폭을 측정해 기준병 캡 폭(269px)에 맞추면 같은 캔버스에서 캡 위치가 정확히 겹친다
{
  const t = await trimmed(path.join(SRC, "드로퍼 피펫.png"));
  const COLLAR_ON_CANVAS = 269; // bottle-clear.webp 캡 칼라 폭(실측)
  const COLLAR_IN_SOURCE = 266; // 드로퍼 피펫.png 여백 제거 후 칼라 폭(실측)
  await place(t.data, "dropper", { width: Math.round(t.info.width * (COLLAR_ON_CANVAS / COLLAR_IN_SOURCE)) });
}

// 4) 인트로 I-1 어두운 유리 접사 (기준병 몸통 반전)
{
  const BODY = { left: 262, top: 548, width: 480, height: 860 }; // 1003×1568 원본 기준, 캡 아래 몸통
  await sharp(reference).extract(BODY).negate({ alpha: false }).linear(1.15, -12).resize({ height: 1720 }).webp({ quality: 88 }).toFile(path.join(OUT, "macro-glass-dark.webp"));
  console.log("macro-glass-dark: 기준병 몸통 접사(반전)");
}
