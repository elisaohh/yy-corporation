import type { ReactNode } from "react";

/**
 * 페이지 전환 — 이동할 때마다 다시 마운트되어 0.4초 페이드인 (기획서 2.0 §3.2).
 * 모션 줄이기 설정에서는 globals.css 규칙에 따라 즉시 표시된다.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
