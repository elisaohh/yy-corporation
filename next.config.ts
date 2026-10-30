import type { NextConfig } from "next";

/**
 * NEXT_OUTPUT=export 로 빌드하면(npm run export) 서버 없이 올릴 수 있는 완성 파일(out/)을 만든다 — 카페24 웹호스팅용.
 * 평소(Vercel)에는 일반 빌드.
 */
const staticExport = process.env.NEXT_OUTPUT === "export";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(staticExport
    ? {
        output: "export",
        // 일반 웹호스팅은 /about/company → /about/company/index.html 로 찾는다
        trailingSlash: true,
        // 사진 최적화 서버가 없으므로 원본 그대로
        images: { unoptimized: true },
      }
    : {
        // 뉴스레터 이름 변경(YY NOTES → YY LETTER) — 예전 상세 주소로 들어와도 새 주소로 이동(완성 파일에서는 .htaccess가 대신함)
        async redirects() {
          return [{ source: "/about/story/yy-notes-vol-:vol", destination: "/about/story/yy-letter-vol-:vol", permanent: true }];
        },
      }),
};

export default nextConfig;
