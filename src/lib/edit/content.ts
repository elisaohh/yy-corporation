import { commit, listDir, readJSON, readText, type Change } from "./repo";
import type { EditSession } from "./session";

/**
 * 편집 화면이 고치는 데이터 — 저장할 때마다 저장소의 최신 상태를 다시 읽어 그 위에 바꾼다
 * (그 사이 다른 사람이 저장한 내용을 덮어쓰지 않도록).
 */

export const PRODUCTS_FILE = "content/products.json";
export const PRODUCT_IMAGE_DIR = "public/assets/products";
export const STORY_DIR = "content/story";
export const STORY_FILES = "content/story/files";

export interface ProductEntry {
  code: string;
  category: string;
  capacity: string;
  dimensions: string;
  material: string;
  neck: string;
  description: string;
  home: boolean;
  /** 화면 경로 — /assets/products/파일 */
  images: string[];
}

export interface StoryEntry {
  vol: number;
  html: string;
  published: boolean;
}

/** 새로 올리는 사진 — 저장할 때 파일로 함께 올라간다 */
export interface NewImage {
  /** 화면 경로(/assets/products/…) — images 목록에 이 값이 들어간다 */
  src: string;
  base64: string;
}

const json = (data: unknown) => `${JSON.stringify(data, null, 2)}\n`;
const imageFile = (src: string) => `public${src}`;
export const pad = (vol: number) => String(vol).padStart(2, "0");

export async function loadProducts(session: EditSession): Promise<ProductEntry[]> {
  const data = await readJSON<{ items: ProductEntry[] }>(session, PRODUCTS_FILE);
  return (data?.items ?? []).map((item) => ({
    code: item.code ?? "",
    category: item.category || "glass-bottle",
    capacity: item.capacity ?? "",
    dimensions: item.dimensions ?? "",
    material: item.material ?? "",
    neck: item.neck ?? "",
    description: item.description ?? "",
    home: Boolean(item.home),
    images: (item.images ?? []).filter(Boolean),
  }));
}

/** 어느 제품에서도 쓰지 않게 된 사진 파일은 함께 지운다 */
function orphanRemovals(before: ProductEntry[], after: ProductEntry[]): Change[] {
  const used = new Set(after.flatMap((p) => p.images));
  const gone = new Set(before.flatMap((p) => p.images).filter((src) => !used.has(src)));
  return [...gone].filter((src) => src.startsWith("/assets/products/")).map((src) => ({ path: imageFile(src), remove: true as const }));
}

export class EditError extends Error {}

/** 제품 저장 — originalCode가 있으면 그 제품을 바꾸고, 없으면 맨 뒤에 추가 */
export async function saveProduct(session: EditSession, product: ProductEntry, originalCode: string | null, uploads: NewImage[]) {
  return commit(session, originalCode ? `제품 수정 — ${product.code}` : `제품 추가 — ${product.code}`, async () => {
    const before = await loadProducts(session);
    const index = originalCode ? before.findIndex((p) => p.code === originalCode) : -1;
    if (originalCode && index < 0) throw new EditError("그 사이 이 제품이 지워졌습니다. 새로고침 후 다시 확인해 주세요.");
    const clash = before.findIndex((p) => p.code.toLowerCase() === product.code.toLowerCase());
    if (clash >= 0 && clash !== index) throw new EditError(`이미 있는 제품 코드입니다: ${product.code}`);
    const after = [...before];
    if (index >= 0) after[index] = product;
    else after.push(product);
    const kept = new Set(product.images);
    return [
      ...uploads.filter((u) => kept.has(u.src)).map((u) => ({ path: imageFile(u.src), base64: u.base64 })),
      { path: PRODUCTS_FILE, text: json({ items: after }) },
      ...orphanRemovals(before, after),
    ];
  });
}

export async function deleteProduct(session: EditSession, code: string) {
  return commit(session, `제품 삭제 — ${code}`, async () => {
    const before = await loadProducts(session);
    const after = before.filter((p) => p.code !== code);
    return [{ path: PRODUCTS_FILE, text: json({ items: after }) }, ...orphanRemovals(before, after)];
  });
}

/** 순서 · 홈 노출 저장 — order는 코드 순서, home은 홈에 보일 코드 */
export async function saveOrder(session: EditSession, order: string[], home: Set<string>) {
  return commit(session, "제품 순서 · 홈 노출 변경", async () => {
    const before = await loadProducts(session);
    const byCode = new Map(before.map((p) => [p.code, p]));
    const sorted = order.filter((code) => byCode.has(code)).map((code) => ({ ...byCode.get(code)!, home: home.has(code) }));
    // 그 사이 다른 사람이 추가한 제품은 맨 뒤에 그대로 둔다
    const extra = before.filter((p) => !order.includes(p.code));
    return [{ path: PRODUCTS_FILE, text: json({ items: [...sorted, ...extra] }) }];
  });
}

/** 뉴스레터 전체(숨긴 호 포함) */
export async function loadStories(session: EditSession): Promise<(StoryEntry & { file: string })[]> {
  const files = (await listDir(session, STORY_DIR)).filter((f) => f.name.endsWith(".json"));
  const list = await Promise.all(
    files.map(async (f) => {
      const entry = await readJSON<StoryEntry>(session, f.path);
      return entry ? { vol: Number(entry.vol), html: entry.html, published: entry.published !== false, file: f.path } : null;
    }),
  );
  return list.filter((e): e is StoryEntry & { file: string } => Boolean(e && e.vol)).sort((a, b) => b.vol - a.vol);
}

export async function readStoryHtml(session: EditSession, entry: StoryEntry): Promise<string | null> {
  return readText(session, entry.html.replace(/^\/+/, ""));
}

/** 뉴스레터 저장 — html을 주면 파일도 새로 올린다 */
export async function saveStory(session: EditSession, entry: { vol: number; published: boolean }, html: string | null, isNew: boolean) {
  return commit(session, isNew ? `뉴스레터 올림 — Vol.${pad(entry.vol)}` : `뉴스레터 수정 — Vol.${pad(entry.vol)}`, async () => {
    const current = await loadStories(session);
    const existing = current.find((s) => s.vol === entry.vol);
    if (isNew && existing) throw new EditError(`Vol.${pad(entry.vol)}은 이미 있습니다. 다른 호수를 넣어 주세요.`);
    if (!isNew && !existing) throw new EditError("그 사이 이 뉴스레터가 지워졌습니다. 새로고침 후 다시 확인해 주세요.");
    const htmlPath = existing?.html.replace(/^\/+/, "") || `${STORY_FILES}/vol-${pad(entry.vol)}.html`;
    if (!html && !existing) throw new EditError("뉴스레터 HTML 파일을 올려 주세요.");
    return [
      ...(html ? [{ path: htmlPath, text: html }] : []),
      { path: existing?.file ?? `${STORY_DIR}/vol-${pad(entry.vol)}.json`, text: json({ vol: entry.vol, html: htmlPath, published: entry.published }) },
    ];
  });
}

export async function deleteStory(session: EditSession, vol: number) {
  return commit(session, `뉴스레터 삭제 — Vol.${pad(vol)}`, async () => {
    const current = await loadStories(session);
    const existing = current.find((s) => s.vol === vol);
    if (!existing) return [];
    return [
      { path: existing.file, remove: true as const },
      ...(existing.html.replace(/^\/+/, "").startsWith(`${STORY_FILES}/`) ? [{ path: existing.html.replace(/^\/+/, ""), remove: true as const }] : []),
    ];
  });
}
