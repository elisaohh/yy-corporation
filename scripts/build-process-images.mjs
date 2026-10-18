/**
 * HOME 공정 모션 장면 — 스포이드 없는 기준병(YS-SRRR30-04, 30ml) 시리즈
 *   원본(수정하지 않음): 자료/01_기준유리병/사진/YS-SRRR30-04*.png (1600×1600, 생성 이미지)
 *   사본: public/assets/hero/proc-*.webp (900×1600)
 *
 * 정렬: 몸통 폭을 기준병 캔버스(442px)에 맞추고, "어깨선"(몸통 폭이 97%가 되는 행)을
 *       스포이드 이미지(dropper.webp)가 맞춰진 기준 어깨선 행에 맞춘다 → 스포이드가 수직으로 내려오면 목에 정확히 얹힌다.
 * 실행: node scripts/build-process-images.mjs
 */
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("자료/01_기준유리병/사진");
const OUT = path.resolve("public/assets/hero");
const CANVAS = { width: 900, height: 1600 };
const BODY_W = 442; // bottle-clear.webp 몸통 폭(실측)
const SHOULDER_ROW = 600; // bottle-clear.webp 에서 몸통 폭이 97%에 이르는 행(실측) — dropper.webp가 이 병에 맞춰져 있다
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

const scenes = {
  clear: "YS-SRRR30-04.png",
  coating: "YS-SRRR30-04 코팅.png",
  printing: "YS-SRRR30-04 코팅 후 인쇄.png", // 인쇄 단독 이미지 미제공 — 코팅 후 인쇄로 대체
  etching: "YS-SRRR30-04 부식.png",
  label: "YS-SRRR30-04 부식 후 라벨.png", // 라벨 장면 = 부식 후 라벨
};

/** 행별 폭에서 몸통 최대 폭의 97%에 처음 도달하는 행 */
async function shoulderRow(buffer) {
  const { data, info } = await sharp(buffer).greyscale().raw().toBuffer({ resolveWithObject: true });
  const widths = [];
  for (let y = 0; y < info.height; y++) {
    let l = -1, r = -1;
    for (let x = 0; x < info.width; x++) if (data[y * info.width + x] < 235) { if (l < 0) l = x; r = x; }
    widths.push(l < 0 ? 0 : r - l);
  }
  const max = Math.max(...widths.slice(0, Math.round(info.height * 0.8)));
  return { row: widths.findIndex((w) => w >= max * 0.97), max };
}

for (const [name, file] of Object.entries(scenes)) {
  const t = await sharp(path.join(SRC, file)).flatten({ background: WHITE }).trim({ background: "#ffffff", threshold: 14 }).toBuffer({ resolveWithObject: true });
  // 몸통 폭 기준 배율 (반사광은 몸통보다 좁으므로 최대 폭 = 몸통)
  const probe = await shoulderRow(t.data);
  const scale = BODY_W / probe.max;
  const resized = await sharp(t.data).resize({ width: Math.round(t.info.width * scale) }).toBuffer({ resolveWithObject: true });
  const s = await shoulderRow(resized.data);
  const left = Math.round((CANVAS.width - resized.info.width) / 2);
  const top = SHOULDER_ROW - s.row;
  await sharp({ create: { ...CANVAS, channels: 3, background: WHITE } })
    .composite([{ input: resized.data, left, top }])
    .webp({ quality: 90 })
    .toFile(path.join(OUT, `proc-${name}.webp`));
  console.log(`proc-${name}: ${resized.info.width}×${resized.info.height} at (${left},${top}) shoulder ${s.row}`);
}
