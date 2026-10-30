import type { NextConfig } from "next";

/**
 * Cloudflare Pages에서 빌드할 때(CF_PAGES=1, npm run build:cloudflare)는 서버 없이 올리는 완성 파일(out/)로 만든다.
 * 서버가 필요한 로그인 2곳은 functions/api/decap/ 의 Cloudflare 함수가 맡는다.
 * Vercel · 내 컴퓨터에서는 일반 빌드.
 */
const staticExport = process.env.NEXT_OUTPUT === "export";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(staticExport
    ? {
        output: "export",
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {
        // 뉴스레터 이름 변경(YY NOTES → YY LETTER) — 예전 상세 주소로 들어와도 새 주소로 이동(Cloudflare는 _redirects가 대신함)
        async redirects() {
          return [{ source: "/about/story/yy-notes-vol-:vol", destination: "/about/story/yy-letter-vol-:vol", permanent: true }];
        },
      }),
};

export default nextConfig;
