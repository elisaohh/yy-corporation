import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { EditProvider } from "@/components/edit/EditContext";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ImageGuard } from "@/components/layout/ImageGuard";
import { TopButton } from "@/components/layout/TopButton";
import { siteConfig } from "@/config/site";
import { company } from "@/data/company";
import { inter, pretendard } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  // 검색 사이트 소유 확인(네이버 서치어드바이저) — www는 Cloudflare에서 yycorp.co.kr로 이동
  verification: { other: { "naver-site-verification": "893574d475ba08549a5b2b24d7440fcd279bcac5" } },
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.nameKo} ${siteConfig.name} | 화장품 용기 패키징`,
    template: `%s | ${siteConfig.nameKo}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.nameKo,
  // 페이지마다 자기 주소를 대표 주소로(./ = 현재 페이지)
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "./",
    siteName: `${siteConfig.nameKo} ${siteConfig.name}`,
  },
};

/** 검색 사이트가 읽는 회사 · 사이트 정보(구조화 데이터) — 회사명 여러 표기를 하나로 묶는다 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.nameKo,
      alternateName: [siteConfig.name, "와이와이 코퍼레이션", "YY CORP", "와이와이"],
      url: siteConfig.url,
      logo: `${siteConfig.url}/assets/brand/derived/yy-logo-square-512.png`,
      email: company.email,
      telephone: company.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: "강서로 499 대하빌딩 4층",
        addressLocality: "강서구",
        addressRegion: "서울특별시",
        addressCountry: "KR",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      name: siteConfig.nameKo,
      alternateName: [siteConfig.name, "와이와이 코퍼레이션"],
      url: siteConfig.url,
      inLanguage: "ko-KR",
      publisher: { "@id": `${siteConfig.url}/#organization` },
    },
  ],
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={`${inter.variable} ${pretendard.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
