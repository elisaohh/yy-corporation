"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Pending } from "@/components/ui/Pending";
import { exampleNotice, finishingProcesses } from "@/data/process";

/** 자연스러운 세로 스크롤을 가로 슬라이드 전환에 매핑. GSAP pin/DOM 재배치 없음. */
export function FinishingSections() {
  const outerRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const lockedUntil = useRef(0);
  const [reduced, setReduced] = useState(false);
  const count = finishingProcesses.length;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(media.matches);
    const change = () => setReduced(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const root = outerRef.current;
    if (!root) return;
    let frame = 0;
    const distance = () => Math.max(1, root.offsetHeight - window.innerHeight);
    const top = () => root.getBoundingClientRect().top + window.scrollY;
    const target = (i: number) => top() + (distance() * i) / count;
    const sync = () => {
      frame = 0;
      const p = Math.max(0, Math.min(1, (window.scrollY - top()) / distance()));
      const next = Math.min(count - 1, Math.round(p * count));
      if (Date.now() > lockedUntil.current) {
        activeRef.current = next;
        setActive(next);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 3 || event.ctrlKey) return;
      const rect = root.getBoundingClientRect();
      const visible = rect.top <= 2 && rect.bottom >= window.innerHeight - 2;
      if (!visible) return;
      const direction = Math.sign(event.deltaY);
      const current = activeRef.current;
      // 첫 카드에서 위로, 마지막 카드에서 아래로는 자연스럽게 다음 섹션으로 이동
      if ((current === 0 && direction < 0) || (current === count - 1 && direction > 0)) return;
      event.preventDefault();
      if (Date.now() < lockedUntil.current) return;
      const next = Math.max(0, Math.min(count - 1, current + direction));
      activeRef.current = next;
      setActive(next);
      lockedUntil.current = Date.now() + 850;
      window.scrollTo({ top: target(next), behavior: "smooth" });
    };
    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("wheel", onWheel);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced, count]);

  const go = (index: number) => {
    const el = outerRef.current;
    if (!el) return;
    const next = Math.max(0, Math.min(count - 1, index));
    activeRef.current = next;
    setActive(next);
    lockedUntil.current = Date.now() + 850;
    const distance = Math.max(1, el.offsetHeight - window.innerHeight);
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (distance * next) / count, behavior: reduced ? "instant" : "smooth" });
  };

  return (
    <section ref={outerRef} data-header-theme="light" aria-label="후가공 공정" className="relative bg-paper" style={{ height: reduced ? "auto" : `${count * 100 + 100}svh` }}>
      <div className={reduced ? "container-yy py-20" : "sticky top-0 flex h-[100svh] flex-col overflow-hidden pt-[var(--header-offset,0px)]"}>
        <div className={reduced ? "" : "container-yy flex min-h-0 flex-1 flex-col py-8 md:py-10"}>
          <div className="mb-4 flex shrink-0 items-center justify-between border-b border-stone pb-3">
            <div className="flex gap-4 overflow-x-auto [scrollbar-width:none]">
              {finishingProcesses.map((p, i) => <button type="button" key={p.key} onClick={() => go(i)} aria-current={active === i ? "step" : undefined} className={`shrink-0 font-en text-[11px] font-semibold tracking-[0.08em] md:text-[13px] ${active === i ? "text-charcoal" : "text-ash"}`}>{p.name}</button>)}
            </div>
            <span className="ml-4 shrink-0 font-en text-[11px] tabular-nums text-ash">{String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
          </div>
          <div className={reduced ? "space-y-14" : "min-h-0 flex-1 overflow-hidden"}>
            <div className={reduced ? "space-y-14" : "flex h-full will-change-transform transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"} style={reduced ? undefined : { width: `${count * 100}%`, transform: `translate3d(-${active * (100 / count)}%,0,0)` }}>
              {finishingProcesses.map((p, i) => (
                <article key={p.key} className={reduced ? "grid gap-7 md:grid-cols-12" : "grid h-full min-h-0 shrink-0 grid-cols-1 gap-5 overflow-y-auto pb-3 md:grid-cols-12 md:items-center md:gap-8"} style={reduced ? undefined : { width: `${100 / count}%` }}>
                  <div className="flex min-h-0 items-center justify-center md:col-span-5">
                    <div className="flex h-[min(27svh,230px)] w-full items-center justify-center bg-card md:h-[min(54svh,540px)]">
                      <img src={p.exampleImage} alt={`${p.nameKo} 후가공 생성 예시`} loading="lazy" className="h-full w-full object-contain mix-blend-multiply" />
                    </div>
                  </div>
                  <div className="md:col-span-6 md:col-start-7">
                    <p className="font-en text-[11px] text-ash">{String(i + 1).padStart(2, "0")} / 04</p>
                    <h3 className="mt-2 font-en text-[clamp(34px,5vw,76px)] font-extrabold leading-[0.95] tracking-[-0.045em] text-charcoal">{p.name}</h3>
                    <p className="mt-3 text-[15px] font-semibold text-charcoal">{p.nameKo} <span className="font-normal text-ash">— {p.line}</span></p>
                    {p.summary.text ? <p className="mt-3 text-[14px] leading-[1.7] text-ash">{p.summary.text}</p> : <p className="mt-3 text-[12px] text-ash">공정 설명 <Pending /></p>}
                    <ol className="mt-5 border-t border-stone md:mt-7">
                      {p.steps.map((step, s) => <li key={`${step.en}-${s}`} className="grid grid-cols-[25px_minmax(0,1fr)] gap-2 border-b border-stone py-2 text-[12px] md:grid-cols-[28px_minmax(0,1fr)_minmax(0,1fr)] md:py-2.5"><span className="font-en text-ash">{String(s + 1).padStart(2, "0")}</span><span>{step.ko}</span><span className="col-start-2 font-en text-ash md:col-start-auto">{step.en}</span></li>)}
                    </ol>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="mt-3 flex shrink-0 items-center gap-2" aria-hidden="true">
            {finishingProcesses.map((p, i) => <div key={p.key} className="h-[2px] flex-1 bg-stone"><div className="h-full bg-charcoal" style={{ width: `${(i <= active ? 1 : 0) * 100}%` }} /></div>)}
          </div>
          <p className="mt-3 shrink-0 text-[11px] text-ash">{exampleNotice}</p>
        </div>
      </div>
    </section>
  );
}
