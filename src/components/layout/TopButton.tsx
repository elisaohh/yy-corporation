"use client";

import { useEffect, useState } from "react";

/**
 * TOP 버튼 — 기획서 2.0 부록 C.
 * 화면 높이의 2배 이상 내려가면 나타나고, data-no-top 구역(HOME 인트로·CTA 등) 위에서는 숨긴다.
 */
export function TopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const check = () => {
      ticking = false;
      const far = window.scrollY > window.innerHeight * 2;
      const probe = document.elementFromPoint(window.innerWidth - 40, window.innerHeight - 40);
      const blocked = Boolean(probe?.closest("[data-no-top]"));
      setVisible(far && !blocked);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(check);
      }
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    document.getElementById("main")?.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="맨 위로 이동"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`label-en fixed right-5 z-40 inline-flex size-12 items-center justify-center rounded-full border border-stone bg-paper/95 text-[11px] text-charcoal backdrop-blur-sm transition-[opacity,transform] duration-300 ease-[var(--ease-yy-out)] hover:border-charcoal md:right-8 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
      style={{ bottom: "calc(20px + env(safe-area-inset-bottom, 0px))" }}
    >
      TOP
    </button>
  );
}
