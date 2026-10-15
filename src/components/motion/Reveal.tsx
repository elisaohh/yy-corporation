"use client";

import { isStill } from "@/lib/still";
import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

interface RevealProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** 등장 지연(ms) — 순차 등장에 사용 */
  delay?: number;
  /** 화면 하단에서 이만큼 들어와야 시작 (0–1) */
  threshold?: number;
}

/**
 * 화면에 들어올 때 한 번, 투명도 + 16px 상승으로 등장 (기획서: 일반 등장 300–700ms).
 * 모션 줄이기 설정에서는 즉시 보인다.
 */
export function Reveal({ as: Tag = "div", children, className = "", delay = 0, threshold = 0.2 }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || isStill()) {
      el.dataset.shown = "";
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.shown = "";
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}
