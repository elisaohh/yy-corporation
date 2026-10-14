import { logoAlt, logoPlacement, logos, type LogoPlacement, type LogoVariant } from "@/data/brand";

interface LogoProps {
  /** 화면 위치 — data/brand.ts 의 배정표를 따른다 */
  placement?: LogoPlacement;
  /** 배정표 대신 특정 로고를 쓸 때 */
  variant?: LogoVariant;
  /** 배정표의 높이 대신 CSS로 크기를 지정할 때 사용 (예: "h-7 md:h-[34px]") */
  className?: string;
  /** 링크 안에서 이미 이름을 읽어 주면 장식 이미지로 처리 */
  decorative?: boolean;
  priority?: boolean;
}

/**
 * 공식 SVG 로고. 원본 파일을 <img>로 그대로 불러와 형태·색을 바꾸지 않는다.
 * (SVG를 인라인으로 넣으면 원본의 class 이름이 페이지 안에서 충돌할 수 있어 사용하지 않는다.)
 */
export function Logo({ placement = "headerDesktop", variant, className, decorative, priority }: LogoProps) {
  const slot = logoPlacement[placement];
  const asset = logos[variant ?? slot.variant];
  const height = slot.height;
  const width = Math.round((asset.width / asset.height) * height);

  return (
    // eslint-disable-next-line @next/next/no-img-element -- 원본 SVG를 변환 없이 사용
    <img
      src={asset.src}
      alt={decorative ? "" : logoAlt}
      width={width}
      height={height}
      className={className ?? "w-auto"}
      style={className ? undefined : { height }}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      draggable={false}
    />
  );
}
