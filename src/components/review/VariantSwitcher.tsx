"use client";

import Link from "next/link";
import { useState } from "react";
import { variantOptions, type VariantKey } from "@/config/variants";

const LABEL: Record<VariantKey, string> = { hero: "① 히어로", intro: "② 회사 소개", slogan: "⑤ 슬로건" };

/** 시안 비교 패널 — 개발 서버에서만 보인다(배포 화면에는 없음). */
export function VariantSwitcher({ current }: { current: Record<VariantKey, string> }) {
  const [open, setOpen] = useState(false);
  if (process.env.NODE_ENV !== "development") return null;

  const href = (key: VariantKey, value: string) => {
    const next = { ...current, [key]: value };
    return `/?${new URLSearchParams(next).toString()}`;
  };

  return (
    <div className="fixed bottom-4 left-4 z-[60] w-[min(340px,calc(100vw-32px))] border border-charcoal/15 bg-paper/95 text-[12px] text-charcoal shadow-lg backdrop-blur">
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between px-3 py-2 font-semibold">
        시안 비교 <span className="text-ash">{open ? "접기" : "펼치기"}</span>
      </button>
      {open && (
        <div className="grid max-h-[60svh] gap-3 overflow-y-auto border-t border-stone px-3 py-3">
          {(Object.keys(variantOptions) as VariantKey[]).map((key) => (
            <div key={key}>
              <p className="mb-1 text-ash">{LABEL[key]}</p>
              <div className="grid gap-1">
                {Object.entries(variantOptions[key].options).map(([value, desc]) => (
                  <Link
                    key={value}
                    href={href(key, value)}
                    scroll={false}
                    className={`block px-2 py-1 leading-snug ${current[key] === value ? "bg-charcoal text-paper" : "hover:bg-mist"}`}
                  >
                    <b className="mr-1 uppercase">{value}</b> {desc}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
