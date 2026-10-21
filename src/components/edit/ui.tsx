"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";

/** 편집 창 — 오른쪽에서 열리는 패널(휴대폰은 전체 화면). Esc · 바깥 누르기로 닫힘 */
export function Drawer({
  title,
  onClose,
  children,
  footer,
  busy,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  busy?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const returnTo = document.activeElement as HTMLElement | null;
    dialog.showModal();
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      returnTo?.focus?.();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current && !busy) onClose();
      }}
      className="edit-drawer fixed inset-y-0 right-0 left-auto m-0 h-full max-h-none w-full max-w-none bg-paper p-0 text-charcoal shadow-[-12px_0_40px_rgb(0_0_0/0.12)] backdrop:bg-charcoal/40 sm:w-[min(560px,100vw)]"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-stone px-6 py-5 md:px-8">
          <h2 id={titleId} className="text-[20px] font-semibold tracking-[-0.02em]">
            {title}
          </h2>
          <button type="button" onClick={onClose} disabled={busy} aria-label="닫기" className="-mr-2 grid size-11 place-items-center rounded-full hover:bg-mist disabled:opacity-40">
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8">{children}</div>
        {footer && <div className="flex flex-wrap items-center gap-3 border-t border-stone bg-paper px-6 py-4 md:px-8">{footer}</div>}
      </div>
    </dialog>
  );
}

const inputClass =
  "w-full border border-stone bg-paper px-4 py-3 text-[15px] text-charcoal transition-[border-color] duration-200 hover:border-ash focus:border-charcoal focus:outline-2 focus:outline-offset-0 focus:outline-charcoal";

export function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: (props: { id: string; describedBy?: string; className: string }) => ReactNode;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-[14px] font-medium">
        {label}
        {required && <span className="ml-1.5 text-[12px] font-normal text-ash">필수</span>}
      </label>
      {children({ id, describedBy: hint || error ? hintId : undefined, className: `${inputClass} ${error ? "border-charcoal shadow-[inset_3px_0_0_var(--color-point-4008)]" : ""}` })}
      {(error || hint) && (
        <p id={hintId} className={`text-[13px] ${error ? "text-charcoal" : "text-ash"}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
}

/** 켜기 · 끄기 스위치 */
export function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-6 border-y border-stone py-4">
      <div>
        <label htmlFor={id} className="cursor-pointer text-[14px] font-medium">
          {label}
        </label>
        {hint && <p className="mt-1 text-[13px] text-ash">{hint}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ${checked ? "bg-charcoal" : "bg-stone"}`}
      >
        <span className={`absolute top-1 left-1 size-5 rounded-full bg-paper transition-transform duration-200 ${checked ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}

/** 안내 · 오류 상자 */
export function Notice({ tone = "info", children }: { tone?: "info" | "error"; children: ReactNode }) {
  return (
    <div
      role={tone === "error" ? "alert" : undefined}
      className={`px-5 py-4 text-[14px] leading-[1.7] ${tone === "error" ? "bg-mist shadow-[inset_3px_0_0_var(--color-point-4008)]" : "bg-mist shadow-[inset_3px_0_0_var(--color-charcoal)]"}`}
    >
      {children}
    </div>
  );
}

export function Spinner() {
  return <span className="spinner" aria-hidden="true" />;
}

/** 작은 텍스트 버튼(삭제 등) */
export const textButton = "min-h-11 px-1 text-[14px] text-ash underline underline-offset-4 hover:text-charcoal disabled:opacity-40";
/** 작은 네모 버튼(순서 위 · 아래, 사진 지우기) */
export const iconButton = "grid size-9 place-items-center border border-stone bg-paper text-charcoal hover:border-charcoal disabled:opacity-30 disabled:hover:border-stone";
