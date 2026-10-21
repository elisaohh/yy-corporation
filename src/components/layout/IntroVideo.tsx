"use client";

import { useEffect, useRef } from "react";
import { isStill } from "@/lib/still";

interface IntroVideoProps {
  src: string;
  /** 재생 시작 · 반복 시작 시점(초) — 이 시점부터 끝까지만 반복한다 */
  start?: number;
  /** 확대 배율과 기준점 — 원본 해상도보다 크게 늘어나지 않도록 1.3 이하 권장 */
  zoom?: number;
  focus?: string;
  /** 준비된 뒤의 투명도 등 — 예: "data-ready:opacity-60" */
  className?: string;
}

/**
 * 머리 영역 배경 영상 — 소리 없음 · 자동 재생 · 반복(start초 ~ 끝).
 * 모션 줄이기 · ?still: start 시점 장면에서 멈춘 채로 보인다.
 */
export function IntroVideo({ src, start = 0, zoom = 1, focus = "50% 50%", className = "" }: IntroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const still = isStill() || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const toStart = () => {
      if (Math.abs(v.currentTime - start) > 0.05) v.currentTime = start;
    };
    // start 시점 장면이 준비되면 부드럽게 나타남(앞부분 장면이 잠깐 보이지 않도록) — data-ready
    const show = () => {
      if (v.currentTime >= start - 0.2) v.dataset.ready = "";
    };
    const shownOn = ["loadeddata", "seeked", "canplay", "playing"] as const;
    shownOn.forEach((t) => v.addEventListener(t, show));
    const onMeta = () => {
      toStart();
      if (!still) v.play().catch(() => {});
    };
    // 끝에 닿으면 start 시점으로 돌아간다(앞부분은 쓰지 않음)
    const onTime = () => {
      if (v.duration && v.currentTime >= v.duration - 0.12) v.currentTime = start;
    };
    const onEnded = () => {
      v.currentTime = start;
      if (!still) v.play().catch(() => {});
    };
    if (v.readyState >= 1) onMeta();
    if (v.readyState >= 2) show();
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnded);
    return () => {
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnded);
      shownOn.forEach((t) => v.removeEventListener(t, show));
    };
  }, [start]);

  return (
    <video
      ref={ref}
      src={`${src}#t=${start}`}
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      className={`absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-1000 ${className}`}
      style={{ objectPosition: focus, transform: zoom !== 1 ? `scale(${zoom})` : undefined, transformOrigin: focus }}
    />
  );
}
