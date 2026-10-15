import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatStoryDate, storyPosts } from "@/data/story";

/** STORY 글 상세 — data/story.ts의 글만 미리 만든다(목록에 없는 주소는 404) */
export const dynamicParams = false;

export function generateStaticParams() {
  return storyPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = storyPosts.find((p) => p.slug === slug);
  return { title: post ? post.title : "Story" };
}

export default async function StoryPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = storyPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <article data-header-theme="light" className="bg-paper pb-24 pt-[calc(var(--header-h)+56px)] md:pb-36 md:pt-[calc(var(--header-h)+88px)]">
      <div className="container-yy max-w-[820px]">
        <Link href="/about/story" className="link-en">
          ← STORY
        </Link>
        <time dateTime={post.date} className="mt-10 block font-en text-[14px] tabular-nums text-ash">
          {formatStoryDate(post.date)}
        </time>
        <h1 className="mt-4 text-[clamp(28px,3.4vw,46px)] leading-[1.3] font-bold tracking-[-0.035em]">{post.title}</h1>

        {post.cover && (
          <div className="relative mt-12 aspect-[3/2] overflow-hidden bg-card">
            <Image src={post.cover} alt="" fill sizes="(min-width: 860px) 820px, 100vw" className="object-cover" priority />
          </div>
        )}

        <div className="mt-12 grid gap-6 border-t border-stone pt-12">
          {post.body.map((para, i) => (
            <p key={i} className="text-[17px] leading-[1.9] text-charcoal/85">
              {para}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}
