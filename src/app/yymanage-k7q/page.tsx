import type { Metadata } from "next";
import { AdminLogin } from "@/components/edit/AdminLogin";
import { logos } from "@/data/brand";

export const metadata: Metadata = { title: "관리자 로그인", robots: { index: false, follow: false } };

/**
 * 관리자 로그인 — 누구나 주소로 열 수는 있으므로 사이트 메뉴 · 기능 설명 없이 로고와 로그인 버튼만 보인다.
 * (사이트 머리 · 바닥을 덮는 화면 전체 판)
 */
export default function AdminPage() {
  const logo = logos.horizontalCorporation;
  return (
    <section className="fixed inset-0 z-[70] flex items-center justify-center bg-mist px-6">
      <div className="grid w-full max-w-[360px] justify-items-center gap-8 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element -- 로고 SVG 원본 */}
        <img src={logo.src} alt="YY CORPORATION" width={logo.width} height={logo.height} className="h-9 w-auto" />
        <h1 className="text-[15px] font-medium tracking-[-0.01em] text-ash">관리자 로그인</h1>
        <AdminLogin branch={process.env.VERCEL_GIT_COMMIT_REF || process.env.CF_PAGES_BRANCH || "main"} local={process.env.NODE_ENV === "development"} />
      </div>
    </section>
  );
}
