import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

/**
 * 내 컴퓨터(npm run dev)에서만 쓰는 편집 저장소 — 운영 사이트에서는 항상 404.
 * 읽고 쓸 수 있는 곳: content/ · public/assets/products/
 */
export const dynamic = "force-dynamic";

const ROOT = process.cwd();
const ALLOWED = ["content/", "public/assets/products/"];
const dev = process.env.NODE_ENV === "development";

function resolve(rel: string | null): string | null {
  if (!rel) return null;
  const clean = rel.replace(/\\/g, "/").replace(/^\/+/, "");
  if (clean.split("/").includes("..") || !ALLOWED.some((dir) => clean.startsWith(dir))) return null;
  return path.join(/*turbopackIgnore: true*/ ROOT, clean);
}

export async function GET(request: Request) {
  if (!dev) return new Response(null, { status: 404 });
  const url = new URL(request.url);
  const dir = url.searchParams.get("dir");
  if (dir) {
    const full = resolve(dir.endsWith("/") ? dir : `${dir}/`);
    if (!full) return new Response(null, { status: 400 });
    const names = await readdir(full, { withFileTypes: true }).catch(() => []);
    const base = dir.replace(/\/+$/, "");
    return NextResponse.json(names.filter((d) => d.isFile()).map((d) => ({ name: d.name, path: `${base}/${d.name}` })));
  }
  const full = resolve(url.searchParams.get("path"));
  if (!full) return new Response(null, { status: 400 });
  try {
    return new Response(await readFile(full, "utf8"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  } catch {
    return new Response(null, { status: 404 });
  }
}

export async function POST(request: Request) {
  if (!dev) return new Response(null, { status: 404 });
  const { changes } = (await request.json()) as { changes: { path: string; text?: string; base64?: string; remove?: boolean }[] };
  for (const change of changes) {
    const full = resolve(change.path);
    if (!full) return new Response(`허용되지 않는 경로: ${change.path}`, { status: 400 });
    if (change.remove) {
      await rm(full, { force: true });
      continue;
    }
    await mkdir(path.dirname(full), { recursive: true });
    await writeFile(full, change.text !== undefined ? change.text : Buffer.from(change.base64 ?? "", "base64"));
  }
  return NextResponse.json({ ok: true });
}
