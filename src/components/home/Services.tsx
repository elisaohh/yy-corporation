import { AssetImage, isPlaceholderAsset } from "@/components/media/AssetImage";
import { Reveal } from "@/components/motion/Reveal";
import { Pending } from "@/components/ui/Pending";
import { services } from "@/data/home";

/**
 * ④ FIND → DRESS → MATCH → DELIVER (부록 B3) — 첫 시안: 정적 배치.
 * 화이트 고정, 이미지 60% / 텍스트 40%. 모바일은 세로 배치.
 * 모션 단계에서 데스크톱만 "이미지는 가로로 이동, 텍스트는 제자리에서 페이드 교체"하는 가로 스크롤로 바꾼다.
 */
export function Services() {
  return (
    <section data-header-theme="light" aria-label="사업 역량" className="bg-paper pb-24 md:pb-40">
      <ol className="container-yy grid gap-20 md:gap-32">
        {services.map((service, index) => (
          <li key={service.key} className="grid items-center gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-12 lg:gap-20">
            <Reveal className="relative aspect-[16/11] overflow-hidden bg-card">
              <AssetImage id={service.image} className="absolute inset-0 size-full object-contain p-[8%]" />
              {isPlaceholderAsset(service.image) && (
                <span className="absolute left-4 top-4">
                  <Pending kind="temporary" label="임시 이미지" />
                </span>
              )}
            </Reveal>
            <Reveal delay={140}>
              <p className="font-en text-[13px] tracking-[0.12em] tabular-nums text-ash">
                {String(index + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
              </p>
              <h2 className="mt-4 font-en text-[clamp(44px,6vw,92px)] leading-none font-extralight tracking-[0.04em] uppercase">
                {service.name}
              </h2>
              <p className="mt-6 text-[clamp(20px,2vw,28px)] leading-[1.4] font-normal tracking-[-0.02em]">{service.line}</p>
              <p className="mt-3 text-[15px] text-ash">{service.scope}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
