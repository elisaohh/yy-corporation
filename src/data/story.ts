/**
 * ABOUT › STORY (/about/story, 2026-10-16) — 회사 이야기 · 소식 게시판(분류 없이 최신 글 순 목록).
 * 실제 글이 생기면 storyPosts에 추가한다(최신 글이 위로 오도록 날짜순 정렬은 자동).
 * 지어낸 글 · 날짜 · 실적은 넣지 않는다 — 글이 없으면 빈 상태 안내가 보인다.
 *
 * 글 추가 예:
 * {
 *   slug: "2026-11-story-01",          // 주소 /about/story/2026-11-story-01 (영문 소문자 · 숫자 · -)
 *   title: "글 제목",
 *   date: "2026-11-02",                     // YYYY-MM-DD
 *   summary: "목록에 보이는 한두 줄 요약",
 *   body: ["첫 문단", "둘째 문단"],
 *   cover: "/assets/story/2026-11-story-01.webp", // 선택 — 대표 이미지
 * },
 */

export interface StoryPost {
  slug: string;
  title: string;
  /** YYYY-MM-DD */
  date: string;
  summary: string;
  /** 본문 문단 */
  body: string[];
  /** 대표 이미지(선택) */
  cover?: string;
}

export const storyIntro = {
  title: "Story",
  lead: "YY CORPORATION의 이야기를 전합니다.",
};

export const storyPosts: StoryPost[] = [];

/** 최신 글이 위로 */
export function sortedStoryPosts(): StoryPost[] {
  return [...storyPosts].sort((a, b) => b.date.localeCompare(a.date));
}

/** 2026-11-02 → 2026. 11. 02 */
export function formatStoryDate(date: string) {
  return date.replaceAll("-", ". ");
}
