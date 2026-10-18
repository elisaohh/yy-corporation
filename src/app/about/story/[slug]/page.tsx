import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatIssue, sortedStoryPosts, storyPosts, volLabel, type StoryBlock } from "@/data/story";

/** STORY 글 상세 — data/story.ts의 글만 미리 만든다(목록에 없는 주소는 404) */
export const dynamicParams = false;

export function generateStaticParams() {
  return storyPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = storyPosts.find((p) => p.slug === slug);
  return { title: post ? `${post.title} — YY NOTES ${volLabel(post.vol)}` : "Story", description: post?.summary };
}

/** 본문 블록 — 뉴스레터 디자인(가는 선 · 작은 영문 라벨 · 큰 한글 제목)을 사이트 서체 · 색으로 */
function Block({ b }: { b: StoryBlock }) {
  switch (b.type) {
    case "p":
      return <p className="text-[17px] leading-[1.9] tracking-[-0.01em] text-charcoal/90 [word-break:keep-all]">{b.text}</p>;
    case "note":
      return <p className="text-[14px] leading-[1.7] text-ash [word-break:keep-all]">{b.text}</p>;
    case "image":
      // 원본보다 크게 늘리지 않는다
      return (
        <figure className="m-0" style={{ maxWidth: b.width }}>
          <Image src={b.src} alt={b.alt} width={b.width} height={b.height} sizes={`(min-width: 860px) ${Math.min(b.width, 760)}px, 100vw`} className="h-auto w-full bg-card" />
        </figure>
      );
    case "heading":
      return (
        <div className="mt-10 border-t border-charcoal pt-8 md:mt-14">
          <p className="font-en text-[12px] tracking-[0.18em] text-ash uppercase">{b.label}</p>
          <p className="mt-3 text-[15px] text-ash">{b.kicker}</p>
          <h2 className="mt-2 text-[clamp(24px,2.6vw,34px)] leading-[1.35] font-bold tracking-[-0.035em] [word-break:keep-all]">{b.title}</h2>
        </div>
      );
    case "spec":
      return (
        <div>
          <p className="font-en text-[12px] tracking-[0.18em] text-ash uppercase">{b.label}</p>
          <dl className="mt-3 grid border-y border-t-charcoal border-b-stone py-3 sm:grid-flow-col sm:grid-cols-2 sm:gap-x-8" style={{ gridTemplateRows: `repeat(${Math.ceil(b.rows.length / 2)}, auto)` }}>
            {b.rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[88px_minmax(0,1fr)] gap-3 py-1.5 text-[15px]">
                <dt className="text-ash">{k}</dt>
                <dd className="text-charcoal">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      );
    case "rows":
      return (
        <dl className="border-b border-stone">
          {b.rows.map((r) => (
            <div key={r.term} className="grid grid-cols-[88px_minmax(0,1fr)] items-baseline gap-4 border-t border-stone py-3.5 sm:grid-cols-[110px_minmax(0,1fr)_auto]">
              <dt className={b.termStyle === "serif" ? "font-en text-[22px] leading-none font-light tracking-[-0.01em]" : "text-[15px] font-bold"}>{r.term}</dt>
              <dd className="text-[15px] leading-[1.7] text-charcoal/85 [word-break:keep-all]">{r.text}</dd>
              {r.aside && <dd className="col-start-2 text-[13px] text-ash sm:col-start-auto sm:text-right">{r.aside}</dd>}
            </div>
          ))}
        </dl>
      );
    case "cta":
      return (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <a href={b.primary.href} className="btn btn-secondary">
            {b.primary.label}
          </a>
          {b.secondary && (
            <a href={b.secondary.href} className="inline-flex min-h-11 items-center text-[15px] text-ash underline underline-offset-4 hover:text-charcoal">
              {b.secondary.label}
            </a>
          )}
        </div>
      );
    case "columns":
      return (
        <div className="grid gap-12 md:grid-cols-2 md:gap-8">
          {b.columns.map((col, i) => (
            <div key={i} className="grid content-start gap-5">
              {col.map((c, k) => (
                <Block key={k} b={c} />
              ))}
            </div>
          ))}
        </div>
      );
  }
}

export default async function StoryPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = storyPosts.find((p) => p.slug === slug);
  if (!post) notFound();
  // 이전 · 다음 호
  const list = sortedStoryPosts();
  const idx = list.findIndex((p) => p.slug === post.slug);
  const newer = list[idx - 1];
  const older = list[idx + 1];

  return (
    <article data-header-theme="light" className="bg-paper pb-24 pt-[calc(var(--header-h)+56px)] md:pb-36 md:pt-[calc(var(--header-h)+88px)]">
      <div className="container-yy max-w-[820px]">
        <Link href="/about/story" className="link-en">
          ← STORY
        </Link>

        {/* 뉴스레터 머리 — YY NOTES · 호수 · 발행 시기 */}
        <header className="mt-10 border-b border-charcoal pb-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-en text-[clamp(22px,2.2vw,28px)] leading-none font-medium tracking-[-0.02em]">YY NOTES</p>
              <p className="mt-2 font-en text-[10px] tracking-[0.32em] text-ash">EVERY BOTTLE HAS A STORY</p>
            </div>
            <p className="font-en text-[14px] tabular-nums">
              {volLabel(post.vol)} <span className="text-ash">· {formatIssue(post.issue)}</span>
            </p>
          </div>
          <h1 className="mt-10 text-[clamp(28px,3.4vw,44px)] leading-[1.3] font-bold tracking-[-0.035em] [word-break:keep-all]">{post.title}</h1>
          <p className="mt-3 text-[17px] text-ash [word-break:keep-all]">{post.summary}</p>
        </header>

        <div className="mt-10 grid gap-6 md:mt-12">
          {post.blocks.map((b, i) => (
            <Block key={i} b={b} />
          ))}
        </div>

        <nav aria-label="다른 호" className="mt-20 grid gap-4 border-t border-stone pt-8 sm:grid-cols-2">
          {older ? (
            <Link href={`/about/story/${older.slug}`} className="group">
              <span className="font-en text-[12px] tracking-[0.14em] text-ash">← {volLabel(older.vol)}</span>
              <span className="mt-1 block text-[16px] font-bold underline-offset-4 group-hover:underline">{older.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {newer && (
            <Link href={`/about/story/${newer.slug}`} className="group sm:text-right">
              <span className="font-en text-[12px] tracking-[0.14em] text-ash">{volLabel(newer.vol)} →</span>
              <span className="mt-1 block text-[16px] font-bold underline-offset-4 group-hover:underline">{newer.title}</span>
            </Link>
          )}
        </nav>
      </div>
    </article>
  );
}
