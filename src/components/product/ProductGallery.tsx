"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type TouchEvent } from "react";
import { AssetImage, isPlaceholderAsset } from "@/components/media/AssetImage";
import { Pending } from "@/components/ui/Pending";
import { getAsset, type AssetId } from "@/data/assets";

interface ProductGalleryProps {
  images: AssetId[];
  productName: string;
}

const SWIPE_THRESHOLD = 40;

/**
 * 상세 이미지 갤러리 — 큰 이미지 + 이전/다음 + 카운터(1 / N) + 가로 썸네일 (기획서 2.0 부록 D).
 * - 데스크톱(정밀 포인터): 이미지를 "클릭"하면 2배 확대, 확대 중에는 커서를 따라 이동,
 *   다시 클릭하거나 이미지 밖으로 나가거나 ESC를 누르면 원래 크기. 버튼·썸네일 위에서는 확대되지 않는다.
 * - 모바일: 한 손가락 스와이프로 넘기기, 두 손가락 핀치는 브라우저 기본 확대를 그대로 허용
 * - 키보드: 이미지 영역에 포커스 후 ← → 로 이동
 */
export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const [canZoom, setCanZoom] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const total = images.length;
  const current = images[index];

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanZoom(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const go = (next: number) => {
    setZoomed(false);
    setIndex(Math.max(0, Math.min(total - 1, next)));
  };

  const pointToOrigin = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setOrigin({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  const onSurfaceClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!canZoom) return;
    pointToOrigin(event);
    setZoomed((value) => !value);
  };

  const onSurfaceMove = (event: MouseEvent<HTMLDivElement>) => {
    if (zoomed) pointToOrigin(event);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && zoomed) {
      event.preventDefault();
      setZoomed(false);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1);
    }
  };

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStart.current = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
  };

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || event.changedTouches.length !== 1) return;
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1));
  };

  if (total === 0) {
    return <div className="mx-auto aspect-square w-full max-w-[560px] bg-card" aria-label="제품 이미지 준비 중" />;
  }

  return (
    <div className="mx-auto grid w-full max-w-[560px] gap-4">
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label={`${productName} 이미지`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative aspect-square w-full overflow-hidden bg-card outline-offset-4 [touch-action:pan-y_pinch-zoom]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <AssetImage
          key={current}
          id={current}
          priority={index === 0}
          className="fade-in pointer-events-none absolute inset-0 size-full object-contain mix-blend-multiply transition-transform duration-300 ease-[var(--ease-yy-out)]"
          style={{
            transform: zoomed ? "scale(2)" : "scale(1)",
            transformOrigin: `${origin.x}% ${origin.y}%`,
          }}
        />

        {/* 확대 전용 영역 — 컨트롤(z-10)보다 아래에 있어 버튼 위에서는 반응하지 않는다 */}
        <div
          aria-hidden="true"
          onClick={onSurfaceClick}
          onMouseMove={onSurfaceMove}
          onMouseLeave={() => setZoomed(false)}
          className={`absolute inset-0 ${canZoom ? (zoomed ? "cursor-zoom-out" : "cursor-zoom-in") : ""}`}
        />

        {isPlaceholderAsset(current) && (
          <span className="pointer-events-none absolute left-4 top-4 z-10">
            <Pending kind="temporary" label="임시 이미지" />
          </span>
        )}

        <p className="pointer-events-none absolute bottom-4 left-4 z-10 font-en text-[12px] tracking-[0.08em] tabular-nums text-ash" aria-live="polite">
          <span className="sr-only">{getAsset(current).alt}, </span>
          {index + 1} / {total}
        </p>

        {total > 1 && (
          <div className="absolute bottom-3 right-3 z-10 flex gap-2">
            <GalleryArrow direction="prev" disabled={index === 0} onClick={() => go(index - 1)} />
            <GalleryArrow direction="next" disabled={index === total - 1} onClick={() => go(index + 1)} />
          </div>
        )}
      </div>

      {total > 1 && (
        <ul className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:thin]" aria-label="썸네일">
          {images.map((id, i) => (
            <li key={`${id}-${i}`} className="shrink-0">
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`이미지 ${i + 1} 보기`}
                aria-current={i === index ? "true" : undefined}
                className={`block size-[72px] overflow-hidden bg-card transition-shadow duration-200 md:size-20 ${
                  i === index ? "shadow-[inset_0_0_0_1.5px_var(--color-charcoal)]" : "shadow-[inset_0_0_0_1px_var(--color-stone)] hover:shadow-[inset_0_0_0_1px_var(--color-ash)]"
                }`}
              >
                <AssetImage id={id} decorative thumb className="size-full object-contain p-1 mix-blend-multiply" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function GalleryArrow({ direction, disabled, onClick }: { direction: "prev" | "next"; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "이전 이미지" : "다음 이미지"}
      className="inline-flex size-11 items-center justify-center rounded-full border border-stone bg-paper/90 text-charcoal transition-colors duration-200 hover:border-charcoal disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-stone"
    >
      <span
        aria-hidden="true"
        className={`block size-2.5 border-l-[1.5px] border-t-[1.5px] border-current ${direction === "prev" ? "ml-1 -rotate-45" : "mr-1 rotate-[135deg]"}`}
      />
    </button>
  );
}
