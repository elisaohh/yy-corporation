import { CompanyIntro } from "@/components/home/CompanyIntro";
import { ContactCta } from "@/components/home/ContactCta";
import { HomeIntro } from "@/components/home/HomeIntro";
import { ProcessMotion } from "@/components/home/ProcessMotion";
import { ProductCollection } from "@/components/home/ProductCollection";
import { Slogan } from "@/components/home/Slogan";

/**
 * HOME — 2026-10-14 개편안(사용자 승인, Momix 리듬 참고 · 독자 구성)
 * ① 브랜드 인트로(자동 재생 약 5초) → ② 회사 소개(FIND · DRESS · MATCH · DELIVER)
 * → ③ 공정 모션(코팅 · 인쇄 · 부식 · 라벨 → 부자재 체결 → 실제 제품으로 확장)
 * → ④ PRODUCT 컬렉션 → ⑤ 슬로건 → ⑥ 차콜 CTA → 푸터
 */
export default function HomePage() {
  return (
    <>
      <HomeIntro />
      <CompanyIntro />
      <ProcessMotion />
      <ProductCollection />
      <Slogan />
      <ContactCta />
    </>
  );
}
