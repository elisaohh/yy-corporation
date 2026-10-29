import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // 뉴스레터 이름 변경(YY NOTES → YY LETTER) — 예전 상세 주소로 들어와도 새 주소로 이동
  async redirects() {
    return [{ source: "/about/story/yy-notes-vol-:vol", destination: "/about/story/yy-letter-vol-:vol", permanent: true }];
  },
};

export default nextConfig;
