import { CompanyIntro } from "@/components/home/CompanyIntro";
import { ContactCta } from "@/components/home/ContactCta";
import { HomeIntro } from "@/components/home/HomeIntro";
import { ProcessMotion } from "@/components/home/ProcessMotion";
import { ProductCollection } from "@/components/home/ProductCollection";
import { Slogan } from "@/components/home/Slogan";

/**
 * HOME — ① 히어로 → ② 회사 소개(FIND · DRESS · MATCH · DELIVER) → ③ 공정 모션
 * → ④ PRODUCT 컬렉션 → ⑤ 슬로건 → ⑥ 차콜 CTA → 푸터
 * 2026-10-15 시안 확정: 히어로 A · 회사 소개 A(미스트 배경) · 슬로건 A
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
