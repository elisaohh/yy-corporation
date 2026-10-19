/** 개인정보 처리방침 · 이용약관 공통 구조 — p 문단 · h 번호 소제목 · ul 점 목록 · ol 번호 목록 · rows 연락처 표 */
export type LegalBlock =
  | { p: string }
  | { h: string }
  | { ul: string[] }
  | { ol: string[] }
  | { rows: [string, string][]; title?: string };

export interface LegalArticle {
  no: number;
  title: string;
  body: LegalBlock[];
}
