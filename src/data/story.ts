/**
 * ABOUT › STORY (/about/story) — 뉴스레터 YY NOTES.
 * 글은 content/story/vol-NN.json + files/*.html(메일 원본 HTML)을 그대로 쓴다 — 읽기 · 정리는 lib/newsletter.ts, 올리기는 사이트 위 편집.
 * 새 호: 받은 HTML 파일을 content/story/vol-03.html처럼 번호 이름으로 넣고 배포하면 끝.
 */

export const storyIntro = {
  title: "Story",
  lead: "YY CORPORATION의 이야기를 전합니다.",
};

/** "2026.10" → "2026. 10" */
export function formatIssue(issue: string) {
  return issue.replaceAll(".", ". ");
}

export const volLabel = (vol: number) => `Vol.${String(vol).padStart(2, "0")}`;
