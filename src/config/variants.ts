/**
 * HOME 시안 비교용 변형(2026-10-15 사용자 요청: 히어로 · 회사 소개 · 슬로건 여러 안).
 * 주소 뒤에 ?hero=b&intro=c&slogan=a 처럼 붙여 비교한다. 결정되면 default만 바꾸고 나머지는 지운다.
 */
export const variantOptions = {
  hero: {
    default: "a",
    options: {
      a: "크게 · 위로 — 사진 확대, 제목과 더 겹침",
      b: "제목 뒤 사진 — 큰 제목 위에 병이 떠 있음",
      c: "아치 배경 — 옅은 면 위에 병",
    },
  },
  intro: {
    default: "a",
    options: {
      a: "차콜 배경 · 4열 큰 단어(스크롤 따라 차례로 올라옴)",
      b: "미스트 배경 · 가로로 흐르는 4개 패널(고정)",
      c: "스톤 배경 · 큰 세로 목록(지나가는 항목 강조)",
    },
  },
  slogan: {
    default: "a",
    options: {
      a: "미스트 배경 · 굵은 글씨 · 반투명 로고 그래픽",
      b: "옐로 배경 · 굵은 글씨 · 떠다니는 물방울",
      c: "흰 배경 · 굵은 글씨 + 제품 사진",
    },
  },
} as const;

export type VariantKey = keyof typeof variantOptions;
export type HeroVariant = keyof (typeof variantOptions)["hero"]["options"];
export type IntroVariant = keyof (typeof variantOptions)["intro"]["options"];
export type SloganVariant = keyof (typeof variantOptions)["slogan"]["options"];

export function pickVariant<K extends VariantKey>(key: K, value: string | string[] | undefined) {
  const v = Array.isArray(value) ? value[0] : value;
  const opts = variantOptions[key].options as Record<string, string>;
  return (v && v in opts ? v : variantOptions[key].default) as keyof (typeof variantOptions)[K]["options"];
}
