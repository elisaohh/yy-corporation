/**
 * HOME 공정 모션 v2 — 공정마다 단독 장면(투명 병 + 그 공정 하나)
 *   원본(수정하지 않음): 자료/09_PROCESS/공정모션_v2/*
 *   사본: public/assets/hero/v2/*.webp (900×1600, 같은 좌표)
 *
 * 병 사진: 정사각형 원본에서 병 가운데를 기준으로 9:16을 잘라 900×1600으로 맞춘다(원본들의 병 위치가 같음).
 * 펌프: 원본(분해 사진)을 펌프 머리 · 빨대 · 덮개로 나눠, 병 목에 맞는 자리에 놓는다.
 *   - 병 목: 위 끝 320행, 어깨 533행, 가운데 450열(캔버스 실측, 2026-11-02)
 * 실행: node scripts/build-process-v2.mjs
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

sharp.cache(false); // 윈도에서 같은 파일을 다시 쓸 때 잠김 방지

const SRC = path.resolve("자료/09_PROCESS/공정모션_v2");
const OUT = path.resolve("public/assets/hero/v2");
const W = 900;
const H = 1600;
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };
const CENTER = 0.499; // 원본 속 병 가운데(가로 비율)

await mkdir(OUT, { recursive: true });

const bottles = {
  clear: "clear.png",
  etching: "etching.png",
  "coating-gradation": "coating-gradation.png",
  "coating-matte": "coating-matte.png",
  "coating-glossy": "coating-glossy.png",
  printing: "printing.png",
  label: "label.png",
};

for (const [name, file] of Object.entries(bottles)) {
  const src = sharp(path.join(SRC, file));
  const { width: n } = await src.metadata();
  const cw = Math.round((n * 9) / 16);
  const left = Math.round(n * CENTER - cw / 2);
  await sharp(path.join(SRC, file))
    .flatten({ background: WHITE })
    // 배경이 253~254로 아주 살짝 회색 — 페이지 흰색(255)과 경계가 보이지 않게 248 이상을 순백으로
    .linear(255 / 248, 0)
    .extract({ left, top: 0, width: cw, height: n })
    .resize(W, H, { kernel: "lanczos3" })
    .webp({ quality: 88 })
    .toFile(path.join(OUT, `proc-${name}.webp`));
  console.log(`proc-${name}.webp`);
}

/* ── 부자재: 펌프 · 스포이드 ──
 * 병 목(캔버스 실측): 나사 위 끝 318행 ~ 아래 끝 522행, 어깨가 넓어지기 시작하는 행 526, 가운데 450열, 나사 최대 폭 226px
 * 캡(칼라) 아래 끝을 어깨(526)에 맞추고, 캡이 나사 전체(318~526)를 덮는 크기로 키운다.
 */
const NECK = { top: 318, shoulder: 526, cx: 450 };
const TUBE_END = 1110; // 빨대 · 피펫 끝(병 바닥 유리 위)

/** 원본 file의 [y0, y1) 구간을 scale배 해서, 원본 행 anchorY가 캔버스 행 toY에 · 원본 열 cx가 병 가운데에 오도록 놓은 버퍼(900×1600) */
async function placed(file, y0, y1, scale, cx, anchorY, toY, clipBottom = H) {
  const { width: sw } = await sharp(file).metadata();
  const buf = await sharp(file).ensureAlpha().extract({ left: 0, top: y0, width: sw, height: y1 - y0 }).png().toBuffer();
  const piece = await sharp(buf).resize(Math.round(sw * scale), Math.round((y1 - y0) * scale)).png().toBuffer();
  const meta = await sharp(piece).metadata();
  const left = Math.round(NECK.cx - cx * scale);
  const top = Math.round(toY - (anchorY - y0) * scale);
  const cropTop = Math.max(0, -top);
  const cropLeft = Math.max(0, -left);
  const visibleH = Math.min(meta.height - cropTop, clipBottom - Math.max(top, 0));
  const visibleW = Math.min(meta.width - cropLeft, W - Math.max(left, 0));
  const cut = await sharp(piece).extract({ left: cropLeft, top: cropTop, width: visibleW, height: visibleH }).toBuffer();
  return sharp({ create: { width: W, height: H, channels: 4, background: CLEAR } })
    .composite([{ input: cut, left: Math.max(left, 0), top: Math.max(top, 0) }])
    .png()
    .toBuffer();
}

