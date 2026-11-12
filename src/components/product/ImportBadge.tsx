/** 수입(중국) 제품 표시 — 제품 사진 오른쪽 위 */
export function ImportBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`pointer-events-none absolute right-3 top-3 z-[1] rounded-full bg-charcoal px-2.5 py-1 text-[11px] leading-none font-medium text-paper md:text-[12px] ${className}`}
    >
      수입
    </span>
  );
}
