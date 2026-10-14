import { ContactCta } from "@/components/home/ContactCta";
import { HomeIntro } from "@/components/home/HomeIntro";
import { IntroTransition } from "@/components/home/IntroTransition";
import { Services } from "@/components/home/Services";
import { Showcase } from "@/components/home/Showcase";
import { Slogan } from "@/components/home/Slogan";

/**
 * HOME — 기획서 2.0 부록 B 순서.
 * ① 차콜 인트로 → ② 화이트 전환(임시) → ③ 슬로건 → ④ FIND/DRESS/MATCH/DELIVER → ⑤ 대표 제품 → ⑥ 차콜 CTA → 푸터
 * HOME에는 회사 소개 섹션을 넣지 않는다(기획서 1.2).
 */
export default function HomePage() {
  return (
    <>
      <HomeIntro />
      <IntroTransition />
      <Slogan />
      <Services />
      <Showcase />
      <ContactCta />
    </>
  );
}
