/**
 * 뉴스레터 HTML 읽기 규칙 — 서버(목록 · 상세)와 편집 화면 미리보기가 같은 규칙을 쓴다.
 */

export interface NewsletterMeta {
  title: string;
  /** 발행 시기 — 예: "2026.10" */
  issue: string;
  summary: string;
  hasImage: boolean;
}

/** 제목(<title>에서 "(광고)" · "| …" 제외), 요약(메일 미리보기 문구), 발행 시기(머리의 "Vol.NN · 2026.10"), 사진 유무 */
export function parseNewsletter(html: string, vol: number): NewsletterMeta {
  const rawTitle = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "";
  const title = rawTitle.replace(/^\(광고\)\s*/, "").replace(/\s*\|.*$/, "").trim() || `YY LETTER Vol.${vol}`;
  const summary = (html.match(/<div style="display:none;[^"]*">([\s\S]*?)<\/div>/i)?.[1] ?? "").replace(/&[#\w]+;/g, "").trim();
  const issue = html.match(/Vol\.\d+[\s\S]{0,40}?(\d{4}\.\d{1,2})/)?.[1] ?? "";
  return { title, issue, summary, hasImage: /<img src="data:image\//i.test(html) };
}

/** 사이트에 보일 HTML — 메일 하단(회사 정보 · 로고 · 홈페이지 · 수신거부 · 맺음말)을 지우고, 링크는 사이트 창에서 열리게 */
export function cleanNewsletter(html: string): string {
  return html
    .replace(
      /<tr><td style="height:\d+px;line-height:\d+px;font-size:0;">&nbsp;<\/td><\/tr><tr><td class="px" style="padding:0 24px 40px;">[\s\S]*?(?=<\/table><\/td><\/tr><\/table>\s*<\/body>)/,
      '<tr><td style="height:40px;line-height:40px;font-size:0;">&nbsp;</td></tr>',
    )
    .replace(/<head>/i, '<head><base target="_top">');
}

/** 메일 하단을 찾아 지울 수 있는 틀인지 — 편집 화면 안내용 */
export function footerFound(html: string): boolean {
  return cleanNewsletter(html).length !== html.replace(/<head>/i, '<head><base target="_top">').length;
}
