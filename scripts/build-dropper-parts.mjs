/**
 * 스포이드를 두 장으로 나눈다 (공정 모션의 수직 체결용)
 *   dropper.webp(900×1600, 기준병 캡 좌표에 정렬됨) →
 *     dropper-cap.webp     칼라 아래 끝(540행)까지: 흰 캡 · 고무 벌브. 바깥 흰 배경만 투명 처리(테두리에서 채우기) → 불투명 합성
 *     dropper-pipette.webp 그 아래: 유리 피펫. 검정 + 투명도(= multiply와 같은 결과) → 라벨 구간 마스크 가능
 * 형태는 바꾸지 않는다. 실행: node scripts/build-dropper-parts.mjs
 */
import path from "node:path";
import sharp from "sharp";

const DIR = path.resolve("public/assets/hero");
const COLLAR_BOTTOM = 540; // dropper.webp 칼라 아래 끝 행(실측)
const W = 900, H = 1600;

const { data } = await sharp(path.join(DIR, "dropper.webp")).removeAlpha().raw().toBuffer({ resolveWithObject: true });

// 캡: 0..COLLAR_BOTTOM 행, 테두리에서 이어진 밝은 픽셀만 배경으로 간주
const capH = COLLAR_BOTTOM + 1;
const rgba = Buffer.alloc(W * capH * 4);
const bg = new Uint8Array(W * capH);
const bright = (i) => data[i * 3] > 246 && data[i * 3 + 1] > 246 && data[i * 3 + 2] > 246;
const queue = [];
for (let x = 0; x < W; x++) { queue.push(x); queue.push((capH - 1) * W + x); }
for (let y = 0; y < capH; y++) { queue.push(y * W); queue.push(y * W + W - 1); }
while (queue.length) {
  const p = queue.pop();
  if (bg[p] || !bright(p)) continue;
  bg[p] = 1;
  const x = p % W, y = (p / W) | 0;
  if (x > 0) queue.push(p - 1);
  if (x < W - 1) queue.push(p + 1);
  if (y > 0) queue.push(p - W);
  if (y < capH - 1) queue.push(p + W);
}
for (let p = 0; p < W * capH; p++) {
  rgba[p * 4] = data[p * 3]; rgba[p * 4 + 1] = data[p * 3 + 1]; rgba[p * 4 + 2] = data[p * 3 + 2];
  rgba[p * 4 + 3] = bg[p] ? 0 : 255;
}
await sharp(rgba, { raw: { width: W, height: capH, channels: 4 } })
  .extend({ bottom: H - capH, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .webp({ quality: 92, alphaQuality: 100 })
  .toFile(path.join(DIR, "dropper-cap.webp"));

// 피펫: 칼라 아래부터. 흰 바탕 multiply와 같은 결과가 나오도록 "검정 + 투명도(1 − 밝기)"로 변환
// → 일반 합성으로도 유리 안에 비쳐 보이고, 라벨 구간 마스크를 걸어도 합성이 깨지지 않는다.
{
  const px = Buffer.alloc(W * H * 4);
  for (let p = 0; p < W * H; p++) {
    const y = (p / W) | 0;
    const lum = Math.min(data[p * 3], data[p * 3 + 1], data[p * 3 + 2]);
    px[p * 4 + 3] = y <= COLLAR_BOTTOM ? 0 : 255 - lum;
  }
  await sharp(px, { raw: { width: W, height: H, channels: 4 } }).webp({ quality: 92, alphaQuality: 100 }).toFile(path.join(DIR, "dropper-pipette.webp"));
}

console.log("dropper-cap.webp, dropper-pipette.webp");
