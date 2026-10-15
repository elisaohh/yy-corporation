"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { categoryLabel, formatStoryDate, storyCategories, type StoryCategory, type StoryPost } from "@/data/story";

type Filter = "all" | StoryCategory;

/**
 * STORY 게시판 — 분류(전체 · 뉴스레터 · 공지사항) + 날짜 · 분류 · 제목 · 요약 행 목록.
 * 글이 없으면 빈 상태 안내. 행 전체가 글 상세(/about/story/[slug]) 링크.
 */
export function StoryBoard({ posts }: { posts: StoryPost[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const shown = filter === "all" ? posts : posts.filter((p) => p.category === filter);
  const filters: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "전체", count: posts.length },
    ...storyCategories.map((c) => ({ key: c.key as Filter, label: c.ko, count: posts.filter((p) => p.category === c.key).length })),
  ];

  return (
    <section data-header-theme="light" aria-labelledby="story-list-title" className="bg-paper py-20 md:py-28">
      <div className="container-yy">
        <h2 id="story-list-title" className="sr-only">
          소식 목록
        </h2>

        <div role="group" aria-label="분류" className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f.key)}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-5 text-[15px] transition-colors duration-200 ${
                  active ? "border-charcoal bg-charcoal text-paper" : "border-stone text-charcoal hover:border-charcoal"
                }`}
              >
                {f.label}
                <span className={`font-en text-[12px] tabular-nums ${active ? "text-paper/70" : "text-ash"}`}>{f.count}</span>
              </button>
            );
          })}
        </div>

        {shown.length === 0 ? (
          <div className="mt-10 border-y border-stone py-24 text-center md:mt-14 md:py-32">
            <p className="text-[18px] font-semibold tracking-[-0.02em]">아직 등록된 소식이 없습니다.</p>
            <p className="mt-3 text-[16px] text-ash">새 뉴스레터와 공지사항은 이곳에서 안내합니다.</p>
          </div>
        ) : (
          <ul className="mt-10 border-t border-charcoal md:mt-14">
            {shown.map((post) => {
              const cat = categoryLabel(post.category);
              return (
                <li key={post.slug} className="border-b border-stone">
                  <Link
                    href={`/about/story/${post.slug}`}
                    className="group grid gap-3 py-8 md:grid-cols-[140px_120px_minmax(0,1fr)_auto] md:items-start md:gap-8 md:py-10"
                  >
                    <time dateTime={post.date} className="font-en text-[14px] tabular-nums text-ash md:pt-1">
                      {formatStoryDate(post.date)}
                    </time>
                    <span className="text-[14px] font-semibold md:pt-1">{cat.ko}</span>
                    <span className="min-w-0">
                      <span className="block text-[clamp(19px,1.7vw,24px)] leading-[1.4] font-bold tracking-[-0.025em] underline-offset-4 group-hover:underline">
                        {post.title}
                      </span>
                      <span className="mt-2 block max-w-[60ch] text-[16px] leading-[1.75] text-charcoal/70">{post.summary}</span>
                    </span>
                    {post.cover && (
                      <span className="relative hidden aspect-[4/3] w-40 overflow-hidden bg-card md:block">
                        <Image src={post.cover} alt="" fill sizes="160px" className="object-cover" />
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
