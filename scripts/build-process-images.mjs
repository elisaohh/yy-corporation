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

/**
 * 높이 맞춤 — 장면 사진마다 병 비율이 조금씩 달라(몸통 폭은 같아도 키가 1~2% 다름) 장면이 바뀔 때 병이 움찔한다.
 * 기준병(clear)의 목 위 끝 · 바닥 선에 맞춰 세로만 살짝 늘이거나 줄인다(가로 폭은 그대로).
 * 값 = 1차 배치(어깨선 정렬) 결과에서 잰 캔버스 행. 장면 사진을 바꾸면 다시 잰다(2026-10-28 실측).
 */
const FIT_TARGET = { neck: 394, bottom: 1362 }; // clear
const FIT = {
  coating: { neck: 386, bottom: 1376 },
  printing: { neck: 386, bottom: 1376 },
  etching: { neck: 386, bottom: 1371 },
  label: { neck: 388, bottom: 1364 },
};

const scenes = {
  clear: "YS-SRRR30-04.png",
  coating: "YS-SRRR30-04 코팅.png",
  printing: "YS-SRRR30-04 코팅 후 인쇄.png", // 인쇄 단독 이미지 미제공 — 코팅 후 인쇄로 대체
  etching: "YS-SRRR30-04 부식.png",
  label: "YS-SRRR30-04 부식 후 라벨.png", // 라벨 장면 = 부식 후 라벨
};

/** 몸통 곧은 구간(BODY_ROWS)의 평균 왼쪽 · 오른쪽 끝 — 가로 위치 · 폭 맞춤용 */
const BODY_ROWS = [640, 1280];
async function bodySides(buffer) {
  const { data, info } = await sharp(buffer).greyscale().raw().toBuffer({ resolveWithObject: true });
  let l = 0, r = 0, n = 0;
  for (let y = BODY_ROWS[0]; y <= BODY_ROWS[1]; y += 4) {
    let a = -1, b = -1;
    for (let x = 0; x < info.width / 2; x++) if (data[y * info.width + x] < 236) { a = x; break; }
    for (let x = info.width - 1; x >= info.width / 2; x--) if (data[y * info.width + x] < 236) { b = x; break; }
    if (a < 0 || b < 0) continue;
    l += a; r += b; n++;
  }
  return { left: l / n, right: r / n };
}

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

let bodyRef = null; // clear(기준병)의 몸통 끝 — 맨 먼저 만든다
for (const [name, file] of Object.entries(scenes)) {
  const t = await sharp(path.join(SRC, file)).flatten({ background: WHITE }).trim({ background: "#ffffff", threshold: 14 }).toBuffer({ resolveWithObject: true });
  // 몸통 폭 기준 배율 (반사광은 몸통보다 좁으므로 최대 폭 = 몸통)
  const probe = await shoulderRow(t.data);
  const scale = BODY_W / probe.max;
  const resized = await sharp(t.data).resize({ width: Math.round(t.info.width * scale) }).toBuffer({ resolveWithObject: true });
  const s = await shoulderRow(resized.data);
  const left = Math.round((CANVAS.width - resized.info.width) / 2);
  let top = SHOULDER_ROW - s.row;
  let input = resized.data;
  let height = resized.info.height;
  const fit = FIT[name];
  if (fit) {
    // 1차 배치에서의 목 · 바닥 행 → 기준병 목 · 바닥 행
    const sy = (FIT_TARGET.bottom - FIT_TARGET.neck) / (fit.bottom - fit.neck);
    const neckInImage = fit.neck - top;
    height = Math.round(resized.info.height * sy);
    input = await sharp(resized.data).resize({ width: resized.info.width, height, fit: "fill" }).toBuffer();
    top = Math.round(FIT_TARGET.neck - neckInImage * sy);
  }
  let width = resized.info.width;
  let x = left;
  const place = () => sharp({ create: { ...CANVAS, channels: 3, background: WHITE } }).composite([{ input, left: x, top }]);
  if (fit) {
    // 가로: 몸통 곧은 구간의 폭 · 가운데를 기준병과 같게(1~3px 차이 보정)
    const now = await bodySides(await place().png().toBuffer());
    const sx = (bodyRef.right - bodyRef.left) / (now.right - now.left);
    const newWidth = Math.round(width * sx);
    input = await sharp(input).resize({ width: newWidth, height, fit: "fill" }).toBuffer();
    // 확대 후 몸통 왼쪽 끝이 기준병 왼쪽 끝에 오도록
    x = Math.round(bodyRef.left - (now.left - x) * (newWidth / width));
    width = newWidth;
  }
  const buffer = await place().png().toBuffer();
  if (name === "clear") bodyRef = await bodySides(buffer);
  await sharp(buffer).webp({ quality: 90 }).toFile(path.join(OUT, `proc-${name}.webp`));
  const sides = await bodySides(buffer);
  console.log(`proc-${name}: ${width}×${height} at (${x},${top}) 몸통 ${sides.left.toFixed(1)}–${sides.right.toFixed(1)}${fit ? " (높이 · 폭 맞춤)" : ""}`);
}
