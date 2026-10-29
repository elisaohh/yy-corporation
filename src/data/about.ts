/**
 * ABOUT 문구 — 회사가 직접 작성한 자료에서만 가져온다(새 사실을 만들지 않음).
 *   엑셀: 홈페이지_콘텐츠제작_가이드 ABOUT 시트(고객 작성란) · MAIN 시트
 *   YY LETTER Vol.01 회사 소개
 * 긴 원문은 문장 단위로 나눠 순서대로 등장시킨다. 표현은 원문 그대로 두고 일부 문장만 발췌했다.
 * 엑셀의 '플라스틱 용기'는 현재 사이트 범위(유리 용기) 밖이라 싣지 않았다.
 */

export const aboutIntro = {
  title: "About",
  /** YY LETTER 공식 문구 */
  slogan: "병 하나, 처음부터 끝까지",
  lead: "브랜드에 딱 맞는 병을 찾고, 옷을 입히고, 짝을 맞춰, 문 앞까지 데려다드려요.",
  source: "YY LETTER Vol.01 회사 소개",
};

export const story = {
  label: "Our Story",
  title: "친환경 유리의 감성으로 브랜드의 꿈을 실현하고, 환경에 기여하다",
  sentences: [
    "플라스틱 남용으로 인한 환경 문제가 대두되는 오늘날, YY코퍼레이션은 ‘지속 가능한 아름다움’에 대한 깊은 고민에서 출발했습니다.",
    "우리는 사출(플라스틱) 용기를 대체할 수 있는 친환경 소재인 ‘유리’ 특유의 맑고 투명한 감성, 그리고 변치 않는 보존성에 주목했습니다.",
    "화장품 브랜드사들이 그리던 이상적인 패키징의 꿈을 유리의 고급스러운 감성으로 실현시켜 드리는 것, 그리고 그 과정을 통해 지구 환경 보호에 기여하는 선한 영향력을 펼치고자 YY코퍼레이션을 설립하게 되었습니다.",
  ],
  source: "엑셀 ABOUT 시트 ① 회사 설립 배경",
};

export const vision = {
  label: "Our Vision",
  statement: "지속가능한 패키징 솔루션으로 뷰티 브랜드의 성공을 이끄는 글로벌 턴키 파트너",
  pillars: [
    {
      en: "Total Turnkey Expertise",
      ko: "완벽한 원스톱 턴키 솔루션",
      body: "디자인 제안, 국내 · 해외 부자재 소싱, 정밀 후가공, 품질 검사 및 배송까지 하나의 창구로 통합합니다. 고객사가 마케팅과 브랜드 성장에만 집중할 수 있도록 지원합니다.",
    },
    {
      en: "Brand Success & Value Creation",
      ko: "브랜드 가치와 성공의 동반자",
      body: "유리 특유의 고급스러운 감성과 디테일한 후가공 기술로 브랜드 고유의 아이덴티티를 시각화합니다. 고객사의 성공이 곧 YY코퍼레이션의 성공이라는 가치 아래 움직입니다.",
    },
  ],
  quote:
    "우리는 친환경 유리의 아름다운 감성과 무결점 턴키 프로세스로, 세상의 모든 뷰티 브랜드가 자신만의 빛나는 성공을 완벽히 담아낼 수 있도록 존재합니다.",
  source: "엑셀 ABOUT 시트 ③ 기업 비전",
};

/**
 * OUR BUSINESS — 머리말 + 사업 영역 4가지
 * title은 단어 단위로 나눠 스크롤에 따라 한 단어씩 진해진다.
 */
export const business = {
  label: "Our Business",
  title: ["오직", "고객의", "브랜드", "가치를", "높이는", "프리미엄", "패키징", "제공"],
  lead: "YY코퍼레이션의 모든 사업 영역은 고객사 브랜드의 가치를 극대화하고 시장에서의 성공을 돕는 데 맞춰져 있습니다.",
  items: [
    {
      no: "01",
      en: "GLASS PACKAGING",
      ko: "친환경 화장품 유리용기",
      body: "스킨케어, 드로퍼, 크림, 바디 제품 등 제품의 용도와 트렌드에 적합한 고품질 유리용기를 기획하고 공급합니다.",
    },
    {
      no: "02",
      en: "COMPONENT SOURCING",
      ko: "프리미엄 부자재 소싱",
      body: "유리용기와의 결합과 호환성을 고려하여 캡, 펌프, 스포이드 등 다양한 부자재를 함께 제안합니다.",
    },
    {
      no: "03",
      en: "DECORATION",
      ko: "정밀 후가공 솔루션",
      body: "코팅, 실크스크린, 박, 형압 등 다양한 후가공을 통해 브랜드의 아이덴티티와 감성을 패키지에 구현합니다.",
    },
    {
      no: "04",
      en: "GLOBAL SOURCING",
      ko: "글로벌 패키징 소싱",
      body: "국내·외 제조 네트워크를 활용하여 가격 경쟁력과 디자인을 고려한 다양한 패키징을 제안합니다.",
    },
  ],
};

/**
 * ABOUT 이미지 — public/assets/about (scripts/build-about-images.mjs)
 * ⚠ 모두 사용자가 제공한 생성 이미지다. 실제 YY CORPORATION 제품 · 생산 시설 사진이 아니므로 그렇게 설명하지 않는다.
 * position: 모바일에서 잘릴 때 지킬 핵심 피사체 위치(object-position)
 */
export type AboutVisual = { src: string; alt: string; width: number; height: number; position?: string };

export const aboutVisuals = {
  storyMain: { src: "/assets/about/01a-story-main.webp", alt: "빛이 비치는 두꺼운 유리 바닥 접사", width: 1536, height: 1024, position: "50% 60%" },
  storySub: { src: "/assets/about/01b-story-sub.webp", alt: "빛을 받은 투명 유리병의 어깨와 목 부분 클로즈업", width: 1536, height: 1024, position: "72% 50%" },
  business: {
    "01": { src: "/assets/about/02-glass-packaging.webp", alt: "다양한 형태의 투명 유리 화장품 용기", width: 1536, height: 1024, position: "50% 50%" },
    "02": { src: "/assets/about/03-component-sourcing.webp", alt: "스포이드 · 펌프 · 캡 등 화장품 용기 부자재", width: 1536, height: 1024, position: "50% 50%" },
    "03": { src: "/assets/about/04-decoration.webp", alt: "같은 형태의 유리병에 투명 · 유광 · 무광 마감을 적용한 비교", width: 1536, height: 1024, position: "50% 55%" },
    "04": { src: "/assets/about/05-global-sourcing.webp", alt: "정돈된 패키징 물류 창고", width: 1536, height: 1024, position: "45% 50%" },
  } as Record<string, AboutVisual>,
};
