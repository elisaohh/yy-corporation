import { Logo } from "@/components/brand/Logo";
import { StageNotice } from "@/components/layout/StageNotice";
import { Pending } from "@/components/ui/Pending";

/**
 * HOME — 공통 기반 단계의 골격.
 * 헤더 색 전환(차콜 ↔ 화이트)과 숨김/재등장을 확인하기 위한 최소 구성이며,
 * 실제 HOME 섹션(인트로 연출·슬로건·FIND/DRESS/MATCH/DELIVER 등)은 다음 단계에서 구현한다.
 */
export default function HomePage() {
  return (
    <>
      <section
        data-header-theme="dark"
        data-surface="dark"
        data-no-top
        aria-label="인트로"
        className="relative flex min-h-[100svh] flex-col items-center justify-center bg-intro px-gutter text-on-dark"
      >
        <Logo placement="homeIntro" priority className="h-[88px] w-auto md:h-[120px]" />
        <p className="absolute bottom-10 flex items-center gap-2 text-[13px] text-on-dark-sub">
          <Pending kind="temporary" label="인트로 자리" />
          3D · 시퀀스 연출은 모션 단계에서 구현
        </p>
      </section>

      <div className="pt-[calc(var(--header-h)+64px)]">
        <StageNotice
          stage="HOME 단계"
          sections={[
            "유리 반사광을 통한 화이트 전환 (첫 시안은 임시 전환)",
            "슬로건 — 병 하나, / 처음부터 끝까지",
            "FIND / DRESS / MATCH / DELIVER",
            "대표 제품 쇼케이스 (2–3개)",
            "차콜 CTA (문구 미확정)",
          ]}
        />
      </div>

      <section
        data-header-theme="dark"
        data-surface="dark"
        data-no-top
        aria-label="마지막 CTA 자리"
        className="flex min-h-[60svh] items-center bg-outro text-on-dark"
      >
        <div className="container-yy">
          <p className="flex items-center gap-2 text-[13px] text-on-dark-sub">
            <Pending kind="temporary" label="CTA 자리" />
            헤더 색 전환 확인용 차콜 구역
          </p>
        </div>
      </section>
    </>
  );
}
