"use client";

import Link from "next/link";
import { useEffect, useRef, type RefObject } from "react";
import { Logo } from "@/components/brand/Logo";
import { Pending } from "@/components/ui/Pending";
import { company, companyStatus } from "@/data/company";
import { headerNav, isActivePath } from "@/data/navigation";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
  pathname: string;
}

/**
 * 모바일 메뉴 — 오른쪽에서 나오는 흰색 패널(82vw) + 배경 오버레이. 기획서 2.0 부록 C.
 * 닫기: 닫기 버튼 · 오버레이 · ESC · 메뉴 선택. 열려 있는 동안 포커스는 패널 안에서만 순환한다.
 */
export function MobileMenu({ open, onClose, returnFocusRef, pathname }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  // 포커스 이동 · 배경 스크롤 잠금
  useEffect(() => {
    const root = document.documentElement;
    if (open) {
      wasOpen.current = true;
      const prevOverflow = root.style.overflow;
      root.style.overflow = "hidden";
      const id = window.setTimeout(() => closeRef.current?.focus(), 50);
      return () => {
        window.clearTimeout(id);
        root.style.overflow = prevOverflow;
      };
    }
    if (wasOpen.current) {
      wasOpen.current = false;
      returnFocusRef.current?.focus();
    }
  }, [open, returnFocusRef]);

  // ESC · 포커스 가두기
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const contacts: { label: string; value: string | null }[] = [
    { label: "TEL", value: company.phone },
    { label: "E-MAIL", value: company.email },
  ];

  return (
    <div
      id="mobile-menu"
      className={`fixed inset-0 z-[60] md:hidden ${open ? "visible" : "invisible delay-300"}`}
      inert={!open}
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`absolute inset-0 bg-intro/45 transition-opacity duration-300 ease-[var(--ease-yy-out)] ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="메뉴"
        className={`absolute inset-y-0 right-0 flex w-[82vw] max-w-[440px] flex-col bg-paper text-charcoal transition-transform ease-[var(--ease-yy-out)] ${
          open ? "translate-x-0 duration-[400ms]" : "translate-x-full duration-300"
        }`}
        style={{
          paddingTop: "env(safe-area-inset-top, 0px)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div className="flex h-[var(--header-h)] items-center justify-between pl-7 pr-4">
          <Logo placement="mobileMenu" />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="메뉴 닫기"
            className="inline-flex size-11 items-center justify-center"
          >
            <span aria-hidden="true" className="relative block size-5">
              <span className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 rotate-45 bg-current" />
              <span className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 -rotate-45 bg-current" />
            </span>
          </button>
        </div>

        <nav aria-label="모바일 메뉴" className="flex-1 overflow-y-auto px-7 pt-8">
          <ul className="grid gap-4">
            {headerNav.map((item, index) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li
                  key={item.href}
                  className={`transition-[opacity,transform] duration-500 ease-[var(--ease-yy-out)] ${
                    open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                  style={{ transitionDelay: open ? `${120 + index * 40}ms` : "0ms" }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className="relative inline-flex min-h-11 flex-col pt-3"
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute left-0 top-0 size-1 rounded-full bg-current ${active ? "opacity-100" : "opacity-0"}`}
                    />
                    <span className="font-en text-[clamp(32px,9.5vw,40px)] leading-[1.05] font-light tracking-[0.01em]">
                      {item.label}
                    </span>
                    <span className="mt-1 text-[13px] text-ash">{item.description}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <dl className="grid gap-2 border-t border-stone px-7 py-6 text-[13px]">
          {contacts.map((row) => (
            <div key={row.label} className="flex items-center gap-4">
              <dt className="label-en w-14 text-[11px] text-ash">{row.label}</dt>
              <dd>{row.value ?? <Pending />}</dd>
            </div>
          ))}
          {companyStatus !== "confirmed" && (
            <div className="pt-1">
              <Pending label="기존 사이트 기준 · 최신 확인 필요" />
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
