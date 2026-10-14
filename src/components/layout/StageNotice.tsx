import { Pending } from "@/components/ui/Pending";

interface StageNoticeProps {
  /** 이 페이지에서 다음 단계에 만들 섹션 이름 */
  sections: string[];
  stage: string;
}

/** 공통 기반 단계의 자리표시자 — 아직 구현하지 않은 섹션을 목록으로 보여 준다. */
export function StageNotice({ sections, stage }: StageNoticeProps) {
  return (
    <section data-header-theme="light" className="container-yy pb-32">
      <div className="border border-dashed border-stone px-6 py-8 md:px-10 md:py-12">
        <p className="flex flex-wrap items-center gap-2 text-[14px] text-ash">
          <Pending kind="temporary" label="공통 기반 확인용" />
          {stage}에서 구현할 섹션
        </p>
        <ol className="mt-6 grid gap-3">
          {sections.map((name, index) => (
            <li key={name} className="grid grid-cols-[32px_minmax(0,1fr)] items-baseline border-t border-stone pt-3 text-[15px]">
              <span className="font-en text-[13px] tabular-nums text-ash">{String(index + 1).padStart(2, "0")}</span>
              <span>{name}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
