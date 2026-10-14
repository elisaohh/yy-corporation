import { CompanyIntro } from "@/components/home/CompanyIntro";
import { ContactCta } from "@/components/home/ContactCta";
import { HomeIntro } from "@/components/home/HomeIntro";
import { ProcessMotion } from "@/components/home/ProcessMotion";
import { ProductCollection } from "@/components/home/ProductCollection";
import { Slogan } from "@/components/home/Slogan";
import { VariantSwitcher } from "@/components/review/VariantSwitcher";
import { pickVariant } from "@/config/variants";

/**
 * HOME — ① 히어로 → ② 회사 소개(FIND · DRESS · MATCH · DELIVER) → ③ 공정 모션
 * → ④ PRODUCT 컬렉션 → ⑤ 슬로건 → ⑥ 차콜 CTA → 푸터
 * ①②⑤는 시안 비교 중 — ?hero=&intro=&slogan= (config/variants.ts)
 */
export default async function HomePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const hero = pickVariant("hero", sp.hero);
  const intro = pickVariant("intro", sp.intro);
  const slogan = pickVariant("slogan", sp.slogan);

  return (
    <>
      <HomeIntro variant={hero} />
      <CompanyIntro key={`intro-${intro}`} variant={intro} />
      <ProcessMotion />
      <ProductCollection />
      <Slogan key={`slogan-${slogan}`} variant={slogan} />
      <ContactCta />
      <VariantSwitcher current={{ hero, intro, slogan }} />
    </>
  );
}
