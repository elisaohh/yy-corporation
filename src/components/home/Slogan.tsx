import { Reveal } from "@/components/motion/Reveal";
import { Pending } from "@/components/ui/Pending";
import { slogan } from "@/data/home";

/**
 * ③ 슬로건 — 화이트 바탕, 넓은 여백, 큰 한글 타이포. '병 하나,' → '처음부터 끝까지' 순서대로 등장 (부록 B2).
 */
export function Slogan() {
  const [first, second] = slogan.lines;
  return (
    <section data-header-theme="light" aria-label="브랜드 슬로건" className="flex min-h-[92svh] items-center bg-paper py-32">
      <div className="container-yy">
        <h2 className="text-[clamp(40px,6.6vw,104px)] leading-[1.18] font-light tracking-[-0.035em]">
          <Reveal as="span" className="block">
            {first}
          </Reveal>
          <Reveal as="span" delay={380} className="block md:pl-[16%]">
            {second}
          </Reveal>
        </h2>
        {slogan.sub.text && (
          <Reveal delay={760} className="mt-12 max-w-[34ch] md:mt-16 md:pl-[16%]">
            <p className="text-[clamp(16px,1.3vw,18px)] leading-[1.75] text-ash">{slogan.sub.text}</p>
            {slogan.sub.status !== "final" && (
              <p className="mt-3">
                <Pending kind="draft" />
              </p>
            )}
          </Reveal>
        )}
      </div>
    </section>
  );
}
