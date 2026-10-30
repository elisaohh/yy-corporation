import type { MetadataRoute } from "next";
import { ADMIN_PATH } from "@/lib/edit/path";

export const dynamic = "force-static";

/** 검색 사이트 안내 — 관리자 화면만 빼고 모두 수집 허용 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: [`${ADMIN_PATH}/`, "/api/"] },
    sitemap: "https://yycorp.co.kr/sitemap.xml",
    host: "https://yycorp.co.kr",
  };
}
