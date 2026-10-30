import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { EditProvider } from "@/components/edit/EditContext";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ImageGuard } from "@/components/layout/ImageGuard";
import { TopButton } from "@/components/layout/TopButton";
import { siteConfig } from "@/config/site";
import { inter, pretendard } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  // 검색 사이트 소유 확인(네이버 서치어드바이저) — www는 Cloudflare에서 yycorp.co.kr로 이동
  verification: { other: { "naver-site-verification": "893574d475ba08549a5b2b24d7440fcd279bcac5" } },
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={`${inter.variable} ${pretendard.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          본문 바로가기
        </a>
        <EditProvider>
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <TopButton />
          <ImageGuard />
        </EditProvider>
      </body>
    </html>
  );
}
