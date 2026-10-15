/**
 * ABOUT › STORY (/about/story, 2026-10-16) — 뉴스레터 · 공지사항 게시판.
 * 실제 글이 생기면 storyPosts에 추가한다(최신 글이 위로 오도록 날짜순 정렬은 자동).
 * 지어낸 글 · 날짜 · 실적은 넣지 않는다 — 글이 없으면 빈 상태 안내가 보인다.
 *
 * 글 추가 예:
 * {
 *   slug: "2026-11-newsletter-01",          // 주소 /about/story/2026-11-newsletter-01 (영문 소문자 · 숫자 · -)
 *   category: "newsletter",                 // "newsletter" | "notice"
 *   title: "글 제목",
 *   date: "2026-11-02",                     // YYYY-MM-DD
 *   summary: "목록에 보이는 한두 줄 요약",
 *   body: ["첫 문단", "둘째 문단"],
 *   cover: "/assets/story/2026-11-newsletter-01.webp", // 선택 — 뉴스레터 대표 이미지
 * },
 */

export type StoryCategory = "newsletter" | "notice";

export interface StoryPost {
  slug: string;
  category: StoryCategory;
  title: string;
  /** YYYY-MM-DD */
  date: string;
  summary: string;
  /** 본문 문단 */
  body: string[];
  /** 대표 이미지(선택) */
  cover?: string;
}

export const storyCategories: { key: StoryCategory; en: string; ko: string }[] = [
  { key: "newsletter", en: "Newsletter", ko: "뉴스레터" },
  { key: "notice", en: "Notice", ko: "공지사항" },
];

export const storyIntro = {
  title: "Story",
  lead: "YY CORPORATION의 뉴스레터와 공지사항을 전합니다.",
};

export const storyPosts: StoryPost[] = [];

/** 최신 글이 위로 */
export function sortedStoryPosts(): StoryPost[] {
  return [...storyPosts].sort((a, b) => b.date.localeCompare(a.date));
}

export function categoryLabel(key: StoryCategory) {
  return storyCategories.find((c) => c.key === key) ?? storyCategories[0];
}

/** 2026-11-02 → 2026. 11. 02 */
export function formatStoryDate(date: string) {
  return date.replaceAll("-", ". ");
}
