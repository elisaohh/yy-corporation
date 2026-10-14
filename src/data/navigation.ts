export interface NavItem {
  label: string;
  href: string;
  /** 모바일 메뉴 보조 설명 (국문) */
  description: string;
}

/** 헤더·모바일 메뉴·푸터가 함께 쓰는 메뉴. 기획서 2.0 §3.1 */
export const mainNav: NavItem[] = [
  { label: "HOME", href: "/", description: "홈" },
  { label: "ABOUT", href: "/about", description: "회사 소개" },
  { label: "PRODUCT", href: "/products", description: "제품" },
  { label: "PROCESS", href: "/process", description: "후가공 공정" },
  { label: "CONTACT", href: "/contact", description: "문의" },
];

/** 헤더 · 모바일 메뉴 — HOME은 로고로 이동하므로 뺀다(2026-10-15 사용자 요청). 푸터는 mainNav 전체 */
export const headerNav: NavItem[] = mainNav.filter((item) => item.href !== "/");

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