/** 흰 바탕 사진 → 투명 배경. 행마다 좌우 끝 사이를 채운 실루엣으로 오려 낸다(흰 캡이 바탕과 함께 지워지지 않게) */
/** soft: 거의 흰 부분(유리 반사 · 바닥 반사)을 비치게 — 병끼리 겹칠 때 흰 네모가 생기지 않게 */
async function cutOutSolid(buf, threshold = 24, soft = false) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  for (let y = 0; y < h; y++) {
    let a = -1;
    let b = -1;
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (data[i + 3] > 0 && 765 - (data[i] + data[i + 1] + data[i + 2]) > threshold) {
        if (a < 0) a = x;
        b = x;
      }
    }
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (x < a || x > b || a < 0) data[i + 3] = 0;
      else if (soft) data[i + 3] = Math.round(data[i + 3] * Math.min(1, (765 - (data[i] + data[i + 1] + data[i + 2])) / 30));
    }
  }
  return sharp(data, { raw: info }).png().toBuffer();
}

/** 투명한 재질(유리 · 투명 플라스틱): 밝을수록 투명하게 — 테두리 · 반사선만 남아 뒤가 비쳐 보인다 */
async function glassy(buf, soft = 110) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const keep = Math.min(1, Math.max(0, (255 - lum) / soft));
    data[i + 3] = Math.round(data[i + 3] * Math.max(keep, 0.08 * (data[i + 3] / 255)));
  }
  return sharp(data, { raw: info }).png().toBuffer();
}

async function save(name, buf) {
  await sharp(buf).webp({ quality: 90, alphaQuality: 100 }).toFile(path.join(OUT, `${name}.webp`));
  console.log(`${name}.webp`);
}

// 펌프(긴 캡, 원본 942×1670 투명 배경): 칼라 566~775행 · 가운데 474열 → 1배 크기면 나사 318~526을 정확히 덮는다
const PUMP_LONG = path.join(SRC, "pump-long.png");
const PART_SCALE = 1.08; // 부자재를 병보다 조금 크게(2026-11-02 요청) — 칼라 아래 끝은 어깨 그대로라 나사는 계속 가려진다
await save("pump-head", await placed(PUMP_LONG, 415, 778, PART_SCALE, 474.5, 775, NECK.shoulder));
// 빨대: 윗부분은 칼라 속에 숨기고, 병 바닥 유리 위에서 끝낸다
await save("pump-tube", await placed(PUMP_LONG, 846, 1640, PART_SCALE, 474.5, 846, NECK.shoulder - 30, TUBE_END));
// 투명 덮개: 이전 펌프 사진(pump.png)의 덮개 — 아래 끝을 어깨에 맞춰 펌프 머리 · 칼라를 덮는다
/** 원본 전체를 (w × h)로 맞춰, 위 끝이 캔버스 행 top · 가운데가 병 가운데에 오도록 놓은 버퍼 */
async function fitted(file, w, h, top) {
  const piece = await sharp(file).ensureAlpha().trim({ threshold: 4 }).resize(w, h, { fit: "fill" }).png().toBuffer();
  return sharp({ create: { width: W, height: H, channels: 4, background: CLEAR } })
    .composite([{ input: piece, left: Math.round(NECK.cx - w / 2), top }])
    .png()
    .toBuffer();
}

// 투명 덮개(overcap.png, 2026-11-02 제공): 폭 290px — 펌프 머리 · 칼라를 덮고, 아래 끝을 어깨에 맞춘다
{
  // 2026-11-02 15:25 수정본
  const meta = await sharp(path.join(SRC, "overcap.png")).trim({ threshold: 4 }).toBuffer({ resolveWithObject: true });
  const w = Math.round(290 * PART_SCALE);
  const h = Math.round((meta.info.height * w) / meta.info.width);
  // 더 투명하게: 흰 면은 거의 비우고 테두리 · 반사선만 남긴다(soft가 작을수록 더 투명)
  await save("pump-overcap", await glassy(await fitted(path.join(SRC, "overcap.png"), w, h, NECK.shoulder - h), 70));
}

