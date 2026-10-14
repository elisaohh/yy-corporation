import { HeroFloat } from "@/components/home/HeroFloat";
import { Pending } from "@/components/ui/Pending";
import { siteConfig } from "@/config/site";
import { assets } from "@/data/assets";

/**
 * ① HOME 인트로 — 소스는 siteConfig.heroMode로 바꾼다.
 *   float : 떠다니는 병 · 물방울 히어로 (현재 — HeroFloat)
 *   poster: 정지 포스터
 *   video : 영상 인트로 (공장 영상 등 공개 권한 확인 후)
 *   three : 실시간 3D
 */
export function HomeIntro() {
  if (siteConfig.heroMode === "float") return <HeroFloat />;
  return (
    <section
      data-header-theme="dark"
      data-surface="dark"
      data-no-top
      aria-label="인트로"
      className="relative h-[100svh] min-h-[560px] overflow-hidden bg-intro text-on-dark"
    >
      {siteConfig.heroMode === "poster" ? <IntroPoster /> : <IntroPending mode={siteConfig.heroMode} />}

      <p className="absolute bottom-8 left-[var(--gutter)] flex flex-wrap items-center gap-2 text-[13px] text-on-dark-sub md:bottom-10">
        <Pending kind="temporary" label="인트로 임시 화면" />
        빛 · 후가공 · 스포이드 조립 연출은 모션 단계에서 구현
      </p>
    </section>
  );
}

function IntroPoster() {
  const desktop = assets.heroPoster;
  const mobile = assets.heroPosterMobile;

  if (desktop.src) {
    return (
      <picture>
        {mobile.src && <source media="(max-width: 767px)" srcSet={mobile.src} />}
        {/* eslint-disable-next-line @next/next/no-img-element -- 포스터 원본 그대로 */}
        <img
          src={desktop.src}
          alt={desktop.alt}
          width={desktop.width}
          height={desktop.height}
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover"
        />
      </picture>
    );
  }

  // 원본 사진 제공 전: 빛이 모이는 중앙에 병 자리만 표시
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 size-[min(90vw,900px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0.04)_32%,transparent_62%)]"
      />
      <div className="relative grid aspect-[3/5] h-[min(52svh,460px)] place-items-center border border-dashed border-on-dark/25 px-4 text-center">
        <div className="grid gap-2">
          <p className="label-en text-[11px] text-on-dark-sub">Hero bottle</p>
          <p className="text-[14px]">기준 유리병 포스터 자리</p>
          <p className="text-[12px] text-on-dark-sub">원본 사진 제공 후 교체</p>
        </div>
      </div>
    </div>
  );
}

function IntroPending({ mode }: { mode: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center text-center">
      <p className="text-[14px] text-on-dark-sub">
        인트로 소스 &lsquo;{mode}&rsquo; 준비 중 <Pending />
      </p>
    </div>
  );
}
