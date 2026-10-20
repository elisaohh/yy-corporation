import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { StoryBoard } from "@/components/story/StoryBoard";
import { storyIntro } from "@/data/story";
import { listNewsletters } from "@/lib/newsletter";

export const metadata: Metadata = { title: "Story" };

/** ABOUT › STORY — 뉴스레터 YY NOTES 목록(content/story/*.html에서 자동 생성) */
export default async function AboutStoryPage() {
  return (
    <>
      <PageIntro title={storyIntro.title} backdrop="a" intro={storyIntro.lead} />
      <StoryBoard posts={await listNewsletters()} />
    </>
  );
}
