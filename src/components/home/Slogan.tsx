import { Logo } from "@/components/brand/Logo";
import { Reveal } from "@/components/motion/Reveal";
import { Pending } from "@/components/ui/Pending";
import { slogan } from "@/data/home";

/**
 * ⑤ 슬로건 '병 하나, 처음부터 끝까지' — 2026-10-15 A안 확정.
 * 미스트 배경 + 굵은 글씨 + 반투명 로고 그래픽(단색 파생본 — 그래픽 전용 규칙).
 */
export function Slogan() {
  const [first, second] = slogan.lines;

  return (
    <section data-header-theme="light" aria-label="브랜드 슬로건" className="relative flex min-h-[86svh] items-center overflow-hidden bg-mist py-28">
      <div aria-hidden="true" className="pointer-events-none absolute -right-[6%] top-1/2 w-[min(70vw,980px)] -translate-y-1/2 opacity-[0.06]">
        <Logo variant="verticalCorporation" tone="monoCharcoal" decorative className="h-auto w-full" />
      </div>

      <div className="container-yy relative">
        <h2 className="text-[clamp(44px,7vw,116px)] leading-[1.12] font-bold tracking-[-0.045em] text-charcoal">
          <Reveal as="span" className="block">
            {first}
          </Reveal>
          <Reveal as="span" delay={300} className="block md:pl-[14%]">
            {second}
          </Reveal>
        </h2>
        {slogan.sub.text && (
          <Reveal delay={600} className="mt-10 md:mt-14 md:pl-[14%]">
            <p className="max-w-[34ch] text-[clamp(16px,1.3vw,18px)] leading-[1.75] text-ash">{slogan.sub.text}</p>
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
