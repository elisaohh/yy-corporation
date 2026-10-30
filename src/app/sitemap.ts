import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { listNewsletters } from "@/lib/newsletter";

export const dynamic = "force-static";

const SITE = "https://yycorp.co.kr";

/** 사이트맵 — 검색 사이트에 알릴 페이지 목록(제품 · 뉴스레터는 데이터에서 자동으로 채움) */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["/", "/about/company/", "/about/story/", "/process/", "/products/", "/contact/", "/privacy/", "/terms/"];
  const stories = (await listNewsletters()).map((n) => `/about/story/${n.slug}/`);
  const items = products.map((p) => `/products/${p.slug}/`);
  return [...pages, ...stories, ...items].map((path) => ({ url: SITE + path }));
}
