import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Pending } from "@/components/ui/Pending";
import { cta } from "@/data/home";

/**
 * ⑥ 마지막 CTA — 차콜 바탕 + 대형 영문 타이포 + 짧은 한글 설명 + CONTACT US ↗ (부록 B5).
 * 제품 이미지 없음. 문구는 미확정(초안)이라 data/home.ts 에서 교체한다.
 * 바탕색은 --color-outro 토큰 — 어둡게 느껴지면 토큰만 밝게 조정.
 */
export function ContactCta() {
  return (
    <section
      data-header-theme="dark"
      data-surface="dark"
      data-no-top
      aria-labelledby="cta-title"
      className="bg-outro text-on-dark"
    >
      <div className="container-yy py-32 md:py-48">
        <Reveal>
          <h2
            id="cta-title"
            className="max-w-[12ch] font-en text-[clamp(44px,8.4vw,116px)] leading-[0.92] font-semibold tracking-[-0.045em] uppercase"
          >
            {cta.title.text}
          </h2>
        </Reveal>
        <Reveal delay={160} className="mt-10 flex flex-col gap-10 md:mt-14 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="max-w-[34ch] text-[clamp(16px,1.3vw,18px)] leading-[1.75] text-on-dark-sub">{cta.sub.text}</p>
            {(cta.title.status !== "final" || cta.sub.status !== "final") && (
              <p className="mt-3">
                <Pending kind="draft" label="문구 미확정 · 임시 초안" />
              </p>
            )}
          </div>
          <Link href="/contact" className="btn btn-inverse btn-en self-start md:self-auto">
            {cta.button}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
