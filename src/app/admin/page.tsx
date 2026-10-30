import type { Metadata } from "next";
import { AdminLogin } from "@/components/edit/AdminLogin";

export const metadata: Metadata = { title: "관리자 로그인", robots: { index: false, follow: false } };

/** 관리자 로그인 — 로그인하면 사이트 곳곳에 편집 버튼이 생긴다 */
export default function AdminPage() {
  return (
    <section data-header-theme="light" className="bg-mist">
      <div className="container-yy flex min-h-[calc(100svh-var(--header-h))] flex-col justify-center py-20">
        <p className="label-en text-ash">Admin</p>
        <h1 className="mt-4 font-en text-[clamp(40px,5.4vw,72px)] leading-none font-extrabold tracking-[-0.04em] uppercase">Edit the site</h1>
        <p className="mt-5 mb-10 max-w-[520px] text-[16px] leading-[1.75] text-ash">
          로그인하면 PRODUCT · 홈 · STORY 화면에 추가 · 수정 버튼이 생깁니다. 사이트를 보면서 바로 고치세요.
        </p>
        <AdminLogin branch={process.env.VERCEL_GIT_COMMIT_REF || process.env.CF_PAGES_BRANCH || "main"} local={process.env.NODE_ENV === "development"} />
      </div>
    </section>
  );
}
