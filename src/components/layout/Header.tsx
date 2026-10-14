"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { isActivePath, mainNav } from "@/data/navigation";

type HeaderTheme = "light" | "dark";

/** 이 거리(px)보다 많이 내려가야 헤더가 숨겨진다 */
const HIDE_AFTER = 120;
/** 작은 흔들림은 무시 */
const SCROLL_DELTA = 6;

/**
 * 공통 헤더 — 기획서 2.0 §3.1, 부록 C.
 * - 바탕은 항상 투명. 헤더 아래 구역의 data-header-theme(dark/light)에 따라 글자색만 전환.
 * - 아래로 스크롤하면 숨김, 위로 스크롤하면 재등장.
 * - 현재 페이지는 메뉴 글자 위 4px 점(헤더 글자색과 같은 색).
 */
export function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<HeaderTheme>("light");
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const lastY = useRef(0);
  const ticking = useRef(false);

  const detectTheme = useCallback(() => {
    const header = headerRef.current;
    const probeY = header ? header.offsetHeight / 2 : 38;
    const sections = document.querySelectorAll<HTMLElement>("[data-header-theme]");
    let next: HeaderTheme = "light";
    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= probeY && rect.bottom > probeY) {
        next = section.dataset.headerTheme === "dark" ? "dark" : "light";
      }
    }
    setTheme(next);
  }, []);

  const update = useCallback(() => {
    ticking.current = false;
    const y = window.scrollY;
    const delta = y - lastY.current;
    const focusInside = headerRef.current?.contains(document.activeElement) ?? false;

    if (y < HIDE_AFTER || focusInside) {
      setHidden(false);
    } else if (delta > SCROLL_DELTA) {
      setHidden(true);
    } else if (delta < -SCROLL_DELTA) {
      setHidden(false);
    }
    if (Math.abs(delta) > SCROLL_DELTA || y < HIDE_AFTER) lastY.current = y;
    detectTheme();
  }, [detectTheme]);

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };
    lastY.current = window.scrollY;
    detectTheme();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [update, detectTheme]);

  // 페이지 이동 시: 메뉴 닫기, 헤더 보이기, 새 페이지 기준으로 색 다시 판단
  useEffect(() => {
    setMenuOpen(false);
    setHidden(false);
    const id = requestAnimationFrame(detectTheme);
    return () => cancelAnimationFrame(id);
  }, [pathname, detectTheme]);

  const isDark = theme === "dark" && !menuOpen;
  const isHidden = hidden && !menuOpen;

  return (
    <>
      <header
        ref={headerRef}
        data-header-state={isDark ? "dark" : "light"}
        onFocusCapture={() => setHidden(false)}
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,color] duration-300 ease-[var(--ease-yy-out)] ${
          isDark ? "text-on-dark" : "text-charcoal"
        } ${isHidden ? "-translate-y-full" : "translate-y-0"}`}
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="container-yy flex h-[var(--header-h)] items-center justify-between">
          <Link href="/" aria-label="YY CORPORATION 홈" className="-m-2 inline-flex p-2">
            <Logo placement="headerDesktop" decorative priority className="h-7 w-auto md:h-[34px]" />
          </Link>

          <nav aria-label="주요 메뉴" className="hidden md:block">
            <ul className="flex items-center gap-8 lg:gap-10">
              {mainNav.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`label-en relative inline-flex min-h-11 items-center pt-2.5 before:absolute before:left-1/2 before:top-[9px] before:size-1 before:-translate-x-1/2 before:rounded-full before:bg-current before:transition-opacity before:duration-200 ${
                        active ? "before:opacity-100" : "before:opacity-0 hover:before:opacity-40"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            ref={menuButtonRef}
            type="button"
            className="-mr-2.5 inline-flex size-11 items-center justify-center md:hidden"
            aria-label="메뉴 열기"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            <span aria-hidden="true" className="relative block h-[9px] w-6">
              <span className="absolute inset-x-0 top-0 h-[1.5px] bg-current" />
              <span className="absolute inset-x-0 bottom-0 h-[1.5px] bg-current" />
            </span>
          </button>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        returnFocusRef={menuButtonRef}
        pathname={pathname}
      />
    </>
  );
}
