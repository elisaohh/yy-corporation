import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsletterFrame } from "@/components/story/NewsletterFrame";
import { volLabel } from "@/data/story";
import { EditButton, EditToolbar } from "@/components/edit/EditContext";
import { listNewsletters, loadNewsletter } from "@/lib/newsletter";

/** STORY 상세 — 뉴스레터 원본 HTML을 종이 한 장처럼 그대로 보여 준다. content/story에 있는 호만 만든다 */
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await listNewsletters()).map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const n = await loadNewsletter(slug);
  return n ? { title: `${n.title} — YY LETTER ${volLabel(n.vol)}`, description: n.summary } : { title: "Story" };
}

export default async function StoryPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = await loadNewsletter(slug);
  if (!n) notFound();
  const list = await listNewsletters();
  const idx = list.findIndex((p) => p.slug === slug);
  const newer = list[idx - 1];
  const older = list[idx + 1];

  return (
    <article data-header-theme="light" className="bg-mist pb-24 pt-[calc(var(--header-h)+40px)] md:pb-32 md:pt-[calc(var(--header-h)+64px)]">
      <div className="container-yy">
        <div className="mx-auto max-w-[680px]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link href="/about/story" className="link-en">
              ← STORY
            </Link>
            <EditToolbar>
              <EditButton request={{ type: "story", vol: n.vol }}>이 뉴스레터 수정</EditButton>
            </EditToolbar>
          </div>
          <h1 className="sr-only">{n.title}</h1>
          {/* 메일 한 장을 종이처럼 — 원본 HTML 그대로(메일 하단 영역만 숨김) */}
          <div className="mt-8 bg-paper shadow-[0_30px_60px_-40px_rgba(43,43,42,0.35)]">
            <NewsletterFrame html={n.html} title={`YY LETTER ${volLabel(n.vol)} — ${n.title}`} />
          </div>

          <nav aria-label="다른 호" className="mt-12 grid gap-6 border-t border-stone pt-8 sm:grid-cols-2">
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
      </div>
    </article>
  );
}
