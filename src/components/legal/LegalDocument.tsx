import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import type { LegalArticle, LegalBlock } from "@/data/legal";

/** 글 속 웹 주소 · 이메일 · 전화번호를 링크로 */
function Linked({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s]+|[\w.+-]+@[\w-]+\.[\w.]+|\d{2,4}-\d{3,4}-\d{4})/g);
  return (
    <>
      {parts.map((part, i) => {
        if (/^https?:\/\//.test(part))
          return (
            <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-charcoal">
              {part}
            </a>
          );
        if (/@/.test(part))
          return (
            <a key={i} href={`mailto:${part}`} className="underline underline-offset-4 hover:text-charcoal">
              {part}
            </a>
          );
        if (/^\d{2,4}-\d{3,4}-\d{4}$/.test(part))
          return (
            <a key={i} href={`tel:${part}`} className="underline-offset-4 hover:underline">
              {part}
            </a>
          );
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

function Block({ b }: { b: LegalBlock }) {
  if ("p" in b) return <p><Linked text={b.p} /></p>;
  if ("h" in b) return <h3 className="mt-2 text-[16px] font-semibold text-charcoal">{b.h}</h3>;
  if ("ul" in b)
    return (
      <ul className="grid list-disc gap-1.5 pl-5 marker:text-ash">
        {b.ul.map((t) => (
          <li key={t}><Linked text={t} /></li>
        ))}
      </ul>
    );
  if ("ol" in b)
    return (
      <ol className="grid list-decimal gap-1.5 pl-5 marker:text-ash">
        {b.ol.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ol>
    );
  return (
    <div className="border-y border-stone py-4">
      {b.title && <p className="mb-3 text-[15px] font-semibold text-charcoal">{b.title}</p>}
      <dl className="grid gap-1.5 text-[15px]">
        {b.rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[96px_minmax(0,1fr)] gap-4">
            <dt className="text-ash">{k}</dt>
            <dd className="text-charcoal"><Linked text={v} /></dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

interface LegalDocumentProps {
  eyebrow: string;
  title: string;
  /** 머리말(없으면 생략) */
  intro?: string;
  articles: LegalArticle[];
  /** 맨 아래 — 시행일 · 부칙 */
  closing: ReactNode;
  /** 다른 문서로 가는 링크 */
  related?: { href: string; label: string };
}

/** 개인정보 처리방침 · 이용약관 공통 화면 — 머리말 → 조항 목차 → 조항 → 시행일 */
export function LegalDocument({ eyebrow, title, intro, articles, closing, related }: LegalDocumentProps) {
  return (
    <article data-header-theme="light" className="bg-paper pb-24 pt-[calc(var(--header-h)+56px)] md:pb-36 md:pt-[calc(var(--header-h)+88px)]">
      <div className="container-yy max-w-[860px]">
        <p className="font-en text-[12px] tracking-[0.18em] text-ash uppercase">{eyebrow}</p>
        <h1 className="mt-4 text-[clamp(28px,3.4vw,44px)] leading-[1.3] font-bold tracking-[-0.035em]">{title}</h1>
        {intro && <p className="mt-6 text-[16px] leading-[1.85] text-charcoal/85 [word-break:keep-all]">{intro}</p>}

        <nav aria-label="조항 목차" className="mt-10 border-y border-charcoal py-6">
          <ol className="grid gap-x-8 gap-y-2 text-[14px] sm:grid-cols-2">
            {articles.map((a) => (
              <li key={a.no}>
                <a href={`#article-${a.no}`} className="text-ash underline-offset-4 hover:text-charcoal hover:underline">
                  제{a.no}조 {a.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-4">
          {articles.map((a) => (
            <section key={a.no} id={`article-${a.no}`} aria-labelledby={`article-${a.no}-title`} className="scroll-mt-[calc(var(--header-h)+24px)] border-b border-stone py-10">
              <h2 id={`article-${a.no}-title`} className="text-[clamp(18px,1.6vw,21px)] font-bold tracking-[-0.02em]">
                제{a.no}조 ({a.title})
              </h2>
              <div className="mt-5 grid gap-3 text-[15px] leading-[1.85] text-charcoal/80 [word-break:keep-all]">
                {a.body.map((b, i) => (
                  <Block key={i} b={b} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 text-[15px]">{closing}</div>
        {related && (
          <Link href={related.href} className="link-en mt-10">
            {related.label} →
          </Link>
        )}
      </div>
    </article>
  );
}
