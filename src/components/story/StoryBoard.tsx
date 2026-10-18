"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatIssue, volLabel, type StoryPost } from "@/data/story";

/** 한 쪽에 보이는 카드 수 — 데스크톱 3열 × 3줄 */
const PER_PAGE = 9;

/**
 * STORY 목록 — 카드(대표 사진 · 호수 · 발행 시기 · 제목 · 요약), 최신 호가 앞.
 * 아래 페이지 번호(1 2 3 …)로 넘긴다. 현재 쪽은 주소 ?page=N 에 남아 뒤로 가기 · 공유 시 유지된다.
 */
export function StoryBoard({ posts }: { posts: StoryPost[] }) {
  const pages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  // 주소의 ?page=N 읽기 (뒤로 · 앞으로 가기 포함)
  useEffect(() => {
    const read = () => {
      const n = Number(new URLSearchParams(window.location.search).get("page"));
      setPage(Number.isInteger(n) && n >= 1 && n <= pages ? n : 1);
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, [pages]);

  const go = (n: number) => {
    if (n < 1 || n > pages || n === page) return;
    setPage(n);
    const url = new URL(window.location.href);
    if (n === 1) url.searchParams.delete("page");
    else url.searchParams.set("page", String(n));
    window.history.pushState(null, "", url);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const shown = posts.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  // 쪽이 많아지면 1 … 4 5 6 … 12 처럼 줄여 보여 준다
  const nums: (number | "gap")[] =
    pages <= 7
      ? Array.from({ length: pages }, (_, i) => i + 1)
      : [1, ...(page > 3 ? ["gap" as const] : []), ...[page - 1, page, page + 1].filter((n) => n > 1 && n < pages), ...(page < pages - 2 ? ["gap" as const] : []), pages];

  return (
    <section data-header-theme="light" aria-labelledby="story-list-title" className="bg-paper py-20 md:py-28">
      <div ref={topRef} className="container-yy scroll-mt-[calc(var(--header-h)+24px)]">
        <h2 id="story-list-title" className="sr-only">
          이야기 목록
        </h2>

        {posts.length === 0 ? (
          <div className="border-y border-stone py-24 text-center md:py-32">
            <p className="text-[18px] font-semibold tracking-[-0.02em]">아직 등록된 이야기가 없습니다.</p>
            <p className="mt-3 text-[16px] text-ash">새로운 소식은 이곳에서 전합니다.</p>
          </div>
        ) : (
          <>
            <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
              {shown.map((post) => (
                <li key={post.slug}>
                  <Link href={`/about/story/${post.slug}`} className="group block">
                    <span className="relative block aspect-[4/3] overflow-hidden bg-card">
                      {post.cover && (
                        <Image
                          src={post.cover.src}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                          className="object-cover transition-transform duration-700 ease-[var(--ease-yy-out)] group-hover:scale-[1.04]"
                        />
                      )}
                    </span>
                    <span className="mt-5 flex items-baseline gap-3 border-t border-charcoal pt-4 font-en text-[13px] tabular-nums">
                      <span className="font-semibold">YY NOTES {volLabel(post.vol)}</span>
                      <span className="text-ash">{formatIssue(post.issue)}</span>
                    </span>
                    <span className="mt-3 block text-[clamp(19px,1.6vw,22px)] leading-[1.4] font-bold tracking-[-0.025em] underline-offset-4 [word-break:keep-all] group-hover:underline">
                      {post.title}
                    </span>
                    <span className="mt-2 line-clamp-2 block text-[15px] leading-[1.7] text-charcoal/70 [word-break:keep-all]">{post.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* 페이지 번호 */}
            <nav aria-label="페이지" className="mt-20 flex items-center justify-center gap-1 border-t border-stone pt-10">
              <PageArrow dir={-1} disabled={page === 1} onClick={() => go(page - 1)} />
              {nums.map((n, k) =>
                n === "gap" ? (
                  <span key={`gap${k}`} aria-hidden="true" className="inline-flex size-11 items-center justify-center text-ash">
                    …
                  </span>
                ) : (
                <button
                  key={n}
                  type="button"
                  onClick={() => go(n)}
                  aria-current={n === page ? "page" : undefined}
                  aria-label={`${n}쪽`}
                  className={`inline-flex size-11 items-center justify-center rounded-full font-en text-[15px] tabular-nums transition-colors duration-200 ${
                    n === page ? "bg-charcoal text-paper" : "text-ash hover:bg-card hover:text-charcoal"
                  }`}
                >
                  {n}
                </button>
                ),
              )}
              <PageArrow dir={1} disabled={page === pages} onClick={() => go(page + 1)} />
            </nav>
          </>
        )}
      </div>
    </section>
  );
}

function PageArrow({ dir, disabled, onClick }: { dir: 1 | -1; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir < 0 ? "이전 쪽" : "다음 쪽"}
      className="inline-flex size-11 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-card disabled:pointer-events-none disabled:opacity-30"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className={`size-4 ${dir < 0 ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M9 6l6 6-6 6" />
      </svg>
    </button>
  );
}
