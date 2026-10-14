"use client";

import { useEffect, useRef, useState } from "react";
import photos from "@/data/site-photos.json";

/**
 * PROCESS ③ 현장 사진 — 큰 메인 이미지 + 아래 가로 썸네일(부록 F).
 * 공정별 사례가 아니라 관리 현장을 보여 주는 사진이라 사진마다 공정 이름을 붙이지 않는다.
 * 키보드: 좌우 화살표로 이전 · 다음.
 */
export function SiteGallery() {
  const [index, setIndex] = useState(0);
  const stripRef = useRef<HTMLUListElement>(null);
  const total = photos.length;
  const go = (i: number) => setIndex((i + total) % total);

  // 선택한 썸네일이 보이도록 가로 스크롤
  useEffect(() => {
    const strip = stripRef.current;
    const item = strip?.children[index] as HTMLElement | undefined;
    if (!strip || !item) return;
    strip.scrollTo({ left: item.offsetLeft - strip.clientWidth / 2 + item.clientWidth / 2, behavior: "smooth" });
  }, [index]);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="현장 사진"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
      className="outline-offset-4"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-card md:aspect-[16/9]">
        {photos.map((p, i) => (
          // eslint-disable-next-line @next/next/no-img-element -- 현장 사진 웹 사본
          <img
            key={p.src}
            src={p.src}
            alt=""
            width={p.width}
            height={p.height}
            loading={i < 2 ? "eager" : "lazy"}
            aria-hidden={i !== index}
            className="absolute inset-0 size-full object-cover transition-opacity duration-700 ease-[var(--ease-yy-out)]"
            style={{ opacity: i === index ? 1 : 0 }}
          />
        ))}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-gradient-to-t from-black/45 to-transparent px-4 pb-4 pt-12 text-on-dark md:px-6 md:pb-5">
          <p aria-live="polite" className="font-en text-[13px] tabular-nums tracking-[0.08em]">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={() => go(index - 1)} aria-label="이전 사진" className="grid size-11 place-items-center rounded-full border border-white/60 transition-colors hover:bg-white hover:text-charcoal">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 12H5M10 7l-5 5 5 5" /></svg>
            </button>
            <button type="button" onClick={() => go(index + 1)} aria-label="다음 사진" className="grid size-11 place-items-center rounded-full border border-white/60 transition-colors hover:bg-white hover:text-charcoal">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 12h15M14 7l5 5-5 5" /></svg>
            </button>
          </div>
        </div>
      </div>

      <ul ref={stripRef} className="mt-3 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]">
        {photos.map((p, i) => (
          <li key={p.thumb} className="shrink-0">
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${i + 1}번째 사진 보기`}
              aria-current={i === index ? "true" : undefined}
              className={`block h-[60px] w-[80px] overflow-hidden transition-opacity duration-300 md:h-[72px] md:w-[96px] ${i === index ? "opacity-100 ring-2 ring-charcoal ring-offset-2" : "opacity-55 hover:opacity-100"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- 썸네일 */}
              <img src={p.thumb} alt="" loading="lazy" className="size-full object-cover" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
