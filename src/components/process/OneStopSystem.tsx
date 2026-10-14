import photos from "@/data/site-photos.json";

const sections = [
  { title: "유리 성형", en: "GLASS FORMING", description: "협력 제조사의 자동화 성형 라인에서 균일한 품질의 유리 용기를 생산합니다." },
  { title: "후가공", en: "SURFACE FINISHING", description: "코팅·인쇄·부식·라벨 등 다양한 후가공을 통해 브랜드에 맞는 색상과 표면 질감을 구현합니다." },
  { title: "입고 및 납품", en: "DELIVERY", description: "생산 일정과 품질을 확인하고, 입고부터 최종 납품까지 체계적으로 관리합니다." },
];

/** 현장 사진은 각 공정의 실제 증빙 사진으로 단정하지 않습니다. */
export function OneStopSystem() {
  return (
    <section data-header-theme="light" aria-labelledby="one-stop-title" className="bg-paper py-24 md:py-36">
      <div className="container-yy">
        <div className="mb-14 md:mb-20">
          <p className="label-en text-ash">PRODUCTION NETWORK</p>
          <h2 id="one-stop-title" className="mt-4 font-en text-[clamp(38px,5vw,68px)] font-extrabold leading-[1] tracking-[-0.045em] text-charcoal">ONE-STOP SYSTEM</h2>
          <p className="mt-5 max-w-[50ch] text-[15px] leading-[1.8] text-ash">용기 생산부터 후가공, 입고와 납품까지 연결되는 생산 네트워크를 소개합니다.</p>
        </div>
        <div className="border-t border-stone">
          {sections.map((item, i) => {
            const first = photos.length ? photos[(i * 2) % photos.length] : undefined;
            const second = photos.length ? photos[(i * 2 + 1) % photos.length] : undefined;
            return (
              <article key={item.en} className="grid gap-7 border-b border-stone py-10 md:grid-cols-12 md:gap-10 md:py-16">
                <div className="md:col-span-4 md:pt-3">
                  <p className="font-en text-[12px] tracking-[0.12em] text-ash">{String(i + 1).padStart(2, "0")} / 03 — {item.en}</p>
                  <h3 className="mt-5 text-[clamp(28px,3vw,44px)] font-bold tracking-[-0.035em] text-charcoal">{item.title}</h3>
                  <p className="mt-4 max-w-[35ch] text-[16px] leading-[1.8] text-ash">{item.description}</p>
                </div>
                {/* 큰 가로 사진 + 오른쪽 세로 보조 사진 */}
<div className="grid grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] gap-3 md:col-span-8 md:gap-4">
  <div className="aspect-[4/3] overflow-hidden bg-card">
    <img
      src="/images/process/glass-01.jpg"
      alt="생산 및 관리 현장"
      loading="lazy"
      className="size-full object-cover"
    />
  </div>

  <div className="aspect-[3/4] overflow-hidden bg-card">
    <img
      src="/images/process/glass-02.jpg"
      alt="생산 및 관리 현장"
      loading="lazy"
      className="size-full object-cover"
    />
  </div>
</div>
              </article>
            );
          })}
        </div>
        <p className="mt-8 text-[12px] leading-[1.7] text-ash">현장 사진은 생산 및 관리 환경을 보여주는 참고 자료이며, 각 항목의 실제 작업 장면을 의미하지 않습니다.</p>
      </div>
    </section>
  );
}
