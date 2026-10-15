import { Reveal } from "@/components/motion/Reveal";

/**
 * ONE-STOP SYSTEM — 항목마다 전용 현장 사진 2장(자료/02_후가공/작업사진/glass · surface · delivery-NN, scripts/build-onestop-photos.mjs).
 * 사진은 자르지 않는다: 두 장을 같은 높이로 맞추고 폭은 각 사진의 비율대로 나눈다(가로 · 세로 사진이 섞여도 온전히 보임).
 * 현장 사진은 각 공정의 실제 증빙 사진으로 단정하지 않는다.
 */
type Photo = { src: string; w: number; h: number };

const BASE = "/assets/process/onestop";
const sections: { title: string; en: string; description: string; photos: Photo[] }[] = [
  {
    title: "유리 성형",
    en: "GLASS FORMING",
    description: "협력 제조사의 자동화 성형 라인에서 균일한 품질의 유리 용기를 생산합니다.",
    photos: [
      { src: `${BASE}/glass-01.webp`, w: 960, h: 720 },
      { src: `${BASE}/glass-02.webp`, w: 960, h: 720 },
    ],
  },
  {
    title: "후가공",
    en: "SURFACE FINISHING",
    description: "코팅·인쇄·부식·라벨 등 다양한 후가공을 통해 브랜드에 맞는 색상과 표면 질감을 구현합니다.",
    photos: [
      { src: `${BASE}/surface-01.webp`, w: 960, h: 720 },
      { src: `${BASE}/surface-02.webp`, w: 721, h: 961 },
    ],
  },
  {
    title: "입고 및 납품",
    en: "DELIVERY",
    description: "생산 일정과 품질을 확인하고, 입고부터 최종 납품까지 체계적으로 관리합니다.",
    photos: [
      { src: `${BASE}/delivery-01.webp`, w: 960, h: 720 },
      { src: `${BASE}/delivery-02.webp`, w: 960, h: 720 },
    ],
  },
];

export function OneStopSystem() {
  return (
    <section data-header-theme="light" aria-labelledby="one-stop-title" className="bg-paper py-24 md:py-36">
      <div className="container-yy">
        <div className="mb-14 md:mb-20">
          <p className="label-en text-ash">PRODUCTION NETWORK</p>
          <h2 id="one-stop-title" className="mt-4 font-en text-[clamp(38px,5vw,68px)] font-extrabold leading-[1] tracking-[-0.045em] text-charcoal">ONE-STOP SYSTEM</h2>
          <p className="mt-5 max-w-[50ch] text-[15px] leading-[1.8] text-ash">용기 생산부터 후가공, 입고와 납품까지 연결되는 생산 네트워크를 소개합니다.</p>
        </div>

        <div className="grid gap-20 md:gap-28">
          {sections.map((item, i) => (
            <article key={item.en}>
              <Reveal className="grid gap-4 border-t border-charcoal pt-6 md:grid-cols-12 md:items-baseline md:gap-8">
                <p className="font-en text-[12px] tracking-[0.12em] text-ash md:col-span-3">
                  {String(i + 1).padStart(2, "0")} / 03 — {item.en}
                </p>
                <h3 className="text-[clamp(26px,2.8vw,40px)] font-bold tracking-[-0.035em] text-charcoal md:col-span-4">{item.title}</h3>
                <p className="max-w-[40ch] text-[16px] leading-[1.8] text-ash md:col-span-5">{item.description}</p>
              </Reveal>

              {/* 같은 높이 · 비율대로 폭 분배 — 자르지 않음 */}
              <Reveal delay={120} className="mt-8 flex flex-col gap-3 sm:flex-row md:mt-10 md:gap-4">
                {item.photos.map((p) => (
                  <div key={p.src} className="overflow-hidden bg-card" style={{ flex: `${p.w / p.h} 1 0%`, aspectRatio: `${p.w} / ${p.h}` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- 현장 사진 웹 사본 */}
                    <img
                      src={p.src}
                      alt=""
                      width={p.w}
                      height={p.h}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-700 ease-[var(--ease-yy-out)] hover:scale-[1.03]"
                    />
                  </div>
                ))}
              </Reveal>
            </article>
          ))}
        </div>

        <p className="mt-12 text-[12px] leading-[1.7] text-ash">현장 사진은 생산 및 관리 환경을 보여주는 참고 자료이며, 각 항목의 실제 작업 장면을 의미하지 않습니다.</p>
      </div>
    </section>
  );
}
