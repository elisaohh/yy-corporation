"use client";

import { useEffect, useRef, useState } from "react";
import type { FaqBlock, FaqGroup } from "@/data/faq";

/**
 * FAQ 목록 — PC: 왼쪽 주제 목록(따라옴 · 지금 보는 주제만 진하게) + 오른쪽 질문 / 휴대폰: 위에 주제 버튼 + 질문.
 * 질문은 01~25(번호 · 질문 · 둥근 +버튼). 마우스를 올리면 번호 · 질문이 진해지고 +버튼이 차콜로 채워진다. 질문을 누르면 답이 펼쳐진다(한 번에 하나, 첫 질문은 처음부터 펼침).
 */
export function FaqList({ groups }: { groups: FaqGroup[] }) {
  const first = groups[0] ? `${groups[0].key}-0` : null;
  const [open, setOpen] = useState<string | null>(first);
  const [active, setActive] = useState(groups[0]?.key ?? "");
  const rootRef = useRef<HTMLDivElement>(null);

  // 지금 화면 위쪽에 걸친 주제를 버튼에 표시
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const sections = Array.from(root.querySelectorAll<HTMLElement>("[data-faq-group]"));
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive((hit.target as HTMLElement).dataset.faqGroup ?? "");
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // 전체 번호(01~25)
  let n = 0;

  return (
    <div ref={rootRef} className="pb-24 md:pb-36">
      <div className="container-yy grid gap-10 lg:grid-cols-12 lg:gap-8">
      {/* 주제 — PC: 왼쪽 세로 목록(화면을 따라오고, 지금 보는 주제만 진하게) / 휴대폰: 위에 둥근 버튼 */}
      <nav aria-label="FAQ 주제" className="lg:col-span-3">
        <ul className="flex flex-wrap gap-2 lg:sticky lg:top-[calc(var(--header-offset)+40px)] lg:block lg:transition-[top] lg:duration-300">
          {groups.map((g) => {
            const on = active === g.key;
            return (
              <li key={g.key} className="lg:border-b lg:border-stone">
                <a
                  href={`#faq-${g.key}`}
                  aria-current={on ? "true" : undefined}
                  className={`relative inline-flex items-baseline gap-2.5 rounded-full border px-4 py-2 transition-colors lg:flex lg:rounded-none lg:border-0 lg:px-0 lg:py-3.5 ${on ? "border-charcoal text-charcoal" : "border-stone text-ash hover:border-charcoal hover:text-charcoal"}`}
                >
                  <span className="font-en text-[13px] font-bold tracking-[0.1em]">{g.en}</span>
                  <span className="text-[13px]">{g.ko}</span>
                  <span className="ml-auto hidden font-en text-[12px] tabular-nums lg:inline">{g.items.length}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 질문 · 답 */}
      <div className="lg:col-span-9">
        {groups.map((g) => (
          <section
            key={g.key}
            id={`faq-${g.key}`}
            data-faq-group={g.key}
            aria-labelledby={`faq-${g.key}-title`}
            className="scroll-mt-[calc(var(--header-h)+40px)] [&+&]:mt-20 md:[&+&]:mt-28"
          >
            <h2 id={`faq-${g.key}-title`} className="flex items-baseline gap-3 border-b border-charcoal pb-4">
              <span className="font-en text-[clamp(22px,2vw,28px)] leading-none font-extrabold tracking-[-0.03em]">{g.en}</span>
              <span className="text-[14px] text-ash">{g.ko}</span>
            </h2>
            <ul>
              {g.items.map((item, i) => {
                n += 1;
                const id = `${g.key}-${i}`;
                const isOpen = open === id;
                return (
                  <li key={id} className="border-b border-stone">
                    <h3>
                      <button
                        type="button"
                        id={`faq-q-${id}`}
                        aria-expanded={isOpen}
                        aria-controls={`faq-a-${id}`}
                        onClick={() => setOpen(isOpen ? null : id)}
                        className="group flex w-full cursor-pointer items-start gap-4 py-6 text-left md:gap-6 md:py-7"
                      >
                        <span aria-hidden="true" className={`w-7 shrink-0 pt-1 font-en text-[13px] tabular-nums transition-colors md:w-8 md:text-[14px] ${isOpen ? "text-charcoal" : "text-ash group-hover:text-charcoal"}`}>
                          {String(n).padStart(2, "0")}
                        </span>
                        <span
                          className={`min-w-0 flex-1 text-[17px] leading-[1.5] font-semibold tracking-[-0.02em] transition-colors md:text-[20px] ${isOpen ? "text-charcoal" : "text-charcoal/85 group-hover:text-charcoal"}`}
                        >
                          {item.q}
                        </span>
                        {/* 둥근 버튼 속 더하기 → 곱하기(닫기). 마우스를 올리면 차콜로 채워진다 */}
                        <span
                          aria-hidden="true"
                          className={`grid size-8 shrink-0 place-items-center rounded-full border transition-colors duration-200 md:size-9 ${isOpen ? "border-charcoal bg-charcoal" : "border-stone group-hover:border-charcoal group-hover:bg-charcoal"}`}
                        >
                          <span className={`relative size-3 transition-transform duration-300 motion-reduce:transition-none ${isOpen ? "rotate-45" : ""}`}>
                            <span className={`absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 transition-colors ${isOpen ? "bg-paper" : "bg-charcoal group-hover:bg-paper"}`} />
                            <span className={`absolute inset-y-0 left-1/2 w-[1.5px] -translate-x-1/2 transition-colors ${isOpen ? "bg-paper" : "bg-charcoal group-hover:bg-paper"}`} />
                          </span>
                        </span>
                      </button>
                    </h3>
                    {/* 펼침: 높이 0 → 내용 높이 */}
                    <div
                      id={`faq-a-${id}`}
                      role="region"
                      aria-labelledby={`faq-q-${id}`}
                      inert={!isOpen}
                      className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <div className="pb-8 pl-11 pr-2 text-[15px] leading-[1.85] text-ash md:pb-10 md:pl-14 md:pr-10 md:text-[16px]">
                          {item.a.map((block, k) => (
                            <Block key={k} block={block} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
      </div>
    </div>
  );
}

function Block({ block }: { block: FaqBlock }) {
  if ("p" in block) return <p className="[&+*]:mt-4">{block.p}</p>;
  if ("ol" in block)
    return (
      <ol className="mt-4 grid gap-2 [&+*]:mt-5">
        {block.ol.map((li, i) => (
          <li key={li.strong} className="flex gap-3">
            <span className="w-6 shrink-0 font-en text-[13px] leading-[1.85] tabular-nums text-ash/70">{String(i + 1).padStart(2, "0")}</span>
            <span>
              <strong className="font-semibold text-charcoal">{li.strong}:</strong> {li.text}
            </span>
          </li>
        ))}
      </ol>
    );
  return (
    // 좁은 화면에서도 옆으로 밀지 않고 칸 안에서 줄바꿈
    <div className="mt-4 [&+*]:mt-6">
      <table className="w-full border-collapse text-[13px] leading-[1.5] md:text-[14px]">
        <thead>
          <tr className="border-y border-charcoal">
            {block.table.head.map((h) => (
              <th key={h} scope="col" className="px-2 py-3 text-left align-top font-semibold text-charcoal md:px-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.table.rows.map((row) => (
            <tr key={row[0]} className="border-b border-stone">
              {row.map((cell, i) => (
                <td key={i} className={`px-2 py-3 align-top md:px-3 ${i === 0 ? "text-charcoal" : ""}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
