import Image from "next/image";
import Link from "next/link";
import { formatIssue, volLabel, type StoryPost } from "@/data/story";

/**
 * STORY 목록 — 최신 호가 위인 행 목록(호수 · 발행 시기 · 제목 · 요약, 대표 이미지는 있을 때만).
 * 글이 없으면 빈 상태 안내. 행 전체가 글 상세(/about/story/[slug]) 링크.
 */
export function StoryBoard({ posts }: { posts: StoryPost[] }) {
  return (
    <section data-header-theme="light" aria-labelledby="story-list-title" className="bg-paper py-20 md:py-28">
      <div className="container-yy">
        <h2 id="story-list-title" className="sr-only">
          이야기 목록
        </h2>

        {posts.length === 0 ? (
          <div className="border-y border-stone py-24 text-center md:py-32">
            <p className="text-[18px] font-semibold tracking-[-0.02em]">아직 등록된 이야기가 없습니다.</p>
            <p className="mt-3 text-[16px] text-ash">새로운 소식은 이곳에서 전합니다.</p>
          </div>
        ) : (
          <ul className="border-t border-charcoal">
            {posts.map((post) => (
              <li key={post.slug} className="border-b border-stone">
                <Link
                  href={`/about/story/${post.slug}`}
                  className="group grid gap-3 py-8 md:grid-cols-[160px_minmax(0,1fr)_auto] md:items-start md:gap-8 md:py-10"
                >
                  <span className="flex items-baseline gap-3 font-en text-[14px] tabular-nums md:block md:pt-1">
                    <span className="font-semibold text-charcoal">{volLabel(post.vol)}</span>
                    <span className="text-ash md:mt-1 md:block">{formatIssue(post.issue)}</span>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[clamp(19px,1.7vw,24px)] leading-[1.4] font-bold tracking-[-0.025em] underline-offset-4 group-hover:underline">
                      {post.title}
                    </span>
                    <span className="mt-2 block max-w-[60ch] text-[16px] leading-[1.75] text-charcoal/70">{post.summary}</span>
                  </span>
                  {post.cover && (
                    <span className="relative hidden aspect-[4/3] w-44 overflow-hidden bg-card md:block">
                      <Image src={post.cover.src} alt="" fill sizes="176px" className="object-cover transition-transform duration-700 ease-[var(--ease-yy-out)] group-hover:scale-[1.03]" />
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
