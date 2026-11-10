"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ADMIN_PATH } from "@/lib/edit/path";
import { isStill } from "@/lib/still";

gsap.registerPlugin(ScrollTrigger);

/**
 * 부드러운 스크롤(Lenis) — 마우스 휠 · 트랙패드 스크롤을 부드럽게 이어 준다.
 * - GSAP ScrollTrigger(공정 모션 고정 · 스냅)와 같은 시계로 돌려 어긋나지 않게 한다.
 * - 휴대폰 터치는 기기 기본 스크롤 그대로(Lenis 기본값), 모션 줄이기 · ?still · 관리자 화면에서는 끈다.
 * - 페이지 안 링크(#faq-… 등)도 부드럽게 이동, 고정 헤더 높이만큼 덜 내려간다.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const off = pathname.startsWith(ADMIN_PATH);

  useEffect(() => {
    if (off || isStill() || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -80 } });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [off]);

  return null;
}
