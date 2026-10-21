import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

/**
 * STORY 뉴스레터 — 메일로 보낸 원본 HTML을 그대로 쓴다(빌드 시 서버에서만 실행).
 * 한 호 = content/story/vol-NN.json { vol: 호수, html: 원본 HTML 파일 경로, published: 공개 여부 }.
 * 관리 화면(/admin)에서 올리면 이 파일과 HTML(content/story/files/)이 함께 저장되고, 목록 · 상세가 자동으로 생긴다.
 * - 메일 하단(회사 정보 · 로고 · 홈페이지 · 수신거부 · 맺음말) 영역을 지운다.
 * - 링크는 사이트 창에서 열리도록 <base target="_top">을 넣는다.
 * - 카드용 정보는 HTML에서 읽는다: 제목(<title>에서 "(광고)" · "| …" 제외), 요약(메일 미리보기 문구),
 *   발행 시기(머리의 "Vol.NN · 2026.10"), 대표 사진(첫 번째 사진).
 */
export interface Newsletter {
  slug: string;
  vol: number;
  title: string;
  /** 발행 시기 — 예: "2026.10" */
  issue: string;
  summary: string;
  /** 목록 카드 대표 사진 주소(/about/story/<slug>/cover) — 사진이 없으면 null */
  cover: string | null;
}

const DIR = path.join(process.cwd(), "content", "story");

interface Entry {
  vol: number;
  html: string;
  published?: boolean;
}

const slugOf = (vol: number) => `yy-notes-vol-${String(vol).padStart(2, "0")}`;

/** 공개된 호 목록(호수 → HTML 파일 경로) — 같은 호수가 둘이면 나중 파일이 이긴다 */
async function entries(): Promise<Map<number, string>> {
  const files = (await readdir(DIR)).filter((f) => f.endsWith(".json"));
  const map = new Map<number, string>();
  for (const f of files.sort()) {
    const entry = JSON.parse(await readFile(path.join(DIR, f), "utf8")) as Entry;
    const vol = Number(entry.vol);
    if (!vol || !entry.html || entry.published === false) continue;
    // content/story/ 안의 파일만 읽는다(관리 화면은 content/story/files/에 저장)
    const rel = entry.html.replace(/^\/+/, "").replace(/^content\/story\//, "");
    if (rel.split("/").includes("..")) continue;
    map.set(vol, rel);
  }
  return map;
}

async function read(vol: number) {
  const file = (await entries()).get(vol);
  if (!file) throw new Error(`STORY Vol.${vol} 없음`);
  return readFile(path.join(DIR, file), "utf8");
}

function meta(vol: number, html: string): Newsletter {
  const rawTitle = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "";
  const title = rawTitle.replace(/^\(광고\)\s*/, "").replace(/\s*\|.*$/, "").trim() || `YY NOTES Vol.${vol}`;
  const summary = (html.match(/<div style="display:none;[^"]*">([\s\S]*?)<\/div>/i)?.[1] ?? "").replace(/&[#\w]+;/g, "").trim();
  const issue = html.match(/Vol\.\d+[\s\S]{0,40}?(\d{4}\.\d{1,2})/)?.[1] ?? "";
  const hasImage = /<img src="data:image\//i.test(html);
  const slug = slugOf(vol);
  return { slug, vol, title, issue, summary, cover: hasImage ? `/about/story/${slug}/cover` : null };
}

/** 모든 호 — 최신 호가 앞 */
export async function listNewsletters(): Promise<Newsletter[]> {
  const vols = [...(await entries()).keys()];
  const list = await Promise.all(vols.map(async (vol) => meta(vol, await read(vol))));
  return list.sort((a, b) => b.vol - a.vol);
}

/** 상세 — 메일 하단을 지운 HTML */
export async function loadNewsletter(slug: string): Promise<(Newsletter & { html: string }) | null> {
  const vol = Number(slug.match(/vol-(\d+)$/)?.[1]);
  if (!vol) return null;
  let html: string;
  try {
    html = await read(vol);
  } catch {
    return null;
  }
  const info = meta(vol, html);
  html = html.replace(
    /<tr><td style="height:\d+px;line-height:\d+px;font-size:0;">&nbsp;<\/td><\/tr><tr><td class="px" style="padding:0 24px 40px;">[\s\S]*?(?=<\/table><\/td><\/tr><\/table>\s*<\/body>)/,
    '<tr><td style="height:40px;line-height:40px;font-size:0;">&nbsp;</td></tr>',
  );
  html = html.replace(/<head>/i, '<head><base target="_top">');
  return { ...info, html };
}

/** 대표 사진(첫 번째 사진) 바이트 */
export async function newsletterCover(slug: string): Promise<{ type: string; data: Buffer } | null> {
  const vol = Number(slug.match(/vol-(\d+)$/)?.[1]);
  if (!vol) return null;
  let html: string;
  try {
    html = await read(vol);
  } catch {
    return null;
  }
  const m = html.match(/<img src="data:(image\/[a-z]+);base64,([^"]+)"/i);
  return m ? { type: m[1], data: Buffer.from(m[2], "base64") } : null;
}
