/**
 * HOME 히어로의 떠다니는 병 — 기준병(YS-SRRR30-04) 장면 이미지에 스포이드(캡 + 피펫)를 결합해 만든다.
 *   입력: public/assets/hero/proc-*.webp, dropper-cap.webp, dropper-pipette.webp (같은 900×1600 캔버스 좌표)
 *   출력: public/assets/hero/float-clear.webp · float-coating.webp · float-etching.webp (흰 바탕, 여백 제거)
 * 피펫은 유리 느낌이 나도록 투명도를 낮춘다(PIPETTE_OPACITY). 형태는 바꾸지 않는다.
 * 실행: node scripts/build-float-bottles.mjs
 */
import path from "node:path";
import sharp from "sharp";

const DIR = path.resolve("public/assets/hero");
const PIPETTE_OPACITY = 0.5;
const bottles = { clear: "proc-clear.webp", coating: "proc-coating.webp", etching: "proc-etching.webp" };

// 피펫 투명도 낮추기
const pip = await sharp(path.join(DIR, "dropper-pipette.webp")).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let i = 3; i < pip.data.length; i += 4) pip.data[i] = Math.round(pip.data[i] * PIPETTE_OPACITY);
const pipette = await sharp(pip.data, { raw: pip.info }).png().toBuffer();
const cap = await sharp(path.join(DIR, "dropper-cap.webp")).png().toBuffer();

for (const [name, file] of Object.entries(bottles)) {
  const composed = await sharp(path.join(DIR, file)).composite([{ input: pipette }, { input: cap }]).png().toBuffer();
  const out = path.join(DIR, `float-${name}.webp`);
  await sharp(composed).trim({ background: "#ffffff", threshold: 10 }).extend({ top: 20, bottom: 20, left: 20, right: 20, background: "#ffffff" }).webp({ quality: 90 }).toFile(out);
  const m = await sharp(out).metadata();
  console.log(`float-${name}: ${m.width}×${m.height}`);
}
