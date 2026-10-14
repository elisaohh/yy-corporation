"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { ServicePanel } from "@/components/home/ServicePanel";
import { Reveal } from "@/components/motion/Reveal";
import { services } from "@/data/home";

gsap.registerPlugin(ScrollTrigger);

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * ④ FIND → DRESS → MATCH → DELIVER (부록 B3).
 * - 데스크톱(≥1024px): 화면 고정 후 왼쪽 60% 이미지가 가로로 이동, 오른쪽 40% 글은 제자리에서 페이드 교체.
 * - 모바일 · 태블릿 · 모션 줄이기: 세로로 쌓인 4개 블록 (가로 스크롤 강제 안 함).
 */
export function Services() {
  return (
    <>
      <ServicesHorizontal />
      <ServicesStacked />
    </>
  );
}

function ServicesHorizontal() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(section);
      const track = q("[data-track]")[0];
      const texts = q("[data-text]");
      const ticks = q("[data-tick]");
      const count = texts.length;

      gsap.set(texts, { opacity: 0, y: 20 });
      gsap.set(texts[0], { opacity: 1, y: 0 });
      gsap.set(ticks, { scaleX: 0.55, opacity: 0.35, transformOrigin: "left center" });
      gsap.set(ticks[0], { scaleX: 1, opacity: 1 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * (count - 1) * 1.1}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      for (let i = 1; i < count; i++) {
        const at = i - 1;
        tl.to(track, { xPercent: (-100 / count) * i, duration: 1, ease: "power2.inOut" }, at)
          .to(texts[i - 1], { opacity: 0, y: -16, duration: 0.3 }, at + 0.25)
          .to(texts[i], { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, at + 0.55)
          .to(ticks[i - 1], { scaleX: 0.55, opacity: 0.35, duration: 0.3 }, at + 0.4)
          .to(ticks[i], { scaleX: 1, opacity: 1, duration: 0.3 }, at + 0.5);
      }
      tl.to({}, { duration: 0.3 }); // 마지막 장면 머무름
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-header-theme="light"
      aria-label="사업 역량"
      className="relative hidden h-[100svh] overflow-hidden bg-paper motion-safe:lg:block"
    >
      <div className="container-yy grid h-full grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-center gap-16 pt-[var(--header-h)]">
        <div className="relative aspect-[16/11] max-h-[70svh] w-full overflow-hidden">
          <div data-track className="flex h-full" style={{ width: `${services.length * 100}%` }}>
            {services.map((service) => (
              <ServicePanel key={service.key} service={service} className="h-full flex-1" />
            ))}
          </div>
        </div>

        <div className="relative h-[min(420px,50svh)]">
          {services.map((service, i) => (
            <div key={service.key} data-text className="absolute inset-x-0 top-1/2 -translate-y-1/2" style={{ opacity: i === 0 ? 1 : 0 }}>
              <p className="font-en text-[13px] tracking-[0.12em] tabular-nums text-ash">
                {pad(i + 1)} / {pad(services.length)}
              </p>
              <h2 className="mt-4 font-en text-[clamp(56px,6vw,92px)] leading-none font-extralight tracking-[0.04em] uppercase">{service.name}</h2>
              <p className="mt-6 text-[clamp(22px,2vw,28px)] leading-[1.4] tracking-[-0.02em]">{service.line}</p>
              <p className="mt-3 text-[15px] text-ash">{service.scope}</p>
            </div>
          ))}
          <div className="absolute bottom-0 left-0 flex gap-2" aria-hidden="true">
            {services.map((service) => (
              <span key={service.key} data-tick className="block h-[2px] w-10 bg-charcoal" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesStacked() {
  return (
    <section data-header-theme="light" aria-label="사업 역량" className="bg-paper pb-24 md:pb-40 motion-safe:lg:hidden">
      <ol className="container-yy grid gap-20 md:gap-32">
        {services.map((service, index) => (
          <li key={service.key} className="grid items-center gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-12 lg:gap-20">
            <Reveal>
              <ServicePanel service={service} className="aspect-[16/11]" />
            </Reveal>
            <Reveal delay={140}>
              <p className="font-en text-[13px] tracking-[0.12em] tabular-nums text-ash">
                {pad(index + 1)} / {pad(services.length)}
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