// 스포이드(긴 캡, 원본 941×1672 흰 바탕): 칼라 426~690행 · 가운데 470열.
// 폭이 나사(226px)보다 넓도록 0.875배 → 칼라 231px, 높이 231px(295~526행)로 나사를 다 덮는다
const DROPPER = path.join(SRC, "dropper.webp");
const DS = 0.875 * PART_SCALE;
// 스포이드 캡(dropper-cap.png, 2026-11-02 제공, 270×503 투명 배경): 칼라 244~502행 · 가운데 133.5열.
// 칼라 폭을 이전 캡과 같게(266 × DS / 0.875 × … ≈ 251px) 맞추고, 아래 끝을 어깨에 — 칼라 높이 244px로 나사(318~526)를 덮는다
const CAP_SCALE = (266 * DS) / 266;
await save("dropper-cap", await cutOutSolid(await placed(path.join(SRC, "dropper-cap.png"), 0, 503, CAP_SCALE, 133.5, 502, NECK.shoulder)));
// 피펫: 윗부분은 캡 속(330행부터)에 숨기고, 병 바닥 유리 위에서 끝낸다
// 피펫(pipette.png, 2026-11-02 제공): 윗부분은 캡 속(330행)에 숨기고, 끝이 병 바닥 유리(1100행) 바로 위까지 오게 늘인다
const PIPETTE = { top: 330, end: 1085, width: Math.round(80 * PART_SCALE) };
await save("dropper-pipette", await glassy(await fitted(path.join(SRC, "pipette.png"), PIPETTE.width, PIPETTE.end - PIPETTE.top, PIPETTE.top), 90));

// 배경을 오려 낸 병(투명 배경) — 코팅 3종 회전판 · 부자재 병 두 개처럼 병끼리 겹칠 수 있는 장면용
/**
 * 배경 제거본(코팅 3종, 2026-11-02 제공)을 장면 사진과 같은 자리에 놓는다.
 * 장면 사진(proc-*.webp)에서 병 입구 위 끝 · 몸통 폭을 재고, 배경 제거본도 같은 값을 재서 맞춘다.
 */
async function measureScene(file) {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const dark = (x, y) => { const i = (y * info.width + x) * info.channels; return 765 - (data[i] + data[i + 1] + data[i + 2]) > 45; };
  let top = -1;
  for (let y = 0; y < info.height && top < 0; y++) for (let x = 0; x < info.width; x++) if (dark(x, y)) { top = y; break; }
  const y = Math.round(info.height * 0.5);
  let a = -1, b = -1;
  for (let x = 0; x < info.width; x++) if (dark(x, y)) { if (a < 0) a = x; b = x; }
  return { top, width: b - a, cx: (a + b) / 2 };
}
async function measureCut(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const solid = (x, y) => data[(y * info.width + x) * 4 + 3] > 128;
  let top = -1;
  for (let y = 0; y < info.height && top < 0; y++) for (let x = 0; x < info.width; x++) if (solid(x, y)) { top = y; break; }
  // 몸통 폭: 위에서 45% 높이(목 · 바닥 반사가 아닌 몸통)
  const y = Math.round(info.height * 0.45);
  let a = -1, b = -1;
  for (let x = 0; x < info.width; x++) if (solid(x, y)) { if (a < 0) a = x; b = x; }
  return { top, width: b - a, cx: (a + b) / 2, w: info.width, h: info.height };
}
for (const name of ["coating-gradation", "coating-matte", "coating-glossy"]) {
  const scene = await measureScene(path.join(OUT, `proc-${name}.webp`));
  const file = path.join(SRC, `cut-${name}.png`);
  const cut = await measureCut(file);
  const k = scene.width / cut.width;
  const piece = await sharp(file).resize(Math.round(cut.w * k), Math.round(cut.h * k)).png().toBuffer();
  const left = Math.round(NECK.cx - cut.cx * k);
  const top = Math.round(scene.top - cut.top * k);
  const cutBuf = await sharp({ create: { width: W, height: H, channels: 4, background: CLEAR } }).composite([{ input: piece, left, top }]).png().toBuffer();
  await save(`cut-${name}`, cutBuf);
  // 장면 사진도 같은 배경 제거본으로 다시 만든다(흰 바탕) — 회전판으로 바뀌는 순간 색이 튀지 않게
  await sharp(cutBuf).flatten({ background: WHITE }).webp({ quality: 88 }).toFile(path.join(OUT, `proc-${name}.webp`));
  console.log(" ", name, { scene, k: k.toFixed(3), left, top });
}
// 부자재 장면의 병(인쇄 · 라벨 병, 반투명 부식 유리)은 장면 사진에서 오려 낸다 — 흰 라벨 · 부식면이 지워지지 않게 실루엣만
{
  const { readFile } = await import("node:fs/promises");
  for (const name of ["printing", "label"]) {
    const src = await readFile(path.join(OUT, `proc-${name}.webp`));
    await save(`cut-${name}`, await cutOutSolid(await sharp(src).ensureAlpha().png().toBuffer(), 6));
  }
}
for (const name of ["clear"]) {
  const { readFile } = await import("node:fs/promises");
  const src = await readFile(path.join(OUT, `proc-${name}.webp`));
  await save(`cut-${name}`, await cutOutSolid(await sharp(src).ensureAlpha().png().toBuffer(), 6, true));
}
