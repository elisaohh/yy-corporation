import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { StoryBoard } from "@/components/story/StoryBoard";
import { sortedStoryPosts, storyIntro } from "@/data/story";

export const metadata: Metadata = { title: "Story" };

/** ABOUT › STORY (2026-10-16) — 회사 이야기 · 소식. 글은 data/story.ts */
export default function AboutStoryPage() {
  return (
    <>
      <PageIntro title={storyIntro.title} backdrop="a" intro={storyIntro.lead} />
      <StoryBoard posts={sortedStoryPosts()} />
    </>
  );
}
