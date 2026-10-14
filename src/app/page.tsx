import { ContactCta } from "@/components/home/ContactCta";
import { HomeIntro } from "@/components/home/HomeIntro";
import { Services } from "@/components/home/Services";
import { Showcase } from "@/components/home/Showcase";
import { Slogan } from "@/components/home/Slogan";

/**
 * HOME — 기획서 2.0 부록 B 순서.
 * ① 차콜 인트로 + ② 반사광 화이트 전환(인트로 고정 구간의 끝) → ③ 슬로건 → ④ FIND/DRESS/MATCH/DELIVER
 * → ⑤ 대표 제품 → ⑥ 차콜 CTA → 푸터
 * HOME에는 회사 소개 섹션을 넣지 않는다(기획서 1.2).
 */
export default function HomePage() {
  return (
    <>
      <HomeIntro />
      <Slogan />
      <Services />
      <Showcase />
      <ContactCta />
    </>
  );
}
