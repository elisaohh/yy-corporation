import { siteConfig } from "@/config/site";

type PendingKind = "confirm" | "temporary" | "draft";

const labels: Record<PendingKind, string> = {
  confirm: "확인 필요",
  temporary: "임시",
  draft: "임시 초안",
};

interface PendingProps {
  kind?: PendingKind;
  /** 표시 문구를 바꿀 때 */
  label?: string;
  className?: string;
}

/**
 * 미확정 정보 표시. 실제 값이 없는 자리에 임의 값을 넣는 대신 이 표시를 쓴다.
 * siteConfig.showPlaceholderLabels가 false면 배지는 숨기고, 값이 비어 있는 "확인 필요" 자리만 대시(—)로 남긴다.
 */
export function Pending({ kind = "confirm", label, className = "" }: PendingProps) {
  if (!siteConfig.showPlaceholderLabels) {
    return kind === "confirm" && !label ? <span className={className}>—</span> : null;
  }
  const isTemp = kind !== "confirm";
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap border px-1.5 py-[3px] align-middle text-[11px] leading-none font-medium tracking-normal ${
        isTemp
          ? "border-point-1225 bg-point-1225 text-charcoal"
          : "border-dashed border-current opacity-70"
      } ${className}`}
    >
      {label ?? labels[kind]}
    </span>
  );
}
