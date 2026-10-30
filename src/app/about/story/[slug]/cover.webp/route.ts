import sharp from "sharp";
import { listNewsletters, newsletterCover } from "@/lib/newsletter";

/**
 * 목록 카드 대표 사진 — 뉴스레터 HTML의 첫 번째 사진을 빌드 시 webp 파일로 만든다.
 * 주소에 확장자(.webp)가 있어 서버 없이 올리는 곳(Cloudflare Pages 등)에서도 사진으로 읽힌다.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await listNewsletters()).filter((n) => n.cover).map((n) => ({ slug: n.slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cover = await newsletterCover(slug);
  if (!cover) return new Response("Not found", { status: 404 });
  const webp = await sharp(cover.data).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 84 }).toBuffer();
  return new Response(new Uint8Array(webp), { headers: { "Content-Type": "image/webp", "Cache-Control": "public, max-age=31536000, immutable" } });
}
