/**
 * 히어로 사진(자료/07_히어로/히어로_병_물방울.webp)을 층으로 나눈다.
 * - 병(과 병에 맞닿은 물방울)은 바탕 층 hero-base.webp
 * - 떨어져 떠 있는 물방울은 하나씩 hero-drop-N.webp — 사진 속 물방울 그대로라 자연스럽게 따로 떠다닐 수 있다.
 * 위치는 src/data/hero-layers.json(사진 크기 대비 %)에 기록한다. 원본은 수정하지 않는다.
 *
 *   node scripts/build-hero-layers.mjs
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const SRC = "자료/07_히어로/히어로_병_물방울.webp";
const OUT = "public/assets/hero";
const JSON_OUT = "src/data/hero-layers.json";

/** 이 넓이(px) 이상은 병 → 바탕 층. 그보다 작은 덩어리는 물방울 */
const BOTTLE_MIN = 50000;
/** 이보다 작은 덩어리는 바탕 층에 남긴다 */
const DROP_MIN = 150;
/** 물방울 가장자리 여유(px) */
const PAD = 6;

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
const N = W * H;
/** 거의 투명한 가장자리 안개(알파 ≤ 40)는 덩어리를 잇지 않게 한다 — 나중에 이웃 덩어리에 붙인다 */
const CORE_ALPHA = 40;
const solid = (p) => data[p * 4 + 3] > CORE_ALPHA;

// 1) 불투명 덩어리 찾기 (8방향 연결)
const label = new Int32Array(N).fill(-1);
const comps = [];
for (let p = 0; p < N; p++) {
  if (label[p] !== -1 || !solid(p)) continue;
  const c = { id: comps.length, n: 0, x0: W, y0: H, x1: 0, y1: 0 };
  const stack = [p];
  label[p] = c.id;
  while (stack.length) {
    const q = stack.pop();
    c.n++;
    const x = q % W;
    const y = (q / W) | 0;
    if (x < c.x0) c.x0 = x;
    if (x > c.x1) c.x1 = x;
    if (y < c.y0) c.y0 = y;
    if (y > c.y1) c.y1 = y;
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const r = ny * W + nx;
        if (label[r] === -1 && solid(r)) {
          label[r] = c.id;
          stack.push(r);
        }
      }
  }
  comps.push(c);
}

// 옅은 가장자리 픽셀을 가까운 덩어리에 붙인다 (최대 4px 번짐)
for (let pass = 0; pass < 4; pass++) {
  const next = label.slice();
  for (let p = 0; p < N; p++) {
    if (label[p] !== -1 || data[p * 4 + 3] === 0) continue;
    const x = p % W;
    const n = [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, p - W, p + W];
    for (const r of n) if (r >= 0 && r < N && label[r] !== -1) { next[p] = label[r]; break; }
  }
  label.set(next);
}

// 바깥 투명 영역(가장자리에서 이어진 배경). 병 · 물방울 안의 투명한 구멍은 여기 들지 않는다
const outside = new Uint8Array(N);
{
  const stack = [];
  for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
  while (stack.length) {
    const q = stack.pop();
    if (outside[q] || solid(q)) continue;
    outside[q] = 1;
    const x = q % W;
    if (x > 0) stack.push(q - 1);
    if (x < W - 1) stack.push(q + 1);
    if (q >= W) stack.push(q - W);
    if (q < N - W) stack.push(q + W);
  }
}
// 바깥 배경에 맞닿은 작은 덩어리만 떠 있는 물방울 (병 · 물방울 속 반사 조각 제외)
const touchesOutside = (c) => {
  for (let y = c.y0; y <= c.y1; y++)
    for (let x = c.x0; x <= c.x1; x++) {
      const p = y * W + x;
      if (label[p] !== c.id) continue;
      if ((x > 0 && outside[p - 1]) || (x < W - 1 && outside[p + 1]) || (p >= W && outside[p - W]) || (p < N - W && outside[p + W])) return true;
    }
  return false;
};
const drops = comps.filter((c) => c.n >= DROP_MIN && c.n < BOTTLE_MIN && touchesOutside(c));
const dropIds = new Set(drops.map((d) => d.id));

await mkdir(OUT, { recursive: true });

// 2) 바탕 층: 물방울 픽셀만 지운다
const base = Buffer.from(data);
for (let p = 0; p < N; p++) if (dropIds.has(label[p])) base[p * 4 + 3] = 0;
await sharp(base, { raw: { width: W, height: H, channels: 4 } }).webp({ quality: 88, alphaQuality: 100 }).toFile(`${OUT}/hero-base.webp`);

// 3) 물방울 층: 각 덩어리만 잘라낸다
const layers = [];
drops.sort((a, b) => b.n - a.n);
for (const [i, d] of drops.entries()) {
  const x0 = Math.max(0, d.x0 - PAD);
  const y0 = Math.max(0, d.y0 - PAD);
  const w = Math.min(W - 1, d.x1 + PAD) - x0 + 1;
  const h = Math.min(H - 1, d.y1 + PAD) - y0 + 1;
  const buf = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const p = (y0 + y) * W + x0 + x;
      if (label[p] !== d.id) continue;
      data.copy(buf, (y * w + x) * 4, p * 4, p * 4 + 4);
    }
  const file = `hero-drop-${i + 1}.webp`;
  await sharp(buf, { raw: { width: w, height: h, channels: 4 } }).webp({ quality: 90, alphaQuality: 100 }).toFile(`${OUT}/${file}`);
  const r = (v, t) => Math.round((v / t) * 10000) / 100;
  layers.push({ src: `/assets/hero/${file}`, x: r(x0, W), y: r(y0, H), w: r(w, W), h: r(h, H), area: d.n });
}

await writeFile(
  JSON_OUT,
  JSON.stringify({ source: SRC, width: W, height: H, base: "/assets/hero/hero-base.webp", drops: layers }, null, 2) + "\n",
);
console.log(`base + ${layers.length} drops`);
