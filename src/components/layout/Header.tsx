"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { HEADER_THEME_EVENT } from "@/components/layout/headerEvents";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { headerNav, isActivePath } from "@/data/navigation";

type HeaderTheme = "light" | "dark";

/** 이 거리(px)보다 많이 내려가야 헤더가 숨겨진다 */
const HIDE_AFTER = 120;
/** 작은 흔들림은 무시 */
const SCROLL_DELTA = 6;

/**
 * 공통 헤더 — 기획서 2.0 §3.1, 부록 C.
 * - 바탕은 옅은 반투명 + 블러(2026-10-14 결정, 기획서의 '투명 헤더'에서 변경).
 *   헤더 아래 구역의 data-header-theme(dark/light)에 따라 바탕 톤과 글자색을 함께 전환.
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
    window.addEventListener(HEADER_THEME_EVENT, detectTheme);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener(HEADER_THEME_EVENT, detectTheme);
    };
  }, [update, detectTheme]);

  // 페이지 이동 시: 메뉴 닫기, 헤더 보이기, 새 페이지 기준으로 색 다시 판단
  useEffect(() => {
    setMenuOpen(false);
    setHidden(false);
    // 하위 메뉴에서 이동한 뒤 포커스가 남아 드롭다운이 계속 펼쳐져 있지 않도록
    const focused = document.activeElement;
    if (focused instanceof HTMLElement && headerRef.current?.contains(focused)) focused.blur();
    const id = requestAnimationFrame(detectTheme);
    return () => cancelAnimationFrame(id);
  }, [pathname, detectTheme]);

  const isDark = theme === "dark" && !menuOpen;
  const isHidden = hidden && !menuOpen;

  // 헤더 아래에 붙는 고정 요소(PROCESS 탭 등)가 헤더와 함께 올라가도록 html 데이터 속성으로 알린다
  useEffect(() => {
    document.documentElement.toggleAttribute("data-header-hidden", isHidden);
  }, [isHidden]);

  return (
    <>
      <header
        ref={headerRef}
        data-header-state={isDark ? "dark" : "light"}
        onFocusCapture={() => setHidden(false)}
        className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md backdrop-saturate-150 transition-[transform,color,background-color,border-color] duration-300 ease-[var(--ease-yy-out)] ${
          isDark
            ? "border-on-dark/10 bg-intro/70 text-on-dark"
            : "border-stone/70 bg-paper/80 text-charcoal"
        } ${isHidden ? "-translate-y-full" : "translate-y-0"}`}
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="container-yy flex h-[var(--header-h)] items-center justify-between">
          <Link href="/" aria-label="YY CORPORATION 홈" className="-m-2 inline-flex p-2">
            <Logo placement="headerDesktop" decorative priority className="h-[22px] w-auto md:h-[26px]" />
          </Link>

          <nav aria-label="주요 메뉴" className="hidden md:block">
            <ul className="flex items-center gap-8 lg:gap-10">
              {headerNav.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href} className={item.children ? "group relative" : undefined}>
                    <Link
                      href={item.href}
                      aria-current={active && !item.children ? "page" : undefined}
                      className={`label-en relative inline-flex min-h-11 items-center pt-2.5 before:absolute before:left-1/2 before:top-[9px] before:size-1 before:-translate-x-1/2 before:rounded-full before:bg-current before:transition-opacity before:duration-200 ${
                        active ? "before:opacity-100" : "before:opacity-0 hover:before:opacity-40"
                      }`}
                    >
                      {item.label}
                    </Link>
                    {/* 하위 메뉴 — 마우스를 올리거나 키보드로 포커스가 들어오면 펼쳐진다(2026-10-16 ABOUT › COMPANY · STORY) */}
                    {item.children && (
                      <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-3 opacity-0 transition-[opacity,visibility] duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                        <ul
                          aria-label={`${item.label} 하위 메뉴`}
                          className={`min-w-[150px] border py-2 shadow-[0_18px_40px_-24px_rgba(43,43,42,0.35)] ${
                            isDark ? "border-on-dark/10 bg-intro text-on-dark" : "border-stone bg-paper text-charcoal"
                          }`}
                        >
                          {item.children.map((child) => {
                            const childActive = isActivePath(pathname, child.href);
                            return (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  aria-current={childActive ? "page" : undefined}
                                  className={`label-en flex min-h-11 items-center justify-between gap-4 px-5 transition-colors duration-200 ${
                                    isDark ? "hover:bg-on-dark/10" : "hover:bg-card"
                                  } ${childActive ? "" : "opacity-70 hover:opacity-100"}`}
                                >
                                  {child.label}
                                  {childActive && <span aria-hidden="true" className="size-1 rounded-full bg-current" />}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
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
